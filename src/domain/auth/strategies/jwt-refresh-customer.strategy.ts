import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ERROR_CODE_CONSTANTS, JWT_CONSTANT } from 'src/constants';
import { BaseStatus, BaseUser, UserType } from 'src/database';
import { HttpExceptionFilter } from 'src/shared';
import { UserService } from '../services';
import { LoggerService } from 'src/core';

@Injectable()
export class JwtRefreshCustomerStrategy extends PassportStrategy(
  Strategy,
  JWT_CONSTANT.STRATEGIES.REFRESH_CUSTOMER_TOKEN,
) {
  private _logger = new LoggerService(JwtRefreshCustomerStrategy.name);
  constructor(private _userService: UserService) {
    super({
      secretOrKey: BaseUser.getRefreshSecret(UserType.Customer),
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshCustomerStrategy.extractJWT,
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }
  private static extractJWT(request: Request): string | null {
    return request.cookies?.[JWT_CONSTANT.COOKIE.NAME];
  }

  public async validate(request: Request, payload: Partial<BaseUser>) {
    const token = request.cookies[JWT_CONSTANT.COOKIE.NAME];
    const user = await this._userService.validateRefreshToken(payload, token);
    if (user?.deletedAt) {
      HttpExceptionFilter.throwError(
        { code: ERROR_CODE_CONSTANTS.USER.NOT_FOUND },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.status === BaseStatus.Disabled) {
      HttpExceptionFilter.throwError(
        { code: ERROR_CODE_CONSTANTS.USER.DISABLED },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
