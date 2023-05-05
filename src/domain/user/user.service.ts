import { Injectable } from '@nestjs/common';
import { UserDetailDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { FavoriteService } from '../favorite/favorite.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly favoriteService: FavoriteService,
  ) {}

  async findOne(options) {
    return await this.userRepository.findOne(options);
  }

  async register(userDetails: UserDetailDto, refreshTokenIv?: string) {
    return await this.userRepository.insertOne({
      ...userDetails,
      refreshTokenIv: refreshTokenIv || null,
    });
  }

  async tokenUpdate(userId: string, refreshTokenIv: string) {
    console.log('register', userId, refreshTokenIv);
    console.log(
      await this.userRepository.findOneAndUpdate(userId, {
        refreshTokenIv,
      }),
    );
  }

  async unRegister(userId: string) {
    await this.favoriteService.unRegisterFavorite(userId);
    await this.userRepository.deleteOne(userId);
    return { statusCode: 200, message: '회원탈퇴 성공', userId };
  }
}
