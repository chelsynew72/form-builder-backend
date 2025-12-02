// backend/src/pipelines/pipelines.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pipeline } from './schemas/pipeline.schema';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';

@Injectable()
export class PipelinesService {
  constructor(
    @InjectModel(Pipeline.name) private pipelineModel: Model<Pipeline>,
  ) {}

  async createOrUpdate(createPipelineDto: CreatePipelineDto): Promise<Pipeline> {
    const { formId, ...pipelineData } = createPipelineDto;

    const pipeline = await this.pipelineModel.findOneAndUpdate(
      { formId: new Types.ObjectId(formId) }, // ✅ Convert to ObjectId
      { formId: new Types.ObjectId(formId), ...pipelineData },
      { 
        new: true,
        upsert: true,
      }
    ).exec();

    console.log('✅ Pipeline saved for formId:', formId);
    return pipeline;
  }

  async findByFormId(formId: string): Promise<Pipeline | null> {
    console.log('🔍 Finding pipeline for formId:', formId);
    const pipeline = await this.pipelineModel
      .findOne({ formId: new Types.ObjectId(formId) }) // ✅ Convert to ObjectId
      .exec();
    console.log('📋 Pipeline found:', pipeline ? 'YES' : 'NO');
    return pipeline;
  }

  async update(formId: string, updatePipelineDto: UpdatePipelineDto): Promise<Pipeline> {
    const pipeline = await this.pipelineModel
      .findOneAndUpdate(
        { formId: new Types.ObjectId(formId) }, // ✅ Convert to ObjectId
        updatePipelineDto,
        { new: true, upsert: true }
      )
      .exec();
    return pipeline;
  }

  async delete(formId: string): Promise<void> {
    await this.pipelineModel
      .deleteOne({ formId: new Types.ObjectId(formId) }) // ✅ Convert to ObjectId
      .exec();
  }
}