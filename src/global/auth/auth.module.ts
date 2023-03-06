import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/domain/user/user.service';
import { User, userSchema } from '../../domain/user/schema/user.schema';
import { UserModule } from '../../domain/user/user.module';
import { UserRepository } from '../../domain/user/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
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
    JwtStrategy,
    JwtService,
    UserRepository,
    UserService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
