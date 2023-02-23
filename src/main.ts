import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { AppModule } from './app.module';

async function bootstrap() {
  if (process.env.ADMIN) {
    const app = await NestFactory.create(AdminModule, { cors: true });
    return await app.listen(5001);
  }

  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(5001);
}
bootstrap();
