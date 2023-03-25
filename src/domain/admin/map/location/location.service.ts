import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ProjectionType } from 'mongoose';
import { Location } from './schemas/location.schemas';
@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private LocationModel: Model<Location>,
    private readonly httpService: HttpService,
  ) {}

  async getLocationData(
    cafeId?: string,
    projection?: ProjectionType<Location>,
  ) {
    const map = await this.LocationModel.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );

    return map;
  }

  async updateLocation() {
    const locationList = await this.LocationModel.find({});

    for (let i = 0; i < locationList.length; i++) {
      const { cafeId, address } = locationList[i];
      const {
        x: lat,
        y: lng,
        roadAddress,
        jibunAddress: lot_address,
      } = await this.getGeocodeFromAddress(address);

      await this.LocationModel.updateOne(
        { cafeId },
        {
          $set: {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            address: roadAddress,
            lot_address,
          },
        },
      );
    }

    return await this.LocationModel.find({});
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
