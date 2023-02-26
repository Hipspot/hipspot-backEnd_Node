import { Controller, Get, Param } from '@nestjs/common';
import { CafeService } from './cafe.service';

@Controller('/cafe')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Get('')
  getCafe() {
    return '카페 Id값으로 검색해주세요';
  }

  @Get('/:cafeId')
  getCafeById(@Param('cafeId') id: string) {
    return this.cafeService.getCafe(id);
  }
}
