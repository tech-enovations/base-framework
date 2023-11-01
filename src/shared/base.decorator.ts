import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request, Response } from 'express';

export const CtxRequest = createParamDecorator((ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest<Request>();
});
export const CtxResponse = createParamDecorator((ctx: ExecutionContext) => {
  return ctx.switchToHttp().getResponse<Response>();
});
