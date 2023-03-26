import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageListModule } from '../image-list/image-list.module';
import { LocationModule } from '../location/location.module';
import { MapboxModule } from '../mapbox/mapbox.module';
import { CafeController } from './cafe.controller';
import { CafeRepository } from './cafe.repository';
import { CafeService } from './cafe.service';
import { Cafe, CafeSchema } from './schemas/cafe.schema';
import { Rating, ratingSchema } from './schemas/rating.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cafe.name, schema: CafeSchema },
      { name: Rating.name, schema: ratingSchema },
    ]),
    MapboxModule,
    LocationModule,
    ImageListModule,
  ],
  controllers: [CafeController],
  providers: [CafeService, CafeRepository],
  exports: [CafeService, CafeRepository],
})
export class CafeModule {}
