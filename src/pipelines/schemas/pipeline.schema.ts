
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface PipelineStep {
  stepNumber: number;
  name: string;
  prompt: string;
  description?: string;
  model?: string; // e.g., 'claude-sonnet-4-20250514'
}

@Schema({ timestamps: true })
export class Pipeline extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Form', required: true, unique: true })
  formId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [Object], default: [] })
  steps: PipelineStep[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PipelineSchema = SchemaFactory.createForClass(Pipeline);