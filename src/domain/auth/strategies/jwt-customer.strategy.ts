import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ERROR_CODE_CONSTANTS, JWT_CONSTANT } from 'src/constants';
import { BaseStatus, BaseUser } from 'src/database';
import { HttpExceptionFilter } from 'src/shared';
import { UserService } from '../services';

@Injectable()
export class JwtCustomerStrategy extends PassportStrategy(
  Strategy,
  JWT_CONSTANT.STRATEGIES.CUSTOMER_TOKEN,
) {
  constructor(private _userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.SECRET_CUSTOMER_JWT,
    });
  }
  public async validate(payload: Partial<BaseUser>) {
    const user = await this._userService.getProfile(payload);
    if (!user) {
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
