import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    console.log('guard, activate', req.url);

    const activate = (await super.canActivate(context)) as boolean;
    return activate;
  }
}
