import { Injectable } from '@nestjs/common';
import { BaseUser, CustomerRepository, UserType } from 'src/database';

@Injectable()
export class UserService {
  constructor(private _customerRepository: CustomerRepository) {}

  public async getProfile(payload: Partial<BaseUser>) {
    switch (payload.userType) {
      case UserType.Customer:
        return this._customerRepository.findOneBy({ _id: payload._id });
    }
  }
}
