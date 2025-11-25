import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { StepOutput, StepOutputSchema } from './schemas/step-output.schema';
import { FormsModule } from '../forms/forms.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
      { name: StepOutput.name, schema: StepOutputSchema },
    ]),
    BullModule.registerQueue({
      name: 'pipeline-processing',
    }),
    FormsModule,
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
