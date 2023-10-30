import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '../../src/core/logger';

export class BaseController {
  private _logger = new LoggerService(BaseController.name);
  public responseCustom(
    res: Response,
    data: any,
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
    res.set('Cache-Control', 'public, max-age=31557600');
    res.status(status).send({
      status,
      message: message,
      data: data,
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
