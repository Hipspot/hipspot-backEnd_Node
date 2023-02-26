import { Controller, Get, Patch, Query } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  async getGeojson() {
    return await this.mapService.getGeojson();
  }

  @Patch('/geojson')
  async updateGeojson(@Query('option') option) {
    switch (option) {
      case 'update':
        return await this.mapService.updateGeojson();

      default:
        return `${option} 옵션은 존재하지 않습니다.`;
    }
  }
}
