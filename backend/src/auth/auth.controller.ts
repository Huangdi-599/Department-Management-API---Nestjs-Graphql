import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }
}
