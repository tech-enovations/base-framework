import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { JWT_CONSTANT } from 'src/constants';
import { Customer } from 'src/database';
import { BaseController } from 'src/shared';
import { Public } from '../decorators';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LoginDTO, RegisterDTO } from '../dto';
import { JwtAuthCustomerGuard, JwtAuthRefreshCustomerGuard } from '../guards';
import { CustomerService } from '../services';

@Controller('auth/customers')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthCustomerGuard)
export class AuthCustomerController extends BaseController {
  private _cookieName = JWT_CONSTANT.COOKIE.NAME;
  private _cookiePath = JWT_CONSTANT.COOKIE.PATH;
  constructor(private _customerService: CustomerService) {
    super();
  }
  @Get('profile')
  public async profile(
    @CurrentUser() customer: Customer,
    @Res() response: Response,
  ) {
    return this.responseCustom(response, Customer.deserialize(customer));
  }

  @Post('login')
  @Public()
  public async login(@Body() loginDto: LoginDTO, @Res() response: Response) {
    const { user, tokenInfo, refreshToken } = await this._customerService.login(
      loginDto,
    );
    this._setCookieRefreshToken(response, refreshToken);
    return this.responseCustom(response, { user: user.serialize(), tokenInfo });
  }

  @Post('refresh')
  @Public()
  @UseGuards(JwtAuthRefreshCustomerGuard)
  public async refreshToken(
    @CurrentUser() customer: Customer,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { tokenInfo, user } = await this._customerService.refreshAccessToken(
      customer,
    );
    return this.responseCustom(response, { user: user.serialize(), tokenInfo });
  }

  @Post('logout')
  public async logout(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() customer: Customer,
  ) {
    this._clearRefreshToken(response);
    await this._customerService.logout(customer);
    return this.responseCustom(response, { message: 'Logged out' });
  }

  @Post('registration')
  @Public()
  public async registration(
    @Body() registerDto: RegisterDTO,
    @Res() response: Response,
  ) {
    const { user, tokenInfo } = await this._customerService.registration(
      registerDto,
    );
    return this.responseCustom(response, { user: user.serialize(), tokenInfo });
  }

  private _setCookieRefreshToken(response: Response, refreshToken: string) {
    response.cookie(this._cookieName, refreshToken, {
      httpOnly: true,
      path: this._cookiePath,
      maxAge: JWT_CONSTANT.EXPIRE_SECONDS,
    });
  }

  private _clearRefreshToken(response: Response) {
    response.clearCookie(this._cookieName, { path: this._cookiePath });
  }
}
