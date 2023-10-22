import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger';
import { CoreServices, LoggerFactory } from './types';
import { AwsModule } from './aws';
import { RedisModule } from './redis';

@Global()
@Module({
  imports: [AwsModule, RedisModule],
  controllers: [],
  providers: [
    {
      provide: CoreServices.LoggingService,
      useFactory: (): LoggerFactory => {
        return { create: (context: string) => new LoggerService(context) };
      },
    },
  ],
  exports: [CoreServices.LoggingService, AwsModule, RedisModule],
})
export class CoreModule {}
