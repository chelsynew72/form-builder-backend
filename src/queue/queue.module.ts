
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { PipelineProcessor } from '../ai/processors/pipeline.processor';
import { AiModule } from '../ai/ai.module';
import { SubmissionsModule } from '../submissions/submissions.module';
import { PipelinesModule } from '../pipelines/pipelines.module';
import { EmailModule } from '../email/email.module'; 
import { Submission, SubmissionSchema } from '../submissions/schemas/submission.schema';
import { Form, FormSchema } from '../forms/schemas/form.schema'; 
import { User, UserSchema } from '../users/schemas/user.schema'; 

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'pipeline-processing',
    }),
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
      { name: Form.name, schema: FormSchema }, 
      { name: User.name, schema: UserSchema }, 
    ]),
    AiModule,
    SubmissionsModule,
    PipelinesModule,
    EmailModule, 
  ],
  providers: [PipelineProcessor],
  exports: [BullModule],
})
export class QueueModule {}