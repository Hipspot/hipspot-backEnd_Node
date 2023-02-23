import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { AppModule } from './app/app.module';

async function bootstrap() {
  if (process.env.NODE_ENV == 'admin') {
    const app = await NestFactory.create(AdminModule, { cors: true });
    await app.listen(5002);
    return;
  }

  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(5001);
}
bootstrap();
