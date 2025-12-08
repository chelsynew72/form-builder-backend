import type { Job } from 'bull';
import { Model } from 'mongoose';
import { AiService } from '../ai.service';
import { SubmissionsService } from '../../submissions/submissions.service';
import { PipelinesService } from '../../pipelines/pipelines.service';
import { EmailService } from '../../email/email.service';
import { Submission } from '../../submissions/schemas/submission.schema';
import { Form } from '../../forms/schemas/form.schema';
import { User } from '../../users/schemas/user.schema';
export declare class PipelineProcessor {
    private aiService;
    private submissionsService;
    private pipelinesService;
    private emailService;
    private submissionModel;
    private formModel;
    private userModel;
    private readonly logger;
    constructor(aiService: AiService, submissionsService: SubmissionsService, pipelinesService: PipelinesService, emailService: EmailService, submissionModel: Model<Submission>, formModel: Model<Form>, userModel: Model<User>);
    handlePipelineProcessing(job: Job): Promise<void>;
}
