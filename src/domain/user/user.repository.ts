import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { UserDto, UserType } from './dto/user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(option: Partial<UserType>) {
    const user = await this.userModel.findOne({ ...option });
    return user;
  }

  async insertOne(user: Omit<UserDto, 'userId'>) {
    const userId = randomUUID();
    return await this.userModel.create({ ...user, userId });
  }

  async findOneAndUpdate(userId: string, updateDetails: Partial<UserDto>) {
    return await this.userModel.findOneAndUpdate(
      { userId },
      { $set: { ...updateDetails } },
    );
  }
  async deleteOne(userId: string) {
    const deleteResult = await this.userModel.deleteOne({ userId }, {});
    if (deleteResult.deletedCount === 0) {
      throw new HttpException('유저 정보가 없습니다.', HttpStatus.BAD_REQUEST);
    }
  }
}
