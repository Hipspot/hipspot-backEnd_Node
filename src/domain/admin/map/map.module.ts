import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Geojson, geojsonSchema } from 'src/domain/app/map/schemas/map.schemas';
import { CafeModule } from '../cafe/cafe.module';
import { Price, priceSchema } from '../cafe/schemas/price.schemas';
import { LocationModule } from './location/location.module';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Geojson.name, schema: geojsonSchema }]),
    MongooseModule.forFeature([{ name: Price.name, schema: priceSchema }]),
    CafeModule,
    LocationModule,
  ],
  providers: [MapService],
  controllers: [MapController],
})
export class MapModule {}
