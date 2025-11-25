
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: string[]; // For select, radio, checkbox
  helpText?: string;
  order: number;
}

@Schema({ timestamps: true })
export class Form extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [Object], default: [] })
  fields: FormField[];

  @Prop({ unique: true, required: true })
  publicId: string; // For public URL

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  submissionCount: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const FormSchema = SchemaFactory.createForClass(Form);