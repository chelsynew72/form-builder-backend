// backend/src/ai/processors/pipeline.processor.ts
import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AiService } from '../ai.service';
import { SubmissionsService } from '../../submissions/submissions.service';
import { PipelinesService } from '../../pipelines/pipelines.service';
import { EmailService } from '../../email/email.service'; // ✅ Add this
import { Submission } from '../../submissions/schemas/submission.schema';
import { Form } from '../../forms/schemas/form.schema'; // ✅ Add this
import { User } from '../../users/schemas/user.schema'; // ✅ Add this

@Processor('pipeline-processing')
@Injectable()
export class PipelineProcessor {
  private readonly logger = new Logger(PipelineProcessor.name);

  constructor(
    private aiService: AiService,
    private submissionsService: SubmissionsService,
    private pipelinesService: PipelinesService,
    private emailService: EmailService, // ✅ Inject EmailService
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    @InjectModel(Form.name) private formModel: Model<Form>, // ✅ Add this
    @InjectModel(User.name) private userModel: Model<User>, // ✅ Add this
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
      user = await this.userModel.findById(form.userId).exec();

      if (!submission) {
        throw new Error(`Submission not found: ${submissionId}`);
      }

      if (!form) {
        throw new Error(`Form not found: ${formId}`);
      }

      // ✅ Send "New Submission" email
      if (user && user.email) {
        const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/forms/${formId}/submissions/${submissionId}`;
        await this.emailService.sendNewSubmissionNotification(
          user.email,
          form.name,
          submissionId,
          submission.data,
          dashboardUrl,
        );
      }

      const pipeline = await this.pipelinesService.findByFormId(formId);

      if (!pipeline || !pipeline.steps || pipeline.steps.length === 0) {
        this.logger.warn(`No pipeline found or pipeline has no steps for form: ${formId}`);
        await this.submissionsService.updateStatus(submissionId, 'completed');
        
        // ✅ Send "Processing Complete" email (no steps)
        if (user && user.email) {
          const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/forms/${formId}/submissions/${submissionId}`;
          await this.emailService.sendProcessingCompleteNotification(
            user.email,
            form.name,
            submissionId,
            0,
            dashboardUrl,
          );
        }
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

        const { text, tokenCount } = await this.aiService.generateResponse(
          prompt,
          step.model || 'gemini-1.5-pro',
        );

        const duration = Date.now() - startTime;

        await this.submissionsService.createStepOutput({
          submissionId: new Types.ObjectId(submissionId),
          stepNumber: step.stepNumber,
          stepName: step.name,
          prompt: prompt,
          output: text,
          tokenCount,
          duration,
          model: step.model || 'gemini-1.5-pro',
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

      // ✅ Send "Processing Complete" email
      if (user && user.email) {
        const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/forms/${formId}/submissions/${submissionId}`;
        await this.emailService.sendProcessingCompleteNotification(
          user.email,
          form.name,
          submissionId,
          pipeline.steps.length,
          dashboardUrl,
        );
      }

    } catch (error) {
      this.logger.error(`Pipeline processing failed for submission ${submissionId}:`, error);
      await this.submissionsService.updateStatus(
        submissionId,
        'failed',
        error.message,
      );

      // ✅ Send "Processing Failed" email
      if (user && user.email) {
        const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/forms/${formId}/submissions/${submissionId}`;
        await this.emailService.sendProcessingFailedNotification(
          user.email,
          form.name,
          submissionId,
          error.message,
          dashboardUrl,
        );
      }

      throw error;
    }
  }
}