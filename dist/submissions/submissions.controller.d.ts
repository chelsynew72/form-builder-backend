import { SubmissionsService } from './submissions.service';
import { FormsService } from '../forms/forms.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { QuerySubmissionsDto } from './dto/query-submissions.dto';
export declare class SubmissionsController {
    private readonly submissionsService;
    private readonly formsService;
    constructor(submissionsService: SubmissionsService, formsService: FormsService);
    create(createSubmissionDto: CreateSubmissionDto, ip: string, userAgent: string): Promise<{
        success: boolean;
        submissionId: import("mongoose").Types.ObjectId;
        message: string;
    }>;
    findAll(formId: string, query: QuerySubmissionsDto): Promise<{
        data: import("./schemas/submission.schema").Submission[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        submission: import("./schemas/submission.schema").Submission;
        outputs: import("./schemas/step-output.schema").StepOutput[];
    }>;
    delete(id: string): Promise<void>;
}
