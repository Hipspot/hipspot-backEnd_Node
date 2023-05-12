import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/domain/user/user.repository';
import { UserService } from 'src/domain/user/user.service';
import { UserDetailDto, UserDto } from '../user/dto/user.dto';
import * as cryptoUtils from './utils/crypto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {}
  async validateUser(userDetails: UserDetailDto) {
    const { email } = userDetails;
    const user = await this.userService.findOne({ email });
    return user;
  }

  async findUser(userId: string) {
    return await this.userRepository.findOne({ userId });
  }

  async registerNewUser(user: UserDetailDto) {
    console.log('regiesterUser,', user);
    this.logger.log(`registerNewUser ${user}`);
    return await this.userService.register(user);
  }

  accessTokenInssuance(userId: string) {
    return this.jwtService.sign(
      { userId },
      { secret: process.env.JWT_SECRET_KEY, expiresIn: '30m' },
    );
  }

  /**
   * 리프레시토큰 발급 및 db 갱신
   */
  async refreshTokenInssuance({ userId }: { userId: string }) {
    const iv = cryptoUtils.getRandomIv(); // iv값으로 결국 암호화 및 복호화
    const crypto = await cryptoUtils.cryptoUTFToBase64(iv, userId);

    const refresh_token = this.jwtService.sign(
      {
        userId,
        crypto,
      },
      { secret: process.env.JWT_SECRET_KEY, expiresIn: '30 days' },
    );

    await this.userRepository.findOneAndUpdate(userId, {
      refreshTokenIv: iv.toString('hex'),
    });
    return refresh_token;
  }

  /**
   *
   * @param userId user Id
   * @param cryptedUserId refresh 토큰에 암호화된
   * @returns
   */
  async refreshTokenValidate(user: UserDto, cryptedUserId: string) {
    const { userId, refreshTokenIv } = user;

    const decryptedUserId = await cryptoUtils.decryptoBase64ToUTF(
      refreshTokenIv,
      cryptedUserId,
    );

    this.logger.log(`refreshToken Validate`);
    return userId === decryptedUserId;
  }

  getHTMLForRedirectToMobile({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) {
    const url = `hipspot-mobile://?access_token=${accessToken}&refresh_token=${refreshToken}`;
    const header = { name: 'Content-Type', value: 'text/html' };
    const sendHTML = `
        <!doctype html>
        <html>
          <head>
            <title>Redirecting...</title>
            <script>
              setTimeout(function() {
                window.location = '${url}';
              }, 100);
            </script>
          </head>
          <body>
           <a href="${url}">${url}> 버튼 눌러서 로그인하기 </a>
          </body>
        </html>
      `;
    return { header, sendHTML };
  }
}
