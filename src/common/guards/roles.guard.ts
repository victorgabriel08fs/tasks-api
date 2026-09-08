import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from '../decorators/roles.decorator.js';
import { User } from '../../users/entities/user.entity.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required?.length) return true;

    const { user } = ctx.switchToHttp().getRequest<{ user?: User }>();
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const loadedUser = await this.prisma.user.findFirst({
      where: { id: user.sub },
    });
    if (!loadedUser) throw new NotFoundException('Usuário não encontrado');

    if (!loadedUser?.isAdmin) {
      throw new ForbiddenException('Permissão insuficiente');
    }

    return true;
  }
}
