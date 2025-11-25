import { Document, Types } from 'mongoose';
export declare class Submission extends Document {
    formId: Types.ObjectId;
    data: Record<string, any>;
    status: string;
    ipAddress?: string;
    userAgent?: string;
    errorMessage?: string;
    submittedAt: Date;
    processedAt?: Date;
}
export declare const SubmissionSchema: import("mongoose").Schema<Submission, import("mongoose").Model<Submission, any, any, any, Document<unknown, any, Submission, any, {}> & Submission & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Submission, Document<unknown, {}, import("mongoose").FlatRecord<Submission>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Submission> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
