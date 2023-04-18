import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType } from 'mongoose';
import { Geojson } from './schemas/Geojson.schemas';

@Injectable()
export class MapService {
  constructor(
    @InjectModel(Geojson.name) private geoJSONModel: Model<Geojson>,
  ) {}

  async getGeojsonOne(cafeId: string, projection?: ProjectionType<Geojson>) {
    const geojson = await this.geoJSONModel.findOne(
      { 'properties.cafeId': cafeId },
      projection || {},
    );

    return geojson;
  }

  async getGeojson(projection?: ProjectionType<Geojson>) {
    const geojson = await this.geoJSONModel.find({}, projection || {});

    return geojson;
  }
}
