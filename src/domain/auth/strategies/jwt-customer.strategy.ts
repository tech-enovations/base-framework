import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANT } from 'src/constants';
import { BaseUser } from 'src/database';
import { UserService } from '../services';

@Injectable()
export class JwtCustomerStrategy extends PassportStrategy(
  Strategy,
  JWT_CONSTANT.STRATEGIES.CUSTOMER_TOKEN,
) {
  constructor(private _userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_CUSTOMER_JWT,
    });
  }
  public async validate(payload: Partial<BaseUser>) {
    return payload;
  }
}
