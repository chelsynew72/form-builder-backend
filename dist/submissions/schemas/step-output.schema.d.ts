import { Types, Document } from 'mongoose';
export declare class StepOutput {
    submissionId: Types.ObjectId;
    stepNumber: number;
    stepName: string;
    prompt: string;
    output: string;
    tokenCount?: number;
    duration?: number;
    model?: string;
    executedAt: Date;
}
export type StepOutputDocument = StepOutput & Document;
export declare const StepOutputSchema: import("mongoose").Schema<StepOutput, import("mongoose").Model<StepOutput, any, any, any, Document<unknown, any, StepOutput, any, {}> & StepOutput & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StepOutput, Document<unknown, {}, import("mongoose").FlatRecord<StepOutput>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<StepOutput> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
