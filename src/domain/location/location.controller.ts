import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('/:id')
  async geMapboxData(@Param('id') id: string) {
    if (!Number(id)) return 'id값을 확인해주세요';
    return await this.locationService.getLocationData(id);
  }

  @Patch('')
  async updateLocation(@Query('option') option) {
    switch (option) {
      case 'update':
        return await this.locationService.updateLocation();
      default:
        return `${option} 옵션은 존재하지 않습니다.`;
    }
  }
}
