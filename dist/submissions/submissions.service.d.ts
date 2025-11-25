import { Model } from 'mongoose';
import type { Queue } from 'bull';
import { Submission } from './schemas/submission.schema';
import { StepOutput } from './schemas/step-output.schema';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { QuerySubmissionsDto } from './dto/query-submissions.dto';
export declare class SubmissionsService {
    private submissionModel;
    private stepOutputModel;
    private pipelineQueue;
    constructor(submissionModel: Model<Submission>, stepOutputModel: Model<StepOutput>, pipelineQueue: Queue);
    create(createSubmissionDto: CreateSubmissionDto): Promise<Submission>;
    findAll(formId: string, query: QuerySubmissionsDto): Promise<{
        data: Submission[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        submission: Submission;
        outputs: StepOutput[];
    }>;
    updateStatus(id: string, status: string, errorMessage?: string): Promise<void>;
    createStepOutput(stepOutput: Partial<StepOutput>): Promise<StepOutput>;
    delete(id: string): Promise<void>;
}
