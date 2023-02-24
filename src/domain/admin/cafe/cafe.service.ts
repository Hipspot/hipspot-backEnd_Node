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

      case 'openingHours':
        const openingHorus = await this.openingHoursModel.find();
        return openingHorus;
      case 'imageList':
        const imageList = await this.imageListModel.find();
        return imageList;
      case 'rating':
        const rating = await this.ratingModel.find();
        return rating;
      case 'price':
        const price = await this.priceModel.find();
        return price;
      default:
        return `오류오류, document type:${type} 확인해주세요. 확인 가능한 타입은 \n ${types.join(
          ', ',
        )} \n 입니다.`;
    }
  }

  async getInfo() {
    const info = await this.infoModel.find();
    return info;
  }

  async getOpeningHours() {
    const openingHorus = await this.openingHoursModel.find();
    return openingHorus;
  }

  async getImageList() {
    const imageList = await this.imageListModel.find();
    return imageList;
  }

  async getRating() {
    const rating = await this.ratingModel.find();
    return rating;
  }
  async getPrice() {
    const price = await this.priceModel.find();
    return price;
  }

  async updateOpeningHoursFromString(cafeId: string, str: string) {
    const converted = OpeningHours.convertTime(str);
    (await this.openingHoursModel.updateOne(
      { cafeId },
      { $set: { timeBlock: converted }, $unset: { time: 0 } },
    )) as unknown as OpeningHours;
  }
}
