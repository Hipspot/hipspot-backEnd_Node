import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from './schemas/location.schemas';
@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private LocationModel: Model<Location>,
  ) {}

  async getLocationData(cafeId: number) {
    const map = await this.LocationModel.findOne({ cafeId: cafeId });

    return map;
  }

  async updateOneLocation(cafeId: number) {
    return;
  }

  async updateAllLocation() {
    return;
  }

  async getGeocodeFromAddress(address: string) {
    return;
  }
}
