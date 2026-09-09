import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import {
  StandardSchemaValidationPipe,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(
    new StandardSchemaValidationPipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  const env = process?.env?.NODE_ENV ?? null;

  if (env === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Tasks API')
      .setDescription('API de tarefas — curso de NestJS')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    SwaggerModule.setup('docs', app, () =>
      SwaggerModule.createDocument(app, config),
    );
  }

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
