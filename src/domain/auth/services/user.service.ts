import { Injectable } from '@nestjs/common';
import {
  BaseRepository,
  BaseUser,
  CustomerRepository,
  UserType,
} from 'src/database';

@Injectable()
export class UserService {
  constructor(private _customerRepository: CustomerRepository) {}

  private _getRepository(userType: UserType): BaseRepository<BaseUser> {
    switch (userType) {
      case UserType.Customer:
        return this._customerRepository;
      default:
        throw new Error(`User type ${userType} not implemented!`);
    }
  }

  public async getProfile(payload: Partial<BaseUser>) {
    return this._getRepository(payload.userType).findOneById(payload._id, {
      lean: true,
    });
  }

  public async updateRefreshToken(
    user: Partial<BaseUser>,
    refreshToken: string,
  ) {
    return this._getRepository(user.userType).updateById(user._id, {
      refreshToken,
    });
  }

  public async deleteRefreshToken(user: Partial<BaseUser>) {
    return this._getRepository(user.userType).updateById(user._id, {
      refreshToken: null,
    });
  }

  public async validateRefreshToken(
    payload: Partial<BaseUser>,
    refreshToken: string,
  ) {
    return this._getRepository(payload.userType).findOneBy(
      { _id: payload._id, refreshToken },
      { lean: true },
    );
  }
}
