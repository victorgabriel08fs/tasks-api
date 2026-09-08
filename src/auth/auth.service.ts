import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException('E-mail já cadastrado');

    const user = await this.prisma.user.create({
      data: { email, name, passwordHash: await argon2.hash(password) },
    });

    return this.sign(user.id, user.email, user?.isAdmin);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    const ok = user
      ? await argon2.verify(user.passwordHash, password)
      : await argon2.hash(password).then(() => false);

    if (!user || !ok) throw new UnauthorizedException('Credenciais inválidas');
    return this.sign(user.id, user.email, user?.isAdmin);
  }

  private async sign(sub: string, email: string, isAdmin: boolean) {
    return { accessToken: await this.jwt.signAsync({ sub, email, isAdmin }) };
  }
}
