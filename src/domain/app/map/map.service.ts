import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Geojson } from './schemas/Geojson.schemas';

@Injectable()
export class MapService {
  constructor(
    @InjectModel(Geojson.name) private geoJSONModel: Model<Geojson>,
  ) {}

  async allData() {
    const geojson = await this.geoJSONModel.find({});
    return geojson;
  }
}
