import { Injectable } from '@nestjs/common';
import { Clock } from './clock.js';

@Injectable()
export class FixedClock extends Clock {
  private current = new Date('2026-01-01T12:00:00.000Z');

  now(): Date {
    return new Date(this.current);
  }

  set(date: Date | string): void {
    this.current = new Date(date);
  }
  advance(ms: number): void {
    this.current = new Date(this.current.getTime() + ms);
  }
}
