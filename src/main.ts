import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { AdminModule } from './domain/admin/admin.module';
import { AppModule } from './domain/app/app.module';
import { UnAuthorizedFilter } from './global/filter/unauthorized.filter.ts';
import { JWTExceptionFilter } from './global/filter/jwt.filter';

async function bootstrap() {
  mongoose.set('debug', true);
  if (process.env.NODE_ENV == 'admin') {
    const app = await NestFactory.create(AdminModule, { cors: true });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(5001);
    return;
  }

  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalFilters(new JWTExceptionFilter());
  app.useGlobalFilters(new UnAuthorizedFilter());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5001);
}
bootstrap();
