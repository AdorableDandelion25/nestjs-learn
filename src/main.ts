import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './module/app.module';

async function bootstrap() {
  const DEFAULT_PORT = 3000;

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? DEFAULT_PORT);
}

bootstrap().catch(console.error);
