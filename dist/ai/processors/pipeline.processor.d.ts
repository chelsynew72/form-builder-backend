import bull from 'bull';
import { Model } from 'mongoose';
import { AiService } from '../ai.service';
import { SubmissionsService } from '../../submissions/submissions.service';
import { PipelinesService } from '../../pipelines/pipelines.service';
import { Submission } from '../../submissions/schemas/submission.schema';
export declare class PipelineProcessor {
    private aiService;
    private submissionsService;
    private pipelinesService;
    private submissionModel;
    private readonly logger;
    constructor(aiService: AiService, submissionsService: SubmissionsService, pipelinesService: PipelinesService, submissionModel: Model<Submission>);
    handlePipelineProcessing(job: bull.Job): Promise<void>;
}
