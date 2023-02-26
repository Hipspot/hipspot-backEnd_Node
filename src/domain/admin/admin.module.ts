import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { LocationModule } from './map/location/location.module';
import { CafeModule } from './cafe/cafe.module';
import { MapModule } from './map/map.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.admin.env`,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    LocationModule,
    CafeModule,
    MapModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
