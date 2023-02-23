import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CafeController } from './cafe.controller';
import { CafeService } from './cafe.service';
import {
  OpeningHours,
  openingHoursSchema,
} from './schemas/openingHours.schemas';
import { ImageList, ImageListSchema } from './schemas/imageList.schemas';
import { Info, InfoSchema } from './schemas/info.schmas';
import { Rating, ratingSchema } from './schemas/rating.schema';
import { Price, priceSchema } from './schemas/price.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Info.name, schema: InfoSchema }]),
    MongooseModule.forFeature([{ name: Rating.name, schema: ratingSchema }]),
    MongooseModule.forFeature([{ name: Price.name, schema: priceSchema }]),
    MongooseModule.forFeature([
      { name: ImageList.name, schema: ImageListSchema },
    ]),
    MongooseModule.forFeature([
      { name: OpeningHours.name, schema: openingHoursSchema },
    ]),
  ],
  controllers: [CafeController],
  providers: [CafeService],
})
export class CafeModule {}
