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
    await this.imageListModel.updateOne(filter, updateQuery);
  }

  async find(
    filter: FilterQuery<ImageList>,
    projection?: ProjectionType<ImageList>,
  ) {
    await this.imageListModel.findOne(filter, projection);
  }
}
