import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ default: 'free' })
  plan: string;

  @Prop()
  apiKey?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: Object, default: {
  newSubmission: true,
  processingComplete: true,
  processingFailed: true,
  weeklyDigest: false,
}})
emailPreferences?: {
  newSubmission: boolean;
  processingComplete: boolean;
  processingFailed: boolean;
  weeklyDigest: boolean;
};
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
