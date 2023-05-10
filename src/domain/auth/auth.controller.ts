import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ParsedGoogltAuthProfileType } from './dto/google-auth.dto';
import { AppleAuthGuard } from './guard/apple-auth-guard';
import { GoogleAuthGuard } from './guard/google-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  @Get('login/google')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin(@Req() req: Request) {
    return { msg: 'google', user: req.user };
  }

  @Get('login/apple')
  @UseGuards(AppleAuthGuard)
  handleAppleLogin(@Req() req: Request) {
    return { msg: 'apple', user: req.user };
  }

  @Post('callback')
  async handleAppleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body,
  ) {
    this.logger.log('apple Callback', body);

    const { id_token, state } = body;

    const decoded = this.jwtService.decode(id_token) as { email: string };
    const email = decoded.email;
    const displayName = email.split('@')[0];
    const inboundedUser = { email, displayName, image: null };
    //db에서 유저 확인
    let user = await this.authService.validateUser(inboundedUser);
    // 가입된 유저 없는 경우 유저 생성
    if (!user) {
      user = await this.authService.registerNewUser(inboundedUser);
    }
    this.logger.log('리프레시토큰 새로 할당');
    this.logger.verbose(user);
    const refreshToken = await this.authService.refreshTokenInssuance(
      user.userId,
    );
    const accessToken: string = this.authService.accessTokenInssuance(user.id);

    if (state === 'mobile') {
      const url = `hipspot-mobile://?access_token=${accessToken}&refresh_token=${refreshToken}`;
      res.setHeader('Content-Type', 'text/html');
      res.send(`
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
        `);
      return;
    }

    // 플랫폼 web인 경우 access토큰 파싱 가능한 url로 리다이렉트
    if (state === 'web') {
      res.cookie('hipspot_refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: true,
      });
      return res.redirect(
        `${process.env.WEB_REDIRECT_PAGE}?access_token=${accessToken}`,
      );
    }
  }

  //google AuthGuard에서 확인 이후 이 컨트롤러로 user정보 전달
  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(
    @Req() req: Request,
    @Res() res: Response,
    @Query('platform') platform: string,
  ) {
    const { email, photo, displayName } =
      req.user as ParsedGoogltAuthProfileType;
    const inboundedUser = {
      email,
      image: photo,
      displayName,
    };

    //db에서 유저 확인
    let user = await this.authService.validateUser(inboundedUser);
    // 가입된 유저 없는 경우 유저 생성
    if (!user) {
      user = await this.authService.registerNewUser(inboundedUser);
    }

    this.logger.log('리프레시토큰 새로 할당');
    this.logger.verbose(user);
    const refreshToken = await this.authService.refreshTokenInssuance(
      user.userId,
    );

    // 발급된 accessToken 클라이언트에 전달
    const accessToken: string = this.authService.accessTokenInssuance(
      user.userId,
    );

    // 플랫폼아 모바일인 경우, schema 변경후 브라우저에서 해당 location으로 이동하는 JS 코드가 담긴 Html 전달
    // setTimeout으로 자동 실행
    if (platform === 'mobile') {
      const url = `hipspot-mobile://?access_token=${accessToken}&refresh_token=${refreshToken}`;
      res.setHeader('Content-Type', 'text/html');
      res.send(`
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
        `);
      return;
    }

    // 플랫폼 web인 경우 access토큰 파싱 가능한 url로 리다이렉트
    if (platform === 'web') {
      res.cookie('hipspot_refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: true,
      });
      return res.redirect(
        `${process.env.WEB_REDIRECT_PAGE}?access_token=${accessToken}`,
      );
    }
  }

  /**
   *  리프레시 토큰이 올바른 값일 경우 '/redirect', 아닐 경우 auth/login/google로 이동
   */
  @Get('reissuance')
  async reissue(@Req() req: Request, @Res() res: Response) {
    const { hipspot_refresh_token } = req.cookies;

    this.logger.log('재발급 잘 되는가', hipspot_refresh_token);

    if (!hipspot_refresh_token) return res.redirect('/auth/login/google');

    const { userId, crypto } = this.jwtService.decode(
      hipspot_refresh_token,
    ) as { userId: string; crypto: string };

    const user = await this.authService.findUser(userId);

    if (!user)
      throw new HttpException(
        '일치하는 userId가 없습니다',
        HttpStatus.UNAUTHORIZED,
      );

    try {
      if (await this.authService.refreshTokenValidate(user, crypto)) {
        const accessToken = this.authService.accessTokenInssuance(userId);

        this.logger.log('리프레시토큰에서 액세스토큰 발급');
        return res.redirect(
          `${process.env.CLIENT_REDIRECT_PAGE}?access_token=${accessToken}`,
        );
      }
    } catch (e) {
      this.logger.log('리프레시토큰 새로 할당222', e);
      const refreshToken = await this.authService.refreshTokenInssuance(userId);
      res.cookie('hipspot_refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: true,
      });

      const accessToken = this.authService.accessTokenInssuance(userId);
      return res.redirect(
        `${process.env.CLIENT_REDIRECT_PAGE}?access_token=${accessToken}`,
      );
    }
  }
}
