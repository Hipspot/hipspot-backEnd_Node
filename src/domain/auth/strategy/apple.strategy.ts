import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from '@arendajaelu/nestjs-passport-apple';
import { parseQueries } from 'src/libs/utils/helper/parseQuery';
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super({
      clientID: process.env.APPLE_OAUTH_CLIENT_ID,
      teamID: process.env.APPLE_OAUTH_TEAM_ID,
      keyID: process.env.APPLE_OAUTH_KEY_ID,
      // callbackURL: process.env.APPLE_OAUTH_CALLBACK_URL,
      keyFilePath: process.env.APPLE_OAUTH_PRIVATE_KEY_PATH,
      scope: ['email', 'name'],
    });
  }

  authenticate(req: Request, options?: any) {
    const platform = parseQueries(req.url)?.platform || 'web';
    console.log('apple authenticate', req.url, 'platform', platform);
    super.authenticate(req, {
      ...options,
      callbackURL: `${process.env.APPLE_OAUTH_CALLBACK_URL}?platform=${platform}`, // authenticate 오버라이딩으로 동적 Url 적용
    });
  }
}
