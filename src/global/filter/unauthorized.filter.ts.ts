import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class UnAuthorizedFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception.getStatus();

    if (status === HttpStatus.UNAUTHORIZED) {
      Logger.warn(
        `No Auth, redirect to login page  ----  ${
          HttpStatus[exception.getStatus()]
        } --- user : ${req.user}`,
      );
      return res.redirect(`${process.env.CLIENT_LOGIN_PAGE}`);
    }

    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
