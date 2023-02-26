import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Geojson } from 'src/domain/app/map/schemas/Geojson.schemas';
import { CafeService } from '../cafe/cafe.service';
import { LocationService } from './location/location.service';

@Injectable()
export class MapService {
  constructor(
    @InjectModel(Geojson.name) private geojsonModel: Model<Geojson>,
    private readonly cafeService: CafeService,
    private readonly locationService: LocationService,
  ) {}

  async getGeojson() {
    return await this.geojsonModel.find({});
  }

  async updateGeojson() {
    const cafeList = await this.cafeService.getCafe();
    console.log(cafeList.length);
    for (let i = 0; i < cafeList.length; i++) {
      const { cafeId, cafeName, imageList } = cafeList[i];
      const [price] = await this.cafeService.getPrice(cafeId, {
        _id: 0,
        cafeId: 0,
      });
      const [location] = await this.locationService.getLocationData(cafeId, {
        _id: 0,
        cafeId: 0,
        lot_address: 0,
        address: 0,
      });
      const [{ filterList }] = await this.cafeService.getFilterList(cafeId, {
        _id: 0,
        cafeId: 0,
        filterListCSV: 0,
      });

      const geojson: Pick<Geojson, 'type' | 'properties' | 'geometry'> = {
        type: 'Feature',
        properties: {
          cafeId,
          cafeName,
          filterList: filterList.map(Number),
          resonablePrice: Number(price.americano) || null,
          thumbNail: imageList.store?.[0] || imageList.menu?.[0] || null,
        },
        geometry: {
          type: 'Point',
          coordinates: [location.lat, location.lng],
        },
      };

      await this.geojsonModel.updateOne(
        { 'properties.cafeId': cafeId },
        { $set: geojson, $unset: { cafeId: 0, store: 0, menu: 0 } },
        { upsert: true },
      );
    }
    return await this.geojsonModel.find({});
  }
}
