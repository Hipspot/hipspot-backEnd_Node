import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { UserDetailDto, UserType } from './dto/user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(option: Partial<UserType>) {
    const user = await this.userModel.findOne({ ...option });
    return user;
  }

  async insertOne(userDetails: UserDetailDto) {
    const userId = randomUUID();
    return await this.userModel.create({ ...userDetails, userId });
  }
}
