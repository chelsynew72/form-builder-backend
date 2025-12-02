// backend/src/submissions/schemas/submission.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Submission extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Form', required: true }) // ✅ Make sure this is ObjectId
  formId: Types.ObjectId;

  @Prop({ type: Object, required: true })
  data: Record<string, any>;

  @Prop({ 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  })
  status: string;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  errorMessage?: string;

  @Prop({ default: Date.now })
  submittedAt: Date;

  @Prop()
  processedAt?: Date;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
SubmissionSchema.index({ formId: 1, submittedAt: -1 });