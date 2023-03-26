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
    const result = await Promise.all(
      nearbyCafeList.map(async (nearbyCafe) => {
        const { cafeId } = nearbyCafe;
        const imageListData = await this.imageListService.getImageList(cafeId, {
          cafeId: 0,
          _id: 0,
        });
        const parseDoc = Object.entries(Object.entries(imageListData)[2][1]);
        const imageUrl = parseDoc
          .map(([key, values]) => {
            if (values)
              return (values as string[]).map(
                (value) =>
                  `https://hipspot.s3.ap-northeast-2.amazonaws.com/${cafeId}/${key}/${value}`,
              );
          })
          .filter((value) => value)
          .flat();

        return { ...nearbyCafe, imageUrl };
      }),
    );

    return result;
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
