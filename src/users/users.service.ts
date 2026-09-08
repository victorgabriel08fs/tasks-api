import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  @UseGuards(RolesGuard)
  async findOne(id: string) {
    return await this.prisma.user.findFirst({ where: { id } });
  }

  @UseGuards(RolesGuard)
  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      data: updateUserDto,
      where: { id },
    });
  }

  @UseGuards(RolesGuard)
  async remove(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
