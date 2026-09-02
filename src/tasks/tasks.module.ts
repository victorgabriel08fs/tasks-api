import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { TasksController } from './tasks.controller.js';
import { SystemClock } from '../common/clock/system.clock.js';
import { Clock } from '../common/clock/clock.js';

@Module({
  controllers: [TasksController],
  providers: [TasksService, { provide: Clock, useClass: SystemClock }],
})
export class TasksModule {}
