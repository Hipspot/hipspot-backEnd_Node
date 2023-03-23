import { Injectable } from '@nestjs/common';
import { UserDetailDto } from './dto/user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
}
