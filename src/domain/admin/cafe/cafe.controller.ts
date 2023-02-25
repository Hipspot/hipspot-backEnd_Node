import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { isNumber } from 'src/libs/utils/helper/validation';
import { CafeService } from './cafe.service';

@Controller('/cafe')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Get()
  async getCafe() {
    return await this.cafeService.getCafe();
  }

  @Patch()
  async updateCafe(@Query('option') option) {
    switch (option) {
      case 'update':
        return await this.cafeService.updateCafe();
      default:
        return `${option} 옵션은 존재하지 않습니다.`;
    }
  }

  @Get('/:param')
  async getDocument(@Param('param') param: string) {
    const types = ['info', 'openingHours', 'imageList', 'rating', 'price'];

    if (isNumber(param)) {
      return this.cafeService.getCafe(param);
    }

    switch (param) {
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
        return `오류오류, document type:${param} 확인해주세요. 확인 가능한 타입은 \n ${types.join(
          ', ',
        )} \n 입니다.`;
    }
  }

  @Get('/:docType/:cafeId')
  async getDocumentById(
    @Param('docType') docType: string,
    @Param('cafeId') cafeId: string,
  ) {
    const types = ['info', 'openingHours', 'imageList', 'rating', 'price'];

    if (!isNumber(cafeId)) return await this.getDocument(docType);

    switch (docType) {
      case 'info':
        return await this.cafeService.getInfo(cafeId);
      case 'openingHours':
        return await this.cafeService.getOpeningHours(cafeId);
      case 'imageList':
        return await this.cafeService.getImageList(cafeId);
      case 'rating':
        return await this.cafeService.getRating(cafeId);
      case 'price':
        return await this.cafeService.getPrice(cafeId);
      default:
        return `오류오류, document type:${docType} 확인해주세요. 확인 가능한 타입은 \n ${types.join(
          ', ',
        )} \n 입니다.`;
    }
  }

  @Patch('/imageList')
  async updateImageListData(@Query('option') option) {
    switch (option) {
      case 'update':
        return await this.cafeService.updateImageListData();
      default:
        return `${option} 옵션은 존재하지 않습니다.`;
    }
  }
  @Patch('/openingHours')
  async updateOpeningHours(@Query('option') option) {
    switch (option) {
      case 'update':
        return await this.cafeService.updateOpeningHours();
      default:
        return `${option} 옵션은 존재하지 않습니다.`;
    }
  }
}
