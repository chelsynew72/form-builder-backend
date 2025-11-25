export declare enum SubmissionStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class QuerySubmissionsDto {
    page?: number;
    limit?: number;
    status?: SubmissionStatus;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
