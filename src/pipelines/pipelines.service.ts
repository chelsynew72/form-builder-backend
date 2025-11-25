
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pipeline } from './schemas/pipeline.schema';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';

@Injectable()
export class PipelinesService {
  findAll() {
    throw new Error('Method not implemented.');
  }
  findOne(arg0: number) {
    throw new Error('Method not implemented.');
  }
  remove(arg0: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Pipeline.name) private pipelineModel: Model<Pipeline>,
  ) {}

  async create(createPipelineDto: CreatePipelineDto): Promise<Pipeline> {
    const pipeline = new this.pipelineModel(createPipelineDto);
    return pipeline.save();
  }

  async findByFormId(formId: string): Promise<Pipeline | null> {
    return this.pipelineModel.findOne({ formId }).exec();
  }

  async update(formId: string, updatePipelineDto: UpdatePipelineDto): Promise<Pipeline> {
    const pipeline = await this.pipelineModel
      .findOneAndUpdate({ formId }, updatePipelineDto, { new: true, upsert: true })
      .exec();
    return pipeline;
  }

  async delete(formId: string): Promise<void> {
    await this.pipelineModel.deleteOne({ formId }).exec();
  }
}