import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { ListUsersQuery } from './dto/list-users-query.dto.js';
import { ListResponse } from '../utils/list-response.schema.js';
import { User } from './entities/user.entity.js';
import { NativeUser } from './entities/native-user.entity.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findAll(query: ListUsersQuery): Promise<ListResponse<NativeUser>> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        orderBy: query.sortBy
          ? { [query.sortBy]: query.direction }
          : { createdAt: 'desc' },
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
        sortBy: query?.sortBy
          ? {
              key: query.sortBy,
              direction: query.direction,
            }
          : {},
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
