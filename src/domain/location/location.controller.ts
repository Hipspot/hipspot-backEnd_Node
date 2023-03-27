import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateQuery } from 'mongoose';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  async getLoactionAll() {
    return await this.locationService.getLocationAll();
  }

  @Get('/:id')
  async getLocationOne(@Param('id') id: string) {
    if (!Number(id)) return 'id값을 확인해주세요';
    return await this.locationService.getLocationData(id);
  }

  @Patch('')
  async updateAll(@Query('option') option) {
    switch (option) {
      case 'address':
        return await this.locationService.addressUpdate();

      default:
        return `${option} 옵션은 존재하지 않습니다.`;
    }
  }

  @Post('/:cafeId')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async updateOne(
    @Param('cafeId') cafeId: string,
    @Body() body: UpdateQuery<Location>,
  ) {
    return await this.locationService.updateOne(cafeId, body);
  }
}
