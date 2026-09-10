import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ListTasksQuery } from './dto/list-tasks-query.dto.js';
import { ListResponse } from '../utils/list-response.schema.js';
import { NativeTask } from './entities/task.entity.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(ownerId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: { ...dto, ownerId },
    });
  }

  async findAll(
    ownerId: string,
    query: ListTasksQuery,
  ): Promise<ListResponse<NativeTask>> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where: { ownerId },
        orderBy: query.sortBy
          ? { [query.sortBy]: query.direction }
          : { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.task.count({ where: { ownerId } }),
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

  async findOne(ownerId: string, id: string) {
    const task = await this.prisma.task.findFirst({ where: { id, ownerId } });
    if (!task) throw new NotFoundException(`Task ${id} não encontrada`);
    return task;
  }

  async update(ownerId: string, id: string, dto: UpdateTaskDto) {
    await this.findOne(ownerId, id);
    return this.prisma.task.update({ where: { id }, data: dto });
  }

  async remove(ownerId: string, id: string) {
    await this.findOne(ownerId, id);
    await this.prisma.task.delete({ where: { id } });
  }
}
