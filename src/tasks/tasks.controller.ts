import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { ApiKeyGuard } from '../common/guards/api-key.guard.js';

@Controller('tasks')
@UseGuards(ApiKeyGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
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
