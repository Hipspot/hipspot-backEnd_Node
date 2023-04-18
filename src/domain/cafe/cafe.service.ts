import { ProjectionType } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Cafe } from './schemas/cafe.schema';
import { CafeRepository } from './cafe.repository';
import { MapboxService } from '../mapbox/mapbox.service';
import { LocationRepository } from '../location/location.repository';
import { calcDistanceInMeter } from 'src/libs/utils/helper/calcDistanceInMeter';
import { calcRating } from 'src/libs/utils/helper/calcRating';
import { arrayNotContains } from 'class-validator';
import { ImageListService } from '../image-list/image-list.service';
import { Rating } from './schemas/rating.schema';
import { getS3ImageUrl } from 'src/libs/utils/helper/getS3Url';

@Injectable()
export class CafeService {
  constructor(
    private readonly mapboxService: MapboxService,
    private readonly cafeRepository: CafeRepository,
    private readonly locationRepository: LocationRepository,
    private readonly imageListService: ImageListService,
  ) {}

  async getCafe(cafeId?: string, projection?: ProjectionType<Cafe>) {
    return await this.cafeRepository.findOne(cafeId, projection);
  }
  async getCafeList() {
    return await this.cafeRepository.findAll();
  }

  async getNearbyCafeList(
    coord: { startLng: number; startLat: number },
    count = 10,
  ) {
    const locationList = await this.locationRepository.findAll();

    const { startLng, startLat } = coord;

    // 직선거리로 1차 sort 이후 count만큼 슬라이스
    const nearbyCafeList = locationList
      .sort((a, b) => {
        const { lng: lngA, lat: latA } = a;
        const { lng: lngB, lat: latB } = b;
        return (
          calcDistanceInMeter({
            startLat,
            startLng,
            endLat: latA,
            endLng: lngA,
          }) -
          calcDistanceInMeter({
            startLat,
            startLng,
            endLat: latB,
            endLng: lngB,
          })
        );
      })
      .slice(0, count);

    // api 요청으로 도보 이동 거리 구하기
    const result = await Promise.all(
      nearbyCafeList.map(async ({ lat, lng, cafeId }) => {
        const routes = await this.mapboxService.getPedastrianRoutes({
          startLat,
          startLng,
          endLat: lat,
          endLng: lng,
        });

        const { cafeName } = await this.cafeRepository.findOne(cafeId);

        return { cafeId, cafeName, ...routes };
      }),
    );

    //도보 이동거리순으로 sort
    return result.sort((a, b) => a.distance - b.distance);
  }

  async getHighRatedCafes(count = 10) {
    const ratingList = await this.cafeRepository.findAllRating();

    const topRating = ratingList
      .sort((a, b) => {
        const ratingA = calcRating(a.star, a.review);
        const ratingB = calcRating(b.star, b.review);
        return ratingB - ratingA;
      })
      .slice(0, count);

    const result = await Promise.all(
      topRating.map(async ({ star, review, cafeId }) => {
        const { cafeName } = await this.cafeRepository.findOne(cafeId);

        return { star, review, cafeId, cafeName };
      }),
    );

    return result;
  }
  async getNewlyOpencafeList(coord: { startLat: number; startLng: number }) {
    const { startLat, startLng } = coord;
    const newlyOpencafeList = await this.locationRepository.find({
      since: { $gt: new Date('2022-01-01') },
    });
    const result = await Promise.all(
      newlyOpencafeList.map(async ({ cafeId, lat, lng }) => {
        const routes = await this.mapboxService.getPedastrianRoutes({
          startLat,
          startLng,
          endLat: lat,
          endLng: lng,
        });

        const { cafeName } = await this.cafeRepository.findOne(cafeId);

        return { cafeId, cafeName, ...routes };
      }),
    );
    return result;
  }
  async getPopularCafeList() {
    return 'popular';
  }

  async addImageUrlList(array: { cafeId: string; [key: string]: any }[]) {
    return await Promise.all(
      array.map(async (cafe) => {
        const { cafeId } = cafe;
        const imageListData = await this.imageListService.getImageList(cafeId, {
          cafeId: 0,
          _id: 0,
        });
        const parseDoc = Object.entries(Object.entries(imageListData)[2][1]);
        const imageUrl = parseDoc
          .map(([key, values]) => {
            if (values)
              return (values as string[]).map((value) =>
                getS3ImageUrl({ cafeId, key, value }),
              );
          })
          .filter((value) => value)
          .flat();

        return { ...cafe, imageUrl };
      }),
    );
  }
}
