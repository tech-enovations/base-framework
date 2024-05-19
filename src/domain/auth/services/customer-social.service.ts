import { Injectable } from '@nestjs/common';
import {
  BaseUser,
  Customer,
  CustomerRepository,
  UserProvider,
} from 'src/database';
import { GoogleProfile } from '../types';
import { CustomerService } from './customer.service';

@Injectable()
export class CustomerSocialService {
  constructor(
    private _customerRepository: CustomerRepository,
    private _customerService: CustomerService,
  ) {}

  public async upsertSocial(
    condition: Pick<BaseUser, 'providerIdentity' | 'provider'>,
    payload: Customer,
  ) {
    return this._customerRepository.findOneOrCreate(condition, payload);
  }

  public async googleLogin(profile: GoogleProfile) {
    const customer = await this.upsertSocial(
      {
        provider: UserProvider.GOOGLE,
        providerIdentity: profile.id,
      },
      Customer.mapGoogleProfile(profile),
    );

    return this._customerService.loginResponse(customer);
  }
}
