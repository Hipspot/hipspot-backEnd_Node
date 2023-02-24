import { Controller, Get, Param } from '@nestjs/common';
import { CafeService } from './cafe.service';

@Controller('/cafe')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Get('/:docType')
  async getDocument(@Param('docType') type: string) {
    const types = ['info', 'openingHours', 'imageList', 'rating', 'price'];
    switch (type) {
      case 'info':
        return await this.cafeService.getInfo();
      case 'openingHours':
        return await this.cafeService.getOpeningHours();
      case 'imageList':
        return await this.cafeService.getImageList();
      case 'rating':
        return await this.cafeService.getRating();
      case 'price':
        return await this.cafeService.getPrice();
      default:
        return `오류오류, document type:${type} 확인해주세요. 확인 가능한 타입은 \n ${types.join(
          ', ',
        )} \n 입니다.`;
    }
  }
}
