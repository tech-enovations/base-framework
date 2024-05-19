import { HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_CODE_CONSTANTS } from 'src/constants';
import {
  BaseStatus,
  Customer,
  CustomerRepository,
  UserType,
} from 'src/database';
import { HttpExceptionFilter } from 'src/shared';
import { comparePasswords, hashPassword } from 'src/utils';
import { LoginDTO, RegisterDTO } from '../dto';
import { TokenService } from './token.service';

@Injectable()
export class CustomerService {
  constructor(
    private _customerRepository: CustomerRepository,
    private _tokenService: TokenService,
  ) {}

  public async getProfile(customer: Customer) {
    const profile = await this._customerRepository.findOneById(customer._id, {
      lean: true,
    });
    return new Customer(profile).serialize();
  }

  public async refreshAccessToken(customer: Customer) {
    const jwt = await this._tokenService.genToken(customer);
    return {
      user: customer,
      tokenInfo: {
        jwt,
      },
    };
  }

  public async login(loginDto: LoginDTO) {
    const customer = await this.validateCustomer(loginDto);
    return this.loginResponse(customer);
  }

  public async loginResponse(customer: Customer) {
    const { jwt, refreshToken } = await this._tokenService.updateUserToken(
      customer,
    );
    return {
      user: new Customer(customer),
      tokenInfo: {
        jwt,
      },
      refreshToken,
    };
  }

  public async logout(customer: Customer) {
    await this._tokenService.deleteUserToken(customer);
    return true;
  }

  public async validateCustomer(loginDto: LoginDTO) {
    const { username, password } = loginDto;
    const customer = await this._customerRepository.findByUsername(username);
    if (!customer) {
      HttpExceptionFilter.throwError(
        {
          code: ERROR_CODE_CONSTANTS.USER.NOT_FOUND,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (customer.status === BaseStatus.Disabled) {
      HttpExceptionFilter.throwError(
        { code: ERROR_CODE_CONSTANTS.USER.DISABLED },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!comparePasswords(password, customer.password)) {
      HttpExceptionFilter.throwError(
        { code: ERROR_CODE_CONSTANTS.USER.WRONG_PASSWORD },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return new Customer(customer);
  }

  public async registration(registerDto: RegisterDTO) {
    const customer = new Customer(registerDto);
    customer.userType = UserType.Customer;

    const isExisted = await this._customerRepository.findByUsername(
      registerDto.username,
    );
    if (isExisted) {
      HttpExceptionFilter.throwError(
        {
          code: ERROR_CODE_CONSTANTS.USER.USER_ALREADY_EXISTS,
        },
        HttpStatus.CONFLICT,
      );
    }
    customer.password = hashPassword(registerDto.password);
    await this._customerRepository.create(customer);

    return this.login(registerDto);
  }
}
