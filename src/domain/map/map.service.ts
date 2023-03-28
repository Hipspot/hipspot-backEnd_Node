import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType } from 'mongoose';
import { Geojson } from './schemas/Geojson.schemas';

@Injectable()
export class MapService {
  constructor(
    @InjectModel(Geojson.name) private geoJSONModel: Model<Geojson>,
  ) {}

  async getGeojson(cafeId?: string, projection?: ProjectionType<Geojson>) {
    const geojson = await this.geoJSONModel.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );

    return cafeId ? geojson[0] : geojson;
  }
}
