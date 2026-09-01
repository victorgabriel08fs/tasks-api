import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<unknown> {
    const { method, url } = context
      .switchToHttp()
      .getRequest<{ method: string; url: string }>();
    const start = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(`${method} ${url} - ${Date.now() - start}ms`),
        ),
      );
  }
}
