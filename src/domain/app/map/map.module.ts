import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CafeModule } from 'src/domain/app/cafe/cafe.module';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { Geojson, GeojsonSchema } from './schemas/map.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Geojson.name, schema: GeojsonSchema }]),
    CafeModule,
  ],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
