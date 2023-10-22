import { CacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Module } from '@nestjs/common';
import { CoreServices } from '../types';
import { RedisModuleAsyncOptions } from './redis.interface';
import { RedisService } from './redis.service';
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      useClass: RedisService,
      provide: CoreServices.CachingService,
    },
  ],
  exports: [CoreServices.CachingService],
})
export class RedisModule {
  public static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: [CacheModule.registerAsync(options as any)],
      exports: [RedisModule],
    };
  }
}
