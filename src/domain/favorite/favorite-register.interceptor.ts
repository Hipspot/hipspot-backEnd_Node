import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FavoriteService } from './favorite.service';

@Injectable()
export class FavoriteRegisterInterceptor implements NestInterceptor {
  constructor(private readonly favoriteService: FavoriteService) {}
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (responseBody) => {
        if (responseBody === false) {
          const { userId } = ctx.switchToHttp().getRequest().user;
          await this.favoriteService.registerFavorite(userId);
          return { userId, favoriteList: [] };
        }
        return responseBody;
      }),
    );
  }
}
