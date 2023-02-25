import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cafe, CafeSchema } from 'src/domain/app/cafe/schemas/cafe.schema';
import { CafeController } from './cafe.controller';
import { CafeService } from './cafe.service';
import { CafeSubDocuments, CafeSubSchemas } from './schemas';

const { ImageList, Info, Price, Rating, OpeningHours } = CafeSubDocuments;
const {
  Info: infoSchema,
  Price: priceSchema,
  Rating: ratingSchema,
  OpeningHours: openingHoursSchema,
  ImageList: ImageListSchema,
} = CafeSubSchemas;

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Info.name, schema: infoSchema }]),
    MongooseModule.forFeature([{ name: Rating.name, schema: ratingSchema }]),
    MongooseModule.forFeature([{ name: Price.name, schema: priceSchema }]),
    MongooseModule.forFeature([
      { name: ImageList.name, schema: ImageListSchema },
    ]),
    MongooseModule.forFeature([
      { name: OpeningHours.name, schema: openingHoursSchema },
    ]),
    MongooseModule.forFeature([{ name: Cafe.name, schema: CafeSchema }]),
  ],
  controllers: [CafeController],
  providers: [CafeService],
})
export class CafeModule {}
