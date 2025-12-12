import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AiService } from '../ai.service';
import { SubmissionsService } from '../../submissions/submissions.service';
import { PipelinesService } from '../../pipelines/pipelines.service';
import { EmailService } from '../../email/email.service'; 
import { Submission } from '../../submissions/schemas/submission.schema';
import { Form } from '../../forms/schemas/form.schema'; 
import { User } from '../../users/schemas/user.schema'; 

@Processor('pipeline-processing')
@Injectable()
export class PipelineProcessor {
  private readonly logger = new Logger(PipelineProcessor.name);

  constructor(
    private aiService: AiService,
    private submissionsService: SubmissionsService,
    private pipelinesService: PipelinesService,
    private emailService: EmailService, 
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    @InjectModel(Form.name) private formModel: Model<Form>, 
    @InjectModel(User.name) private userModel: Model<User>, 
  ) {}

  @Process('process-pipeline')
  async handlePipelineProcessing(job: Job) {
    const { submissionId, formId } = job.data;
    this.logger.log(`Processing pipeline for submission: ${submissionId}`);

    let form: any;
    let user: any;

    try {
      // Update status to processing
      await this.submissionsService.updateStatus(submissionId, 'processing');

      // Get submission, form, and user
      const submission = await this.submissionModel.findById(submissionId).exec();
      form = await this.formModel.findById(formId).exec();
      user = await this.userModel.findById(form?.userId).exec();

      if (!submission) {
        throw new Error(`Submission not found: ${submissionId}`);
      }

      if (!form) {
        throw new Error(`Form not found: ${formId}`);
      }

      // Send "New Submission" email (non-blocking)
      this.sendEmailSafely(async () => {
        if (user && user.email) {
          const dashboardUrl = this.buildDashboardUrl(formId, submissionId);
          await this.emailService.sendNewSubmissionNotification(
            user.email,
            form.name,
            submissionId,
            submission.data,
            dashboardUrl,
          );
        }
      }, 'New Submission');

      const pipeline = await this.pipelinesService.findByFormId(formId);

      if (!pipeline || !pipeline.steps || pipeline.steps.length === 0) {
        this.logger.warn(`No pipeline found or pipeline has no steps for form: ${formId}`);
        await this.submissionsService.updateStatus(submissionId, 'completed');
        
        // Send "Processing Complete" email (no steps)
        this.sendEmailSafely(async () => {
          if (user && user.email) {
            const dashboardUrl = this.buildDashboardUrl(formId, submissionId);
            await this.emailService.sendProcessingCompleteNotification(
              user.email,
              form.name,
              submissionId,
              0,
              dashboardUrl,
            );
          }
        }, 'Processing Complete (No Steps)');
        
        return;
      }

      const previousOutputs: Array<{ stepNumber: number; output: string }> = [];

      // Process each step sequentially
      for (const step of pipeline.steps) {
        const startTime = Date.now();

        this.logger.log(`Executing step ${step.stepNumber} for submission ${submissionId}`);

        const prompt = this.aiService.buildPrompt(
          step.prompt,
          submission.data,
          previousOutputs,
        );

        
        const { text, tokenCount, modelUsed, retries } = await this.aiService.generateResponse(
          prompt,
          step.model || 'gemini-2.0-flash-exp',
        );

        const duration = Date.now() - startTime;

        // Log if retries or fallback occurred
        if (retries > 0) {
          this.logger.warn(
            `Step ${step.stepNumber} completed after ${retries} retries using model: ${modelUsed}`
          );
        }

        await this.submissionsService.createStepOutput({
          submissionId: new Types.ObjectId(submissionId),
          stepNumber: step.stepNumber,
          stepName: step.name,
          prompt: prompt,
          output: text,
          tokenCount,
          duration,
          model: modelUsed, // Store the actual model used (may differ from requested)
          executedAt: new Date(),
        });

        previousOutputs.push({
          stepNumber: step.stepNumber,
          output: text,
        });

        this.logger.log(`Completed step ${step.stepNumber} in ${duration}ms`);
      }

      // Update submission status to completed
      await this.submissionsService.updateStatus(submissionId, 'completed');
      this.logger.log(`Pipeline processing completed for submission: ${submissionId}`);

      // Send "Processing Complete" email
      this.sendEmailSafely(async () => {
        if (user && user.email) {
          const dashboardUrl = this.buildDashboardUrl(formId, submissionId);
          await this.emailService.sendProcessingCompleteNotification(
            user.email,
            form.name,
            submissionId,
            pipeline.steps.length,
            dashboardUrl,
          );
        }
      }, 'Processing Complete');

    } catch (error) {
      this.logger.error(
        `Pipeline processing failed for submission ${submissionId}:`,
        error.stack || error
      );
      
      // Update submission status
      await this.submissionsService.updateStatus(
        submissionId,
        'failed',
        this.getErrorMessage(error),
      );

      // Send failure notification email
      this.sendEmailSafely(async () => {
        if (user && user.email) {
          const dashboardUrl = this.buildDashboardUrl(formId, submissionId);
          await this.emailService.sendProcessingFailedNotification(
            user.email,
            form.name,
            submissionId,
            this.getErrorMessage(error),
            dashboardUrl,
          );
        }
      }, 'Processing Failed');

      throw error;
    }
  }

  
  private async sendEmailSafely(
    emailFn: () => Promise<void>,
    emailType: string,
  ): Promise<void> {
    try {
      await Promise.race([
        emailFn(),
        this.timeout(60000) // 60 second timeout for emails (increased for slow SMTP)
      ]);
      this.logger.log(`✉️ ${emailType} email sent successfully`);
    } catch (error) {
      this.logger.error(
        `⚠️ Failed to send ${emailType} email (non-blocking):`,
        error.message
      );
      // Don't throw - email failures shouldn't stop pipeline processing
    }
  }

  /**
   * Timeout promise helper
   */
  private timeout(ms: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Email timeout after ${ms}ms`)), ms)
    );
  }

  /**
   * Build dashboard URL
   */
  private buildDashboardUrl(formId: string, submissionId: string): string {
    const baseUrl = process.env.FRONTEND_URL || 'https://form-builder-client-pi.vercel.app/';
    return `${baseUrl}/forms/${formId}/submissions/${submissionId}`;
  }

  /**
   * Extract clean error message
   */
  private getErrorMessage(error: any): string {
    if (error.message) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Unknown error occurred';
  }
}