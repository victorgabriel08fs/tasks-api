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

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

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
  create(@Body({ schema: createTaskSchema }) createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(
    @Query({ schema: listQuerySchema }) query: z.infer<typeof listQuerySchema>,
  ) {
    return this.tasksService.findAll(query.page, query.limit);
  }

  @Get(':id')
  findOne(@Param('id', { schema: z.uuid() }) id: string) {
    return this.tasksService.findOne(id);
  }

  @Get('active')
  active() {
    return this.tasksService.active();
  }

  @Get(':listId/items/:itemId')
  findItem(@Param('listId') listId: string, @Param('itemId') itemId: string) {
    return this.tasksService.findItem(+listId, +itemId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
