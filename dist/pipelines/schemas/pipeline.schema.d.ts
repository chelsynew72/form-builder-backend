import { Document, Types } from 'mongoose';
export interface PipelineStep {
    stepNumber: number;
    name: string;
    prompt: string;
    description?: string;
    model?: string;
}
export declare class Pipeline extends Document {
    formId: Types.ObjectId;
    name: string;
    steps: PipelineStep[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const PipelineSchema: import("mongoose").Schema<Pipeline, import("mongoose").Model<Pipeline, any, any, any, Document<unknown, any, Pipeline, any, {}> & Pipeline & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Pipeline, Document<unknown, {}, import("mongoose").FlatRecord<Pipeline>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Pipeline> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
