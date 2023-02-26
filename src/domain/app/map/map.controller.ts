import { Controller, Get, Query } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('/map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('')
  getGeojson() {
    return this.mapService.getGeojson();
  }

  @Get('/:cafeId')
  getGeojsonDataById(@Query('cafeId') cafeId) {
    if (cafeId) return this.mapService.getGeojson(cafeId);
    return this.mapService.getGeojson();
  }
}
