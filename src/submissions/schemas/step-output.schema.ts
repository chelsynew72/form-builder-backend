import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class StepOutput {
  @Prop({ type: Types.ObjectId, ref: 'Submission', required: true })
  submissionId: Types.ObjectId;

  @Prop({ required: true })
  stepNumber: number;

  @Prop({ required: true })
  stepName: string;

  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true, type: String })
  output: string;

  @Prop()
  tokenCount?: number;

  @Prop()
  duration?: number;

  @Prop()
  model?: string;

  @Prop({ default: Date.now })
  executedAt: Date;
}

export type StepOutputDocument = StepOutput & Document;
export const StepOutputSchema = SchemaFactory.createForClass(StepOutput);

// Index
StepOutputSchema.index({ submissionId: 1, stepNumber: 1 });
