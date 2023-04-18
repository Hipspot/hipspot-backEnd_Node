import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserIdFromAccessToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.user.userId;
    return userId;
  },
);
