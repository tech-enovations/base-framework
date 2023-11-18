import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { Customer } from 'src/database';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LoginDTO, RegisterDTO } from '../dto';
import { CustomerService } from '../services';
import { JwtAuthCustomerGuard } from '../guards';
import { Public } from '../decorators';
import { BaseController } from 'src/shared';

@Controller('customers')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthCustomerGuard)
export class CustomerController extends BaseController {
  constructor(private _customerService: CustomerService) {
    super();
  }
  @Get('profile')
  public async profile(
    @CurrentUser() customer: Customer,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    return this.responseCustom(response, Customer.deserialize(customer));
  }

  @Post('login')
  @Public()
  public async login(
    @Body() loginDto: LoginDTO,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { user, tokenInfo } = await this._customerService.login(loginDto);
    return this.responseCustom(response, { user: user.serialize(), tokenInfo });
  }

  @Post('registration')
  @Public()
  public async registration(
    @Body() registerDto: RegisterDTO,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { user, tokenInfo } = await this._customerService.registration(
      registerDto,
    );
    return this.responseCustom(response, { user: user.serialize(), tokenInfo });
  }
}
