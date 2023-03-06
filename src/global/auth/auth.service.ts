import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../../domain/user/dto/user.dto';
import { UserRepository } from '../../domain/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(userDetails: Omit<UserType, 'userId'>) {
    console.log('authService', userDetails);
    const { email } = userDetails;
    const user = await this.userRepository.findOne({ email });
    console.log('finded user', user);
    if (user) return user;

    console.log('registrate new User');
    return await this.userRepository.insertOne(userDetails);
  }

  async findUser(userId: string) {
    return await this.userRepository.findOne({ userId });
  }

  jwtIssuance(user) {
    const { userId, displayName } = user;

    console.log('jwtIssuance', userId, displayName);
    return this.jwtService.sign(
      { userId, name: displayName },
      { secret: process.env.JWT_SECRET_KEY },
    );
  }
}
