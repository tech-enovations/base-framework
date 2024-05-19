import { Injectable } from '@nestjs/common';
import { Customer, CustomerRepository, UserProvider } from 'src/database';
import { GoogleProfile } from '../types';
import { CustomerService } from './customer.service';

@Injectable()
export class CustomerSocialService {
  constructor(
    private _customerRepository: CustomerRepository,
    private _customerService: CustomerService,
  ) {}

  public async googleLogin(profile: GoogleProfile) {
    const customer = await this._customerRepository.findOneBy(
      {
        provider: UserProvider.GOOGLE,
        providerIdentity: profile.id,
      },
      { lean: true },
    );
    if (!customer) {
      const googleCustomer = await this._customerRepository.create(
        Customer.mapGoogleProfile(profile),
      );
      return this._customerService.loginResponse(googleCustomer);
    }
    return this._customerService.loginResponse(customer);
  }
}
