import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType } from 'mongoose';
import { Cafe } from './schemas/cafe.schema';

@Injectable()
export class CafeRepository {
  constructor(@InjectModel(Cafe.name) private cafeModel: Model<Cafe>) {}

  async getCafe(cafeId?: string, projection?: ProjectionType<Cafe>) {
    const cafe = await this.cafeModel.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );
    return cafe;
  }
}
