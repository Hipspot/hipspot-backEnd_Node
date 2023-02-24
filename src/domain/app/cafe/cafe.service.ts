import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cafe } from './schemas/cafe.schema';

@Injectable()
export class CafeService {
  constructor(
    @InjectModel(Cafe.name) private cafeModel: Model<Cafe>, // @InjectModel(Cafe.name) private cafeModel: Model<CafeDocument>,
  ) {}

  async find() {
    const cafe = await this.cafeModel.find({});
    return cafe;
  }

  async findOne(id: string): Promise<Cafe | string> {
    const cafe = await this.cafeModel.findOne({ id: id });
    if (!cafe) return '아이디 값이 없습니다';
    return cafe;
  }

  async updateOne(updateValue) {
    console.log('업데이트 시작');
    try {
      const { instaId } = updateValue;
      console.log(
        await this.cafeModel.updateOne(
          { instaId: instaId },
          { $set: { ...updateValue } },
        ),
      );
    } catch (error) {
      console.log(error);
    }
  }
}
