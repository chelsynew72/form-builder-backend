
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { PipelineProcessor } from '../ai/processors/pipeline.processor';
import { AiModule } from '../ai/ai.module';
import { SubmissionsModule } from '../submissions/submissions.module';
import { PipelinesModule } from '../pipelines/pipelines.module';
import { Submission, SubmissionSchema } from '../submissions/schemas/submission.schema';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'pipeline-processing',
    }),
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    AiModule,
    SubmissionsModule,
    PipelinesModule,
  ],
  providers: [PipelineProcessor],
  exports: [BullModule],
})
export class QueueModule {}