import { Model, ProjectionType } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cafe } from './schemas/cafe.schema';

@Injectable()
export class CafeService {
  constructor(
    @InjectModel(Cafe.name) private cafeModel: Model<Cafe>, // @InjectModel(Cafe.name) private cafeModel: Model<CafeDocument>,
  ) {}

  async getCafe(cafeId?: string, projection?: ProjectionType<Cafe>) {
    const cafe = await this.cafeModel.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );
    return cafeId ? cafe[0] : cafe;
  }
}
