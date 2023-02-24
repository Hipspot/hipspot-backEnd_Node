import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { CafeService } from './cafe.service';

@Controller('/cafe')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Get('/:docType')
  async getDocument(@Param('docType') type: string) {
    return await this.cafeService.getDocument(type);
  }

  @Patch('/:docType')
  async patchDocument(
    @Param('docType') docType: string,
    @Query('cafeId') cafeId?: number,
    @Query('option') option?: string,
  ) {
    return `docType ${docType}, cafeId ${cafeId}, ${JSON.parse(option)}`;
  }
}
