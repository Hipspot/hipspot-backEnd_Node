import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../user/schema/user.schema';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppleStrategy } from './strategy/apple.strategy';
import { GoogleStrategy } from './strategy/google.stratagy';
import { JwtStrategy } from './strategy/jwt-strategy';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    JwtModule,
  ],
  providers: [
    { provide: 'AUTH_SERVICE', useClass: AuthService },
    GoogleStrategy,
    AppleStrategy,
    JwtStrategy,
    Logger,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
