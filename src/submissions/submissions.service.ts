
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Submission } from './schemas/submission.schema';
import { StepOutput } from './schemas/step-output.schema';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { QuerySubmissionsDto } from './dto/query-submissions.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    @InjectModel(StepOutput.name) private stepOutputModel: Model<StepOutput>,
    @InjectQueue('pipeline-processing') private pipelineQueue: Queue,
  ) {}

  async create(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    const submission = new this.submissionModel({
      ...createSubmissionDto,
      status: 'pending',
      submittedAt: new Date(),
    });
    const savedSubmission = await submission.save();

    // Add to queue for processing
    await this.pipelineQueue.add('process-pipeline', {
      submissionId: savedSubmission._id.toString(),
      formId: savedSubmission.formId.toString(),
    });

    return savedSubmission;
  }

  async findAll(formId: string, query: QuerySubmissionsDto): Promise<{ data: Submission[], total: number }> {
    const { page = 1, limit = 20, status, search } = query;
    const filter: any = { formId };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter['data'] = { $regex: search, $options: 'i' };
    }

    const total = await this.submissionModel.countDocuments(filter);
    const data = await this.submissionModel
      .find(filter)
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { data, total };
  }

  async findOne(id: string): Promise<{ submission: Submission, outputs: StepOutput[] }> {
    const submission = await this.submissionModel.findById(id).exec();
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const outputs = await this.stepOutputModel
      .find({ submissionId: id })
      .sort({ stepNumber: 1 })
      .exec();

    return { submission, outputs };
  }

  async updateStatus(id: string, status: string, errorMessage?: string): Promise<void> {
    const update: any = { status };
    if (status === 'completed' || status === 'failed') {
      update.processedAt = new Date();
    }
    if (errorMessage) {
      update.errorMessage = errorMessage;
    }
    await this.submissionModel.updateOne({ _id: id }, update).exec();
  }

  async createStepOutput(stepOutput: Partial<StepOutput>): Promise<StepOutput> {
    const output = new this.stepOutputModel(stepOutput);
    return output.save();
  }

  async delete(id: string): Promise<void> {
    await this.submissionModel.deleteOne({ _id: id }).exec();
    await this.stepOutputModel.deleteMany({ submissionId: id }).exec();
  }
}