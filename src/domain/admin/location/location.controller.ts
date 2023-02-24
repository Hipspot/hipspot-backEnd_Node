import { Controller, Get, Param } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('/:id')
  async getMapData(@Param('id') id: string) {
    console.log(id);
    if (!Number(id)) return 'id값을 확인해주세요';
    return await this.locationService.getLocationData(Number(id));
  }

  @Get('/update/:id')
  async updatOneMap(@Param('id') id: string) {
    if (!Number(id)) return 'id값을 확인해주세요';
    return await this.locationService.updateOneLocation(Number(id));
  }

  @Get('/update')
  async updateAllMap() {
    return await this.locationService.updateAllLocation();
  }
}
