import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
export declare class AuthService {
    private userModel;
    private jwtService;
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
    getProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
