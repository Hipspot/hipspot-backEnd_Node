import { Controller, Get, Param } from '@nestjs/common';
import { CafeService } from './cafe.service';

@Controller('/cafe')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Get('')
  getCafe() {
    return '카페 Id값으로 검색해주세요';
  }

  @Get('/recommend/nearby')
  async getNearbyCafeList(coord: [number, number]) {
    return await this.cafeService.getNearbyCafeList(coord);
  }

  @Get('/recommend/high-rated')
  async getHighRatedCafes() {
    return await this.cafeService.getHighRatedCafes();
  }
  @Get('/recommend/new')
  async getNewlyOpencafeList() {
    return await this.cafeService.getNewlyOpencafeList();
  }
  @Get('/recommend/popular')
  async getPopularCafeList() {
    return await this.cafeService.getPopularCafeList();
  }
  @Get('/:cafeId')
  async getCafeById(@Param('cafeId') id: string) {
    return await this.cafeService.getCafe(id);
  }
}
