import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { JWTException, JwtStatus } from '../exception/JWT.exception';

@Catch(JWTException)
export class JWTExceptionFilter implements ExceptionFilter {
  catch(exception: JWTException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>() as Request;
    request.body.path = request.path;
    request.body.status = exception.status;

    Logger.warn(
      `jwt exception --- ${exception.message} --- ${
        JwtStatus[exception.status]
      }`,
    );
    response.redirect('/auth/reissuance');
  }
}
