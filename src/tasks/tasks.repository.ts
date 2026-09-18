import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';

export abstract class TasksRepository {
  abstract create(ownerId: string, data: CreateTaskDto): Promise<Task>;
  abstract findAll(ownerId: string): Promise<Task[]>;
  abstract findById(ownerId: string, id: string): Promise<Task | null>;
  abstract update(
    ownerId: string,
    id: string,
    data: UpdateTaskDto,
  ): Promise<Task | null>;
  abstract remove(ownerId: string, id: string): Promise<boolean>;
}
