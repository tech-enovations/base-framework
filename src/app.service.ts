import { Injectable } from '@nestjs/common';
import { ICachingService, InjectCaching } from './core';

@Injectable()
export class AppService {
  constructor(@InjectCaching() private _cachingService: ICachingService) {}
}
