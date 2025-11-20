import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerInput: RegisterInput): Promise<import("./dto/auth.response").AuthResponse>;
    login(loginInput: LoginInput): Promise<import("./dto/auth.response").AuthResponse>;
}
