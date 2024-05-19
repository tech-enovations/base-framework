import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ERROR_CODE_CONSTANTS, JWT_CONSTANT } from 'src/constants';
import { LoggerService } from 'src/core';
import { HttpExceptionFilter } from 'src/shared';

@Injectable()
export class JwtAuthRefreshCustomerGuard extends AuthGuard(
  JWT_CONSTANT.STRATEGIES.REFRESH_CUSTOMER_TOKEN,
) {
  private _logger = new LoggerService(JwtAuthRefreshCustomerGuard.name);
  public async canActivate(context: ExecutionContext): Promise<any> {
    try {
      return await super.canActivate(context);
    } catch (error) {
      this._logger.error('INVALID JWT ERROR', error);
      HttpExceptionFilter.throwError(
        { code: error?.response?.code || ERROR_CODE_CONSTANTS.USER.NOT_FOUND },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
