import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CustomerService, UserService } from './services';
import { CustomerController } from './controllers';
import { JwtCustomerStrategy, JwtRefreshCustomerStrategy } from './strategies';
import { TokenService } from './services/token.service';

@Global()
@Module({
  imports: [JwtModule.register({})],
  controllers: [CustomerController],
  providers: [
    JwtService,
    UserService,
    CustomerService,
    JwtCustomerStrategy,
    JwtRefreshCustomerStrategy,
    TokenService,
  ],
  exports: [
    JwtService,
    UserService,
    CustomerService,
    JwtCustomerStrategy,
    JwtRefreshCustomerStrategy,
    TokenService,
  ],
})
export class AuthModule {}
