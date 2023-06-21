import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { JWTException, JwtStatus } from '../exception/jwt.exception';
import { parseQueries } from 'src/libs/utils/helper/parseQuery';

@Catch(JWTException)
export class JWTExceptionFilter implements ExceptionFilter {
  catch(exception: JWTException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>() as Request;
    request.body.path = request.path;
    request.body.status = exception.status;

    const queryString = Object.entries(parseQueries(request.url))
      .map(([key, valule]) => `${key}=${valule}`)
      .join('&');

    console.log(queryString);
    Logger.warn(
      `jwt exception --- ${exception.message} --- ${
        JwtStatus[exception.status]
      } --- path: ${request.body.path} 
      --- url: ${request.url}
      }`,
    );
    Logger.log(`redirect, /auth/reissuance?${queryString}`);
    response.redirect(`/auth/reissuance?${queryString}`);
  }
}
