import { Injectable } from '@nestjs/common';
import { TasksRepository } from './tasks.repository.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { Task } from './entities/task.entity.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class PrismaTasksRepository extends TasksRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  create(ownerId: string, data: CreateTaskDto) {
    return this.prisma.task.create({ data: { ...data, ownerId } });
  }

  findAll(ownerId: string) {
    return this.prisma.task.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(ownerId: string, id: string) {
    return this.prisma.task.findFirst({ where: { id, ownerId } });
  }

  async update(ownerId: string, id: string, data: UpdateTaskDto) {
    const { count } = await this.prisma.task.updateMany({
      where: { id, ownerId },
      data,
    });
    return count === 0 ? null : this.findById(ownerId, id);
  }

  async remove(ownerId: string, id: string) {
    const { count } = await this.prisma.task.deleteMany({
      where: { id, ownerId },
    });
    return count > 0;
  }
}
