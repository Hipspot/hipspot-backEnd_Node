import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { parseQueries } from 'src/libs/utils/helper/parseQuery';

@Catch(HttpException)
export class UnAuthorizedFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const { platform } = parseQueries(req.url);
    const status = exception.getStatus();
    Logger.warn(
      `Http Exception  ----  ${HttpStatus[exception.getStatus()]} --- user : ${
        req.user
      } --- platform : ${platform}`,
    );

    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
