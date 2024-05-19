import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
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
      callbackURL:
        'http://localhost:3333/api/auth/customer-social/google-redirect',
      scope: ['email', 'profile'],
    });
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
