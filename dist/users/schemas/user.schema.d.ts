import { Document } from 'mongoose';
export declare class User {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    plan: string;
    apiKey?: string;
    createdAt: Date;
    updatedAt: Date;
    emailPreferences?: {
        newSubmission: boolean;
        processingComplete: boolean;
        processingFailed: boolean;
        weeklyDigest: boolean;
    };
}
export type UserDocument = User & Document;
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
