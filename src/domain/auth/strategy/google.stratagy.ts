import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ParsedGoogltAuthProfileType } from '../dto/google-auth.dto';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Request } from 'express';
import { parseQueries } from 'src/libs/utils/helper/parseQuery';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET_KEY,
      // callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URI, //옵션에 넣지 않아서 디폴트 적용 해제
      scope: ['email', 'profile'],
    });
  }

  authenticate(req: Request, options?: any) {
    const platform = parseQueries(req.url)?.platform || 'web';
    console.log('authenticate', req.url, 'platform', platform);
    super.authenticate(req, {
      ...options,
      callbackURL: `${process.env.GOOGLE_OAUTH_CALLBACK_URI}?platform=${platform}`, // authenticate 오버라이딩으로 동적 Url 적용
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails, photos } = profile;
    const user: ParsedGoogltAuthProfileType = {
      email: emails[0].value,
      displayName,
      photo: photos[0].value,
    };
    console.log('google api', accessToken);
    return user;
  }
}
