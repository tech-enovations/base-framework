import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import {
  AuthCustomerController,
  AuthCustomerSocialController,
} from './controllers';
import {
  CustomerService,
  CustomerSocialService,
  TokenService,
  UserService,
} from './services';
import {
  GoogleCustomerStrategy,
  JwtCustomerStrategy,
  JwtRefreshCustomerStrategy,
} from './strategies';

@Global()
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthCustomerController, AuthCustomerSocialController],
  providers: [
    JwtService,
    UserService,
    CustomerService,
    JwtCustomerStrategy,
    JwtRefreshCustomerStrategy,
    GoogleCustomerStrategy,
    CustomerSocialService,
    TokenService,
  ],
  exports: [
    JwtService,
    UserService,
    CustomerService,
    JwtCustomerStrategy,
    JwtRefreshCustomerStrategy,
    GoogleCustomerStrategy,
    TokenService,
  ],
})
export class AuthModule {}
