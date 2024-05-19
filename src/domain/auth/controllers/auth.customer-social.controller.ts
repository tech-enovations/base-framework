import {
  Controller,
  Get,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { JWT_CONSTANT } from 'src/constants';
import { BaseController } from 'src/shared';
import { GoogleOAuthCustomerGuard } from '../guards';
import { CustomerSocialService } from '../services';
import { GoogleProfile } from '../types/social.type';

@Controller('auth/customer-social')
@UsePipes(new ValidationPipe())
export class AuthCustomerSocialController extends BaseController {
  private _cookieName = JWT_CONSTANT.COOKIE.NAME;
  private _cookiePath = JWT_CONSTANT.COOKIE.PATH;
  constructor(private _customerSocialService: CustomerSocialService) {
    super();
  }

  @Get('google')
  @UseGuards(GoogleOAuthCustomerGuard)
  public async googleLogin(@Res() response: Response) {
    return this.responseCustom(response, { redirected: true });
  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuthCustomerGuard)
  public async googleRedirect(@Res() response: Response) {
    const profile = this._request?.user as GoogleProfile;
    const { refreshToken, tokenInfo } =
      await this._customerSocialService.googleLogin(profile);
    this._setCookieRefreshToken(response, refreshToken);
    // NOTE: redirect front end with access token
    response.redirect(
      `${process.env.CLIENT_AUTH_REDIRECT}?accessToken=${tokenInfo.jwt}`,
    );
  }

  private _setCookieRefreshToken(response: Response, refreshToken: string) {
    response.cookie(this._cookieName, refreshToken, {
      httpOnly: true,
      path: this._cookiePath,
      maxAge: JWT_CONSTANT.EXPIRE_SECONDS,
      sameSite: 'strict',
    });
  }
}
