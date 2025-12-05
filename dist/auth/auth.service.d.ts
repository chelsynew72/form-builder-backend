import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
export declare class AuthService {
    private userModel;
    private jwtService;
    formModel: any;
    constructor(userModel: Model<User>, jwtService: JwtService);
    signup(signupDto: any): Promise<{
        message: string;
        _id: import("mongoose").Types.ObjectId;
    }>;
    login(loginDto: any): Promise<{
        access_token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            firstName: string;
            lastName: string;
        };
    }>;
    updateProfile(userId: string, updateDto: any): Promise<{
        message: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
        };
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    updateEmailPreferences(userId: string, preferences: any): Promise<{
        message: string;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
