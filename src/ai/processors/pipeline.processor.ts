// backend/src/ai/processors/pipeline.processor.ts
import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  async handlePipelineProcessing(job: Job) {
    const { submissionId, formId } = job.data;
    this.logger.log(`Processing pipeline for submission: ${submissionId}`);

    try {
      // Update status to processing
      await this.submissionsService.updateStatus(submissionId, 'processing');

      // Get submission and pipeline
      const submission = await this.submissionModel.findById(submissionId).exec();
      
      if (!submission) {
        this.logger.warn(`Submission not found: ${submissionId}`);
        await this.submissionsService.updateStatus(submissionId, 'failed', 'Submission not found');
        return;
      }

      console.log('🔍 Looking for pipeline with formId:', formId); // Debug log
      const pipeline = await this.pipelinesService.findByFormId(formId);
      
      console.log('📋 Pipeline found:', pipeline ? 'YES' : 'NO'); // Debug log
      
      if (pipeline) {
        console.log('📋 Pipeline steps:', pipeline.steps?.length || 0); // Debug log
      }

      if (!pipeline || !pipeline.steps || pipeline.steps.length === 0) {
        this.logger.warn(`No pipeline found or pipeline has no steps for form: ${formId}`);
        await this.submissionsService.updateStatus(submissionId, 'completed');
        return;
      }

      const previousOutputs: Array<{ stepNumber: number; output: string }> = [];

      // Process each step sequentially
      for (const step of pipeline.steps) {
        const startTime = Date.now();

        this.logger.log(`Executing step ${step.stepNumber} for submission ${submissionId}`);

        // Build prompt with form data and previous outputs
        const prompt = this.aiService.buildPrompt(
          step.prompt,
          submission.data,
          previousOutputs,
        );

        // Call AI API
        const { text, tokenCount } = await this.aiService.generateResponse(
          prompt,
          step.model || 'gemini-1.5-pro',
        );

        const duration = Date.now() - startTime;

        // Save step output
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