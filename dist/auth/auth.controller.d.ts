import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        _id: import("mongoose").Types.ObjectId;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            firstName: string;
            lastName: string;
        };
    }>;
    getCurrentUser(user: any): any;
}
