import { Document, Types } from 'mongoose';
export interface FormField {
    id: string;
    type: 'text' | 'email' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'file';
    label: string;
    placeholder?: string;
    required: boolean;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
    options?: string[];
    helpText?: string;
    order: number;
}
export declare class Form extends Document {
    userId: Types.ObjectId;
    name: string;
    description?: string;
    fields: FormField[];
    publicId: string;
    isActive: boolean;
    submissionCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const FormSchema: import("mongoose").Schema<Form, import("mongoose").Model<Form, any, any, any, Document<unknown, any, Form, any, {}> & Form & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Form, Document<unknown, {}, import("mongoose").FlatRecord<Form>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Form> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
