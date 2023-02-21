import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CafeModule } from 'src/cafe/cafe.module';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { GeoJSON, GeoJSONSchema } from './schemas/map.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GeoJSON.name, schema: GeoJSONSchema }]),
    CafeModule,
  ],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
