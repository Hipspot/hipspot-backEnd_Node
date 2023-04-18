import { Logger, Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from './favorite.schema';
import { FavoriteRegisterInterceptor } from './favorite-register.interceptor';
import { MapModule } from '../map/map.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema },
    ]),
    MapModule,
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRegisterInterceptor, Logger],
  exports: [FavoriteService],
})
export class FavoriteModule {}
