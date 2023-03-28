import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, UpdateQuery } from 'mongoose';
import { ImageList } from './image-list.schemas';

export class ImageListRepository {
  constructor(
    @InjectModel(ImageList.name) private imageListModel: Model<ImageList>,
  ) {}

  async updateOne(
    filter: FilterQuery<ImageList>,
    updateQuery: UpdateQuery<ImageList>,
  ) {
    return await this.imageListModel.findOneAndUpdate(filter, updateQuery);
  }

  async findOne(
    filter: FilterQuery<ImageList>,
    projection?: ProjectionType<ImageList>,
  ) {
    return await this.imageListModel.findOne(filter, projection);
  }

  async findAll() {
    return await this.imageListModel.find();
  }
}
