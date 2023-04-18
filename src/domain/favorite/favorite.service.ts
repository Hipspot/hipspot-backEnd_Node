import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Favorite } from './favorite.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
    private readonly logger: Logger,
  ) {}

  async registerFavorite(userId: string) {
    Logger.log(`register, ${userId}`);
    await this.favoriteModel.create({
      userId,
      favoriteList: [],
    });
  }

  async getFavorite(userId: string) {
    const favorites = await this.favoriteModel.findOne(
      { userId },
      { _id: 0, __v: 0 },
    );
    return favorites;
  }

  async addFavorite(userId: string, cafeId: string) {
    const updateResult = await this.favoriteModel
      .updateOne(
        {
          userId,
        },
        { $addToSet: { favoriteList: cafeId } },
      )
      .exec();

    if (updateResult.matchedCount === 0) {
      return false;
    }

    if (updateResult.modifiedCount === 0) {
      throw new HttpException(
        '해당 카페가 이미 즐겨찾기에 등록되어 있습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { statuesCode: 200, message: `add 성공`, cafeId };
  }

  async removeFavorite(userId: string, cafeId: string) {
    const updateResult = await this.favoriteModel
      .updateOne(
        {
          userId,
        },
        { $pull: { favoriteList: cafeId } },
      )
      .exec();

    if (updateResult.matchedCount === 0) {
      throw new HttpException(
        '아이디가 확인되지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateResult.modifiedCount === 0) {
      throw new HttpException(
        '해당 카페가 즐겨찾기에 존재하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { statuesCode: 200, message: `remove 성공`, cafeId };
  }
}
