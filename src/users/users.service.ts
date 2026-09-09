import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ListQuery } from '../utils/list-query.schema.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findAll(query: ListQuery) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      items,
      meta: {
        page:
          Math.ceil(total / query.limit) > query.page
            ? Math.ceil(total / query.limit)
            : query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    };
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
