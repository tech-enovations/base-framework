import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONSTANT } from 'src/constants';
import { BaseUser } from 'src/database';
import { UserService } from './user.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly _jwtService: JwtService,
    private _userService: UserService,
  ) {}
  public async genToken(user: BaseUser) {
    const secretToken = BaseUser.getSecret(user.userType);
    return this._jwtService.signAsync(new BaseUser(user).serialize(), {
      secret: secretToken,
      expiresIn: JWT_CONSTANT.ACCESS_TOKEN_EXPIRE,
    });
  }

  public async genRefreshToken(user: BaseUser) {
    const secretToken = BaseUser.getRefreshSecret(user.userType);
    const iat = Date.now() / 1000;
    const tokenExpireIn = Math.round(iat + JWT_CONSTANT.EXPIRE_SECONDS);
    return this._jwtService.signAsync(
      { _id: user._id, userType: user.userType },
      {
        secret: secretToken,
        expiresIn: tokenExpireIn,
      },
    );
  }

  public async updateUserToken(user: BaseUser) {
    const [jwt, refreshToken] = await Promise.all([
      this.genToken(user),
      this.genRefreshToken(user),
    ]);
    await this._userService.updateRefreshToken(user, refreshToken);
    return {
      jwt,
      refreshToken,
    };
  }

  public async deleteUserToken(user: BaseUser) {
    return this._userService.deleteRefreshToken(user);
  }
}
