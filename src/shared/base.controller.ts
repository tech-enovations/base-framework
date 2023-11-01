import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '../../src/core/logger';

export class BaseController {
  private _logger = new LoggerService(BaseController.name);
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
