import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Location } from './schemas/location.schemas';

export class LocationRepository {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}

  async find(
    filter: FilterQuery<Location>,
    projection?: ProjectionType<Location>,
  ) {
    return await this.locationModel.find(filter, projection);
  }

  async findOne(cafeId: string, projection?: ProjectionType<Location>) {
    const location = await this.locationModel.find({ cafeId }, projection);
    return location[0];
  }

  async findAll() {
    return await this.locationModel.find({});
  }

  async updateOne(cafeId: string, update) {
    await this.locationModel.updateOne({ cafeId }, { $set: { ...update } });
  }

  async findAndUpdateOne(cafeId, update) {
    return await this.locationModel.findOneAndUpdate(
      { cafeId },
      { $set: update },
    );
  }
}
