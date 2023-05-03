import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { LocationModule } from '../location/location.module';
import { Geojson, geojsonSchema } from '../map/schemas/Geojson.schemas';
import { CafeModule } from '../cafe/cafe.module';
import { Price, priceSchema } from './schemas/price.schemas';
import {
  OpeningHours,
  openingHoursSchema,
} from './schemas/opening-hours.schemas';
import { FilterList, filterListSchema } from './schemas/filter-list.schemas';
import { Info, infoSchema } from './schemas/info.schmas';
import { Cafe, CafeSchema } from '../cafe/schemas/cafe.schema';
import { ImageListModule } from '../image-list/image-list.module';
import { AwsS3Module } from 'src/module/aws-s3/aws-s3.module';
import { ImageProcessingModule } from 'src/module/image-processing/image-processing.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Geojson.name,
        schema: geojsonSchema,
      },
      {
        name: Price.name,
        schema: priceSchema,
      },
      {
        name: OpeningHours.name,
        schema: openingHoursSchema,
      },
      {
        name: FilterList.name,
        schema: filterListSchema,
      },
      {
        name: Info.name,
        schema: infoSchema,
      },
      {
        name: Cafe.name,
        schema: CafeSchema,
      },
    ]),
    LocationModule,
    CafeModule,
    ImageListModule,
    ImageProcessingModule,
    AwsS3Module,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
