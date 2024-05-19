import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_CONSTANT } from 'src/constants';

@Injectable()
export class GoogleOAuthCustomerGuard extends AuthGuard(
  JWT_CONSTANT.STRATEGIES.CUSTOMER_GOOGLE_TOKEN,
) {
  constructor() {
    super({
      accessType: 'offline',
    });
  }
}
