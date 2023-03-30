import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from '@arendajaelu/nestjs-passport-apple';
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super({
      clientID: process.env.APPLE_OAUTH_CLIENT_ID,
      teamID: process.env.APPLE_OAUTH_TEAM_ID,
      keyID: process.env.APPLE_OAUTH_KEY_ID,
      callbackURL: process.env.APPLE_OAUTH_CALLBACK_URL,
      keyFilePath: process.env.APPLE_OAUTH_PRIVATE_KEY_PATH,
      passReqToCallback: true,
      scope: ['email', 'name'],
    });
  }
}
