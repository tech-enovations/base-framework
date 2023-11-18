import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONSTANT } from 'src/constants';
import { BaseUser } from 'src/database';

@Injectable()
export class TokenService {
  constructor(private readonly _jwtService: JwtService) {}
  public async genToken(user: BaseUser) {
    const secretToken = BaseUser.getSecret(user.userType);
    const iat = Date.now() / 1000;
    const tokenExpireIn = Math.round(iat + JWT_CONSTANT.EXPIRE_SECONDS);
    return this._jwtService.signAsync(new BaseUser(user).serialize(), {
      secret: secretToken,
      expiresIn: tokenExpireIn,
    });
  }
}
