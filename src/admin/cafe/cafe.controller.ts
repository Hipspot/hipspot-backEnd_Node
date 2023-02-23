import { Controller, Get, Param } from '@nestjs/common';
import { CafeService } from './cafe.service';

@Controller('/cafe')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Get('/:type')
  async getDocument(@Param('type') type: string) {
    return await this.cafeService.getDocument(type);
  }
}
