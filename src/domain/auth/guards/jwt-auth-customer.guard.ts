import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ERROR_CODE_CONSTANTS, JWT_CONSTANT } from 'src/constants';
import { LoggerService } from 'src/core';
import { HttpExceptionFilter } from 'src/shared';

@Injectable()
export class JwtAuthCustomerGuard extends AuthGuard(
  JWT_CONSTANT.STRATEGIES.CUSTOMER_TOKEN,
) {
  private _logger = new LoggerService(JwtAuthCustomerGuard.name);
  constructor(private _reflector: Reflector) {
    super();
  }
  public async canActivate(context: ExecutionContext): Promise<any> {
    try {
      // const request = context.switchToHttp().getRequest();
      const isPublic = this._reflector.get<boolean>(
        'isPublic',
        context.getHandler(),
      );
      if (isPublic) {
        return true;
      }

      return super.canActivate(context);
    } catch (error) {
      this._logger.error('INVALID JWT ERROR', error);
      HttpExceptionFilter.throwError(
        { code: error?.response?.code || ERROR_CODE_CONSTANTS.USER.NOT_FOUND },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
