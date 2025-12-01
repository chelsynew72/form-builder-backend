import { SubmissionsService } from './submissions.service';
import { FormsService } from '../forms/forms.service';
import { QuerySubmissionsDto } from './dto/query-submissions.dto';
export declare class SubmissionsController {
    private readonly submissionsService;
    private readonly formsService;
    constructor(submissionsService: SubmissionsService, formsService: FormsService);
    test(): {
        message: string;
    };
    create(createSubmissionDto: any, ip: string, userAgent: string): Promise<{
        success: boolean;
        data: {
            submissionId: string;
        };
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
