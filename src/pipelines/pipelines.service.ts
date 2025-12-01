// backend/src/pipelines/pipelines.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pipeline } from './schemas/pipeline.schema';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';

@Injectable()
export class PipelinesService {
  constructor(
    @InjectModel(Pipeline.name) private pipelineModel: Model<Pipeline>,
  ) {}

  // ✅ FIXED: Use upsert to create OR update
  async createOrUpdate(createPipelineDto: CreatePipelineDto & { formId?: string }): Promise<Pipeline> {
    const { formId, ...pipelineData } = createPipelineDto;

    // Find existing pipeline or create new one
    const pipeline = await this.pipelineModel.findOneAndUpdate(
      { formId },
      { formId, ...pipelineData },
      { 
        new: true,      // Return updated document
        upsert: true,   // Create if doesn't exist
      }
    ).exec();

    return pipeline;
  }

  async findByFormId(formId: string): Promise<Pipeline | null> {
    return this.pipelineModel.findOne({ formId }).exec();
  }

  async update(formId: string, updatePipelineDto: UpdatePipelineDto): Promise<Pipeline> {
    const pipeline = await this.pipelineModel
      .findOneAndUpdate(
        { formId },
        updatePipelineDto,
        { new: true, upsert: true }
      )
      .exec();
    return pipeline;
  }

  async delete(formId: string): Promise<void> {
    await this.pipelineModel.deleteOne({ formId }).exec();
  }
}