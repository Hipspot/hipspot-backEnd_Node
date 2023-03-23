import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;
    const { authorization } = request.headers;

    if (!authorization)
      throw new HttpException(
        'token이 전송되지 않았습니다.',
        HttpStatus.UNAUTHORIZED,
      );

    const activate = (await super.canActivate(context)) as boolean;

    return activate;
  }
}
