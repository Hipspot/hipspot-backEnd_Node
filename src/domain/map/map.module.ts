import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { Geojson, geojsonSchema } from './schemas/Geojson.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Geojson.name, schema: geojsonSchema }]),
  ],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
