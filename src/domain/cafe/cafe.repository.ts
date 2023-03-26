import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType, UpdateQuery } from 'mongoose';
import { Cafe } from './schemas/cafe.schema';
import { Rating } from './schemas/rating.schema';

@Injectable()
export class CafeRepository {
  constructor(
    @InjectModel(Cafe.name) private cafeModel: Model<Cafe>,
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
  ) {}

  async findOne(cafeId?: string, projection?: ProjectionType<Cafe>) {
    const cafe = await this.cafeModel.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );
    return cafe;
  }

  async findAll() {
    const cafeList = await this.cafeModel.find();
    return cafeList;
  }

  async findAllRating() {
    const ratingList = await this.ratingModel.find();
    return ratingList;
  }

  async updateOne(cafeId, update: UpdateQuery<Cafe>) {
    return await this.cafeModel.findOneAndUpdate({ cafeId }, update);
  }
}
