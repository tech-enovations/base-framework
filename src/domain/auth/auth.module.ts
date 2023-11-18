import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CustomerService, UserService } from './services';
import { CustomerController } from './controllers';
import { JwtCustomerStrategy } from './strategies';
import { TokenService } from './services/token.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      signOptions: { expiresIn: '5s' },
    }),
  ],
  controllers: [CustomerController],
  providers: [
    JwtService,
    UserService,
    CustomerService,
    JwtCustomerStrategy,
    TokenService,
  ],
  exports: [
    JwtService,
    UserService,
    CustomerService,
    JwtCustomerStrategy,
    TokenService,
  ],
})
export class AuthModule {}
