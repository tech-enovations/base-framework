import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from 'src/core/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private _logger = new LoggerService(LoggerMiddleware.name);
  public use(request: Request, response: Response, next: NextFunction) {
    const ipAddress = request.headers['x-forwarded-for'];
    this._logger.log(
      `Request start - ${ipAddress} - [${request.method}] - ${request.url}`,
    );
    if (request.body) {
      this._logger.log(`REQUEST BODY - `, request.body);
    }
    response.once('close', () => {
      if (response.statusCode >= 200 && response.statusCode <= 299) {
        this._logger.log(
          `Request finished - [${request.method}] - ${request.url}`,
        );
      } else {
        this._logger.log(`Request failed ${request.url}`);
      }
    });
    next();
  }
}
