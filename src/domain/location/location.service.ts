import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ProjectionType } from 'mongoose';
import { LocationRepository } from './location.repository';
@Injectable()
export class LocationService {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly httpService: HttpService,
  ) {}

  async getLocationData(
    cafeId?: string,
    projection?: ProjectionType<Location>,
  ) {
    return await this.locationRepository.findOne(cafeId, projection);
  }

  async updateLocation() {
    const locationList = await this.locationRepository.findAll();

    for (let i = 0; i < locationList.length; i++) {
      const { cafeId, address } = locationList[i];
      const {
        x: lng,
        y: lat,
        roadAddress,
        jibunAddress: lot_address,
      } = await this.getGeocodeFromAddress(address);

      await this.locationRepository.updateOne(cafeId, {
        $set: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          address: roadAddress,
          lot_address,
        },
      });
    }

    return await this.locationRepository.findAll();
  }

  async getGeocodeFromAddress(address: string) {
    const geoCodeData = await this.httpService.axiosRef({
      method: 'GET',
      url: `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode`,
      params: {
        query: address,
      },
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_MAP_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.NAVER_MAP_CLIENT_SECRET,
      },
    });
    return geoCodeData.data.addresses[0];
  }
}
