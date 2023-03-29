import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super(
      {
        clientID: process.env.APPLE_OAUTH_CLIENT_ID,
        teamID: process.env.APPLE_OAUTH_TEAM_ID,
        keyID: process.env.APPLE_OAUTH_KEY_ID,
        callbackURL: process.env.APPLE_OAUTH_CALLBACK_URL,
        privateKeyString: process.env.APPLE_OAUTH_PRIVATE_KEY_STRING,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, decodedIdToken, profile, cb) => {
        console.log(
          req,
          accessToken,
          refreshToken,
          decodedIdToken,
          profile,
          cb,
        );
        // process.nextTick(() => cb(null, decodedIdToken));
      },
    );
  }
}
