import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { ApiKeyGuard } from '../common/guards/api-key.guard.js';
import { z } from 'zod';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  listTasksQuerySchema,
  type ListTasksQuery,
} from './dto/list-tasks-query.dto.js';

const createTaskSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(500).optional(),
  done: z.boolean().optional(),
});

@Controller('tasks')
@UseGuards(ApiKeyGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa criada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(
    @CurrentUser('sub') userId: string,
    @Body({ schema: createTaskSchema }) createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(userId, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista as tarefas do usuário atual' })
  findAll(
    @CurrentUser('sub') userId: string,
    @Query({ schema: listTasksQuerySchema }) query: ListTasksQuery,
  ) {
    return this.tasksService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Encontra uma tarefa específica do usuário atual' })
  findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', { schema: z.uuid() }) id: string,
  ) {
    return this.tasksService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma tarefa específica do usuário atual' })
  update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(userId, id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta uma tarefa específica do usuário atual' })
  remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.tasksService.remove(userId, id);
  }
}
