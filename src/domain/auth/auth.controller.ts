import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
import { JWTException, JwtStatus } from 'src/global/exception/jwt.exception';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  @Get('login/dev')
  async handleDevlogin(@Res() res, @Query('platform') platform: string) {
    if (platform !== 'web' && platform !== 'mobile')
      throw new HttpException(
        '쿼리로 플랫폼을 추가해주세요',
        HttpStatus.BAD_REQUEST,
      );

    const devUser = {
      email: 'dev@hipspot.xyz',
      displayName: '개발용',
      image: null,
    };
    //db에서 유저 확인
    let user = await this.authService.validateUser(devUser);
    // 가입된 유저 없는 경우 유저 생성
    if (!user) {
      user = await this.authService.registerNewUser(devUser);
    }
    const { accessToken, refreshToken } =
      await this.authService.devAccessTokenIssuance();

    console.log('토큰 확인', accessToken, refreshToken);
    if (platform === 'web') {
      console.log('web access token 발급');
      res.cookie('hipspot_refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: true,
      });
      return res.redirect(
        `${process.env.WEB_REDIRECT_PAGE}?access_token=${accessToken}`,
      );
    }
    if (platform === 'mobile') {
      console.log('mobile access token 발급');

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
  }

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

    /**
     * 0. 필요한 정보 파싱
     * apple Oauth의 경우, id_token이 body로 전달됨, jwt로 디코드해서 사용
     */
    const { id_token, state: platform } = body;
    const decoded = this.jwtService.decode(id_token) as { email: string };
    const email = decoded.email;
    const displayName = email.split('@')[0];

    /**
     * 1. DB에서 유저 확인
     */
    const inboundedUser = { email, displayName, image: null };
    let user = await this.authService.validateUser(inboundedUser);
    /**
     * 2. 가입된 유저 없는 경우 유저 생성
     */
    if (!user) {
      user = await this.authService.registerNewUser(inboundedUser);
    }

    /**
     * 3. 엑세스토큰, 리프레시토큰 발급
     */
    this.logger.log('리프레시토큰 새로 할당');
    this.logger.verbose(user);

    const userId = user.userId;
    const refreshToken = await this.authService.refreshTokenInssuance({
      userId,
    });
    const accessToken: string = this.authService.accessTokenInssuance(userId);

    /**
     * 4. 플랫폼에 맞게 리다이렉트
     */
    if (platform === 'mobile') {
      const { header, sendHTML } = this.authService.getHTMLForRedirectToMobile({
        accessToken,
        refreshToken,
      });
      res.setHeader(header.name, header.value);
      res.send(sendHTML); // window.location()으로 리다이렉트 가능한 HTML 전송
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

  //google AuthGuard에서 확인 이후 이 컨트롤러로 user정보 전달
  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(
    @Req() req: Request,
    @Res() res: Response,
    @Query('platform') platform: 'mobile' | 'web',
  ) {
    /**
     * 0. 필요한 정보 파싱
     * google Oauth의 경우 AuthGuard에서 user정보를 req.user에 담아서 전달
     */
    const { email, photo, displayName } =
      req.user as ParsedGoogltAuthProfileType;

    /**
     * 1. DB에서 유저 확인
     */
    const inboundedUser = {
      email,
      image: photo,
      displayName,
    };

    let user = await this.authService.validateUser(inboundedUser);
    /**
     * 2. 가입된 유저 없는 경우 유저 생성
     */
    if (!user) {
      user = await this.authService.registerNewUser(inboundedUser);
    }

    /**
     * 3. 엑세스토큰, 리프레시토큰 발급
     */
    this.logger.log('리프레시토큰 새로 할당');
    this.logger.verbose(user);
    const refreshToken = await this.authService.refreshTokenInssuance({
      userId: user.userId,
    });
    const accessToken: string = this.authService.accessTokenInssuance(user.id);

    /**
     * 4. 플랫폼에 맞게 리다이렉트
     */

    if (platform === 'mobile') {
      const { header, sendHTML } = this.authService.getHTMLForRedirectToMobile({
        accessToken,
        refreshToken,
      });
      res.setHeader(header.name, header.value);
      res.send(sendHTML); // window.location()으로 리다이렉트 가능한 HTML 전송
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
   * 리프레시 토큰으로 엑세스토큰 재발급해주는 과정
   * 쿠키 / 쿼리에서 리프레시 토큰 확인 - 토큰 없을 경우, 올바르지 않을 경우 auth/login/google로 이동
   * 리프레시 토큰이 올바른 값일 경우 액세스토큰 발급 후 리다이렉트
   */
  @Get('reissuance')
  async reissue(
    @Req() req: Request,
    @Res() res: Response,
    @Query('refresh_token') refresh_token: string,
    @Query('platform') platform: 'mobile' | 'web',
  ) {
    /**
     * 0. 리프레시 토큰 유무 쿠키, 쿼리에서 확인,
     *    플랫폼 확인, 디폴트는 web
     */
    if (!req.cookies.hipspot_refresh_token && !refresh_token)
      return res.redirect('/auth/login/google');

    const { hipspot_refresh_token } = req.cookies || refresh_token;
    platform = platform || 'web';

    if (!hipspot_refresh_token) return res.redirect('/auth/login/google');

    /**
     * 1. 리프레시 토큰 유효 확인 이후 토큰 디코딩
     */
    this.logger.log('리프레시 토큰 확인', hipspot_refresh_token);

    try {
      this.jwtService.verify(hipspot_refresh_token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch (e) {
      throw new HttpException('리프레시토큰 잘못됨', HttpStatus.UNAUTHORIZED);
    }

    const { userId, crypto } = this.jwtService.decode(
      hipspot_refresh_token,
    ) as { userId: string; crypto: string };

    const user = await this.authService.findUser(userId);
    if (!user) {
      this.logger.log('유저 없음');
      return res.redirect('/auth/login/google');
    }

    /**
     * 2. 리프레시토큰 유효성 검사 이후, 액세스토큰 재발급 또는 리프레시토큰 재발급
     */
    try {
      if (await this.authService.refreshTokenValidate(user, crypto)) {
        const accessToken = this.authService.accessTokenInssuance(userId);
        const refreshToken = hipspot_refresh_token;
        this.logger.log('리프레시 토큰 유효, 리프레시토큰에서 액세스토큰 발급');

        if (platform === 'mobile') {
          const { header, sendHTML } =
            this.authService.getHTMLForRedirectToMobile({
              accessToken,
              refreshToken,
            });
          res.setHeader(header.name, header.value);
          res.send(sendHTML);
          return;
        }

        if (platform === 'web') {
          return res.redirect(
            `${process.env.WEB_REDIRECT_PAGE}?access_token=${accessToken}`,
          );
        }
      }
    } catch (e) {
      this.logger.log('리프레시토큰 새로 할당222', e);
      const refreshToken = await this.authService.refreshTokenInssuance({
        userId,
      });
      const accessToken = this.authService.accessTokenInssuance(userId);

      if (platform === 'mobile') {
        const { header, sendHTML } =
          this.authService.getHTMLForRedirectToMobile({
            accessToken,
            refreshToken,
          });
        res.setHeader(header.name, header.value);
        res.send(sendHTML);
        return;
      }

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
  }
}
