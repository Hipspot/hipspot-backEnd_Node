import { Injectable } from '@nestjs/common';
import { UserDetailDto } from './dto/user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(options) {
    return await this.userRepository.findOne(options);
  }

  async register(userDetails: UserDetailDto) {
    return await this.userRepository.insertOne(userDetails);
  }
}
