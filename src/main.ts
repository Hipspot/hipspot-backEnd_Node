import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import mongoose from 'mongoose';
import { AdminModule } from './domain/admin/admin.module';
import { AppModule } from './domain/app/app.module';

async function bootstrap() {
  mongoose.set('debug', true);
  if (process.env.NODE_ENV == 'admin') {
    const app = await NestFactory.create(AdminModule, { cors: true });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(5001);
    return;
  }

  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5001);
}
bootstrap();
