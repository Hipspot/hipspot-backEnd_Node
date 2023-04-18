import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { JwtAuthGuard } from '../auth/guard/jwt-guard';
import { GetUserIdFromAccessToken } from 'src/global/decorator/get-userid.decorator';
import { FavoriteRegisterInterceptor } from './favorite-register.interceptor';
import { FavoitePatchDto } from './favorite.dto';
import { MapService } from '../map/map.service';
import { getS3ImageUrl } from 'src/libs/utils/helper/getS3Url';

@UseGuards(JwtAuthGuard)
@Controller('favorite')
export class FavoriteController {
  constructor(
    private readonly favoriteSevice: FavoriteService,
    private readonly mapService: MapService,
  ) {}

  @Get('')
  @UseInterceptors(FavoriteRegisterInterceptor)
  async getFavoriteList(@GetUserIdFromAccessToken() userId) {
    const favoriteEntity = await this.favoriteSevice.getFavorite(userId);

    if (!favoriteEntity) return false;

    const { favoriteList } = favoriteEntity;
    const favoriteListData = await Promise.all(
      favoriteList
        .map(async (cafeId) => {
          const geojsonEntity = await this.mapService.getGeojsonOne(cafeId);

          // 값이 없는 경우 즐겨찾기에서 삭제해주기
          if (!geojsonEntity) {
            await this.favoriteSevice.removeFavorite(userId, cafeId);
          } else {
            const { cafeName, thumbNail: thumbNailTitle } =
              geojsonEntity.properties;
            const thumbNail = getS3ImageUrl({
              cafeId,
              value: thumbNailTitle,
            });

            return { thumbNail, cafeName, cafeId };
          }
        })
        .filter((item) => item),
    );

    return {
      userId,
      favoriteList: favoriteListData,
    };
  }

  @Patch('')
  @UseInterceptors(FavoriteRegisterInterceptor)
  async addFavorite(
    @GetUserIdFromAccessToken() userId,
    @Body() body: FavoitePatchDto,
  ) {
    const { type, cafeId } = body;
    if (type === 'add') {
      return await this.favoriteSevice.addFavorite(userId, cafeId);
    }
    if (type === 'remove') {
      return await this.favoriteSevice.removeFavorite(userId, cafeId);
    }
  }
}
