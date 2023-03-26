import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType } from 'mongoose';
import { Location } from './schemas/location.schemas';

export class LocationRepository {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}

  async findOne(cafeId: string, projection?: ProjectionType<Location>) {
    const location = await this.locationModel.find({ cafeId }, projection);
    return location[0];
  }

  async findAll() {
    return await this.locationModel.find({});
  }

  async updateOne(cafeId: string, update) {
    await this.locationModel.updateOne({ cafeId }, update);
  }
}
