import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(options) {
    await this.userRepository.findOne(options);
  }

  async registerUser(options: UserDto) {
    return 's123';
  }
}
