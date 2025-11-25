
import { Processor, Process } from '@nestjs/bull';
import bull from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiService } from '../ai.service';
import { SubmissionsService } from '../../submissions/submissions.service';
import { PipelinesService } from '../../pipelines/pipelines.service';
import { Submission } from '../../submissions/schemas/submission.schema';

@Processor('pipeline-processing')
@Injectable()
export class PipelineProcessor {
  private readonly logger = new Logger(PipelineProcessor.name);

  constructor(
    private aiService: AiService,
    private submissionsService: SubmissionsService,
    private pipelinesService: PipelinesService,
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
  ) {}

  @Process('process-pipeline')
  async handlePipelineProcessing(job: bull.Job) {
    const { submissionId, formId } = job.data;
    this.logger.log(`Processing pipeline for submission: ${submissionId}`);

    try {
      // Update status to processing
      await this.submissionsService.updateStatus(submissionId, 'processing');

      // Get submission and pipeline
      const submission = await this.submissionModel.findById(submissionId).exec();
      if (!submission) {
        throw new Error(`Submission ${submissionId} not found`);
      }
      const pipeline = await this.pipelinesService.findByFormId(formId);

      if (!pipeline || !pipeline.steps || pipeline.steps.length === 0) {
        throw new Error('Pipeline not found or has no steps');
      }

      const previousOutputs: Array<{ stepNumber: number; output: string }> = [];

      // Process each step sequentially
      for (const step of pipeline.steps) {
        const startTime = Date.now();

        // Build prompt with form data and previous outputs
        const prompt = this.aiService.buildPrompt(
          step.prompt,
          submission.data,
          previousOutputs,
        );

        this.logger.log(`Executing step ${step.stepNumber} for submission ${submissionId}`);

        // Call AI API
        const { text, tokenCount } = await this.aiService.generateResponse(
          prompt,
          step.model || 'claude-sonnet-4-20250514',
        );

        const duration = Date.now() - startTime;

        // Save step output
        await this.submissionsService.createStepOutput({
          submissionId,
          stepNumber: step.stepNumber,
          stepName: step.name,
          prompt: step.prompt,
          output: text,
          tokenCount,
          duration,
          model: step.model || 'claude-sonnet-4-20250514',
          executedAt: new Date(),
        });

        // Add to previous outputs for next step
        previousOutputs.push({
          stepNumber: step.stepNumber,
          output: text,
        });

        this.logger.log(`Completed step ${step.stepNumber} in ${duration}ms`);
      }

      // Update submission status to completed
      await this.submissionsService.updateStatus(submissionId, 'completed');
      this.logger.log(`Pipeline processing completed for submission: ${submissionId}`);

    } catch (error) {
      this.logger.error(`Pipeline processing failed for submission ${submissionId}:`, error);
      await this.submissionsService.updateStatus(
        submissionId,
        'failed',
        error.message,
      );
      throw error;
    }
  }
}