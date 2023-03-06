import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/domain/user/user.service';
import { UserDetailDto, UserDto } from '../../domain/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(userDetails: UserDetailDto) {
    const { email } = userDetails;
    const user = await this.userService.findOne({ email });
    if (user) return user;
    return await this.userService.register(userDetails);
  }

  jwtIssuance(user: UserDto) {
    const { userId, displayName } = user;
    return this.jwtService.sign(
      { userId, name: displayName },
      { secret: process.env.JWT_SECRET_KEY },
    );
  }
}
