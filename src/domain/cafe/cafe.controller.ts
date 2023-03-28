import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ImageListService } from '../image-list/image-list.service';
import { CafeService } from './cafe.service';

@Controller('/cafe')
export class CafeController {
  constructor(
    private readonly cafeService: CafeService,
    private readonly imageListService: ImageListService,
  ) {}

  @Get('')
  getCafe() {
    return '카페 Id값으로 검색해주세요';
  }

  @Get('/recommend/nearby')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async getNearbyCafeList(
    @Query('startLng')
    startLng: number,
    @Query('startLat') startLat: number,
  ) {
    const coord = {
      startLat,
      startLng,
    };

    if (!(startLat && startLng)) {
      throw new HttpException(
        `파라미터를 확인해주세요 => ${Object.entries(coord)
          .map(([key, value]) => {
            if (!value) return `${key} `;
          })
          .join()}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const nearbyCafeList = await this.cafeService.getNearbyCafeList(coord);
    const result = await this.cafeService.addImageUrlList(nearbyCafeList);

    return result;
  }

  @Get('/recommend/high-rated')
  async getHighRatedCafes() {
    const highRating = await this.cafeService.getHighRatedCafes();

    const result = await this.cafeService.addImageUrlList(highRating);

    return result;
  }
  @Get('/recommend/new')
  async getNewlyOpencafeList(
    @Query('startLng')
    startLng: number,
    @Query('startLat') startLat: number,
  ) {
    const coord = {
      startLat,
      startLng,
    };
    if (!(startLat && startLng)) {
      throw new HttpException(
        `파라미터를 확인해주세요 => ${Object.entries(coord)
          .map(([key, value]) => {
            if (!value) return `${key} `;
          })
          .join()}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCafeList = await this.cafeService.getNewlyOpencafeList(coord);
    const result = await this.cafeService.addImageUrlList(newCafeList);

    return result;
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
