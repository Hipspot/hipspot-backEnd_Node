import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeoJSON } from './schemas/map.schemas';

@Injectable()
export class MapService {
  constructor(
    @InjectModel(GeoJSON.name) private geoJSONModel: Model<GeoJSON>,
  ) {}

  async allData() {
    const geojson = await this.geoJSONModel.find({});
    return geojson;
  }
}
