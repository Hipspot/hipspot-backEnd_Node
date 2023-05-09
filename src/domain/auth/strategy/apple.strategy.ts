import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from '@arendajaelu/nestjs-passport-apple';
import { parseQueries } from 'src/libs/utils/helper/parseQuery';
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super({
      clientID: process.env.APPLE_OAUTH_CLIENT_ID,
      teamID: process.env.APPLE_OAUTH_TEAM_ID,
      keyID: process.env.APPLE_OAUTH_KEY_ID,
      callbackURL: process.env.APPLE_OAUTH_CALLBACK_URL,
      keyFilePath: process.env.APPLE_OAUTH_PRIVATE_KEY_PATH,
      scope: ['email', 'name'],
    });
  }

  authenticate(req: Request, options?: any) {
    const platform = parseQueries(req.url)?.platform || 'web';
    console.log('apple authenticate', req.url, 'platform', platform);
    super.authenticate(req, {
      ...options,
      state: { platform }, // 콜백으로 받는 url에 state 쿼리 추가
    });
  }
}
