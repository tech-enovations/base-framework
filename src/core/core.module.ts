import { Global, Module } from '@nestjs/common';
import { AwsModule } from './aws';
import { LoggerService } from './logger';
import { CoreServices, LoggerFactory } from './types';

@Global()
@Module({
  imports: [AwsModule],
  controllers: [],
  providers: [
    {
      provide: CoreServices.LoggingService,
      useFactory: (): LoggerFactory => {
        return { create: (context: string) => new LoggerService(context) };
      },
    },
  ],
  exports: [CoreServices.LoggingService, AwsModule],
})
export class CoreModule {}
