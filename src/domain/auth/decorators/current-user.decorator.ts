import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { BaseUser } from 'src/database';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return new BaseUser(request.user);
  },
);
