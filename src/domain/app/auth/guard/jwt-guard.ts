import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JWTException, JwtStatus } from 'src/global/exception/jwt.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;
    const response = context.switchToHttp().getResponse() as Response;
    const { authorization: hipspot_access_token } = request.headers;
    const { hipspot_refresh_token } = request.cookies;

    if (!(hipspot_access_token || hipspot_refresh_token))
      throw new HttpException('token이 아예 없습니다', HttpStatus.UNAUTHORIZED);

    const activate = (await super.canActivate(context)) as boolean;

    return activate;
  }

  handleRequest(
    err: Error, // strategy validate에서 에러가 터지면 여기로 온다.
    user: any,
    info: Error, //jwtStrategy에서 에러가 터지면 여기로 온다
    context: ExecutionContext,
    status?: any,
  ) {
    if (err) throw err; // 사실상 올 일이 없지 않나
    if (info) {
      let status;
      if (info.message === 'No auth token') status = JwtStatus.NO_AUTH_TOKEN; // authorization 헤더에 값이 없다
      if (info.message === 'jwt expired') status = JwtStatus.EXPIRED; // 시간이 만료되었을 경우

      throw new JWTException(info.message, status);
    } else {
      return user;
    }
  }
}
