import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OpeningHours } from './schemas/openingHours.schemas';
import { ImageList } from './schemas/imageList.schemas';
import { Info } from './schemas/info.schmas';
import { Rating } from './schemas/rating.schema';
import { Price } from './schemas/price.schemas';

@Injectable()
export class CafeService {
  constructor(
    @InjectModel(Info.name) private infoModel: Model<Info>,
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    @InjectModel(OpeningHours.name)
    private openingHoursModel: Model<OpeningHours>,
    @InjectModel(ImageList.name) private imageListModel: Model<ImageList>,
    @InjectModel(Price.name) private priceModel: Model<Price>,
  ) {}

  async getDocument(type: string) {
    const types = ['info', 'openingHours', 'imageList', 'rating', 'price'];
    switch (type) {
      case 'info':
        return await this.infoModel.find();
      case 'openingHours':
        return await this.openingHoursModel.find();
      case 'imageList':
        return await this.imageListModel.find();
      case 'rating':
        return await this.ratingModel.find();
      case 'price':
        return await this.priceModel.find();
      default:
        return `오류오류, document type:${type} 확인해주세요. 확인 가능한 타입은 \n ${types.join(
          ', ',
        )} \n 입니다.`;
    }
  }
}
