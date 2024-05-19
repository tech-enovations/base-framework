import { HttpStatus, Inject } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { LoggerService } from '../../src/core/logger';
import { REQUEST } from '@nestjs/core';

export class BaseController {
  private _logger = new LoggerService(BaseController.name);
  @Inject(REQUEST) protected _request: Request;

  public static getBaseUrl(request: Request) {
    return `${request.protocol}://${request.get('Host')}${request.originalUrl}`;
  }

  public responseCustom<T>(
    res: Response,
    data: T,
    option: ResponseOption = {
      total: null,
      message: null,
      code: null,
      status: HttpStatus.OK,
      extraData: null,
      skip: null,
      limit: null,
    },
  ) {
    const {
      message,
      total,
      code,
      status = HttpStatus.OK,
      extraData,
      skip,
      limit,
    } = option;

    res.status(status).send({
      status,
      message: message,
      data,
      total,
      code,
      extraData,
      skip,
      limit,
    });
  }

  public setCookie<T>(
    response: Response,
    name: string,
    value: T,
    options: CookieOptions,
  ) {
    response.cookie(name, value, options);
  }

  public clearCookie(
    response: Response,
    name: string,
    options?: CookieOptions,
  ) {
    response.clearCookie(name, options);
  }
}

export type ResponseOption = {
  total?: number;
  message?: string;
  code?: string;
  extraData?: any;
  status?: HttpStatus;
  skip?: number;
  limit?: number;
};
