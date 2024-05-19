import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { JWT_CONSTANT } from 'src/constants';
import { GoogleProfile } from '../types/social.type';

@Injectable()
export class GoogleCustomerStrategy extends PassportStrategy(
  Strategy,
  JWT_CONSTANT.STRATEGIES.CUSTOMER_GOOGLE_TOKEN,
) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: ['email', 'profile'],
    });
  }

  public authenticate(req: Request, options: any) {
    const callbackURL = `${req.protocol}://${req.get(
      'host',
    )}/api/auth/customer-social/google-redirect`;
    options.callbackURL = callbackURL;
    super.authenticate(req, options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<void> {
    profile['accessToken'] = accessToken;
    profile['refreshToken'] = refreshToken;
    done(null, profile);
  }
}
