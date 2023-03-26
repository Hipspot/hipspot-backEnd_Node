import { ProjectionType } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Cafe } from './schemas/cafe.schema';
import { CafeRepository } from './cafe.repository';
import { MapboxService } from '../mapbox/mapbox.service';
import { LocationRepository } from '../location/location.repository';
import { calcDistanceInMeter } from 'src/libs/utils/helper/calcDistanceInMeter';
import { calcRating } from 'src/libs/utils/helper/calcRating';

@Injectable()
export class CafeService {
  constructor(
    private readonly mapboxService: MapboxService,
    private readonly cafeRepository: CafeRepository,
    private readonly locationRepository: LocationRepository,
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

        return { cafeId, ...routes };
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

    return topRating;
  }
  async getNewlyOpencafeList() {
    return 'newly-open';
  }
  async getPopularCafeList() {
    return 'popular';
  }
}
