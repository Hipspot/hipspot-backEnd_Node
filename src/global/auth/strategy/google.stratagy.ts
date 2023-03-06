import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ParsedGoogltAuthProfileType } from '../dto/google-auth.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET_KEY,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URI,
      scope: ['email', 'profile'],
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
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
