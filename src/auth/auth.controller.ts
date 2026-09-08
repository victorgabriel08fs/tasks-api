import {
  Body,
  Controller,
  Injectable,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from '../common/guards/api-key.guard.js';
import { AuthService } from './auth.service.js';
import { Public } from '../common/decorators/public.decorator.js';
import z from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3).max(100),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

@Controller('auth')
@UseGuards(ApiKeyGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  register(@Body({ schema: registerSchema }) registerDto: any) {
    if (registerDto.password !== registerDto.confirmPassword)
      throw new NotFoundException('A senha e a confirmação não conferem');
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
    );
  }

  @Post('login')
  @Public()
  login(@Body({ schema: loginSchema }) loginDto: any) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
