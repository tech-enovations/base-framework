import {
  Global,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { CoreModule, RedisModule } from './core';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { FileModule } from './domain/files';
import { AuthModule } from './domain/auth/auth.module';
import { AppService } from './app.service';
import { EventHandlerModule } from './event-handler';
import { LoggerMiddleware } from './shared';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      isGlobal: true,
    }),
    EventHandlerModule,
    CoreModule,
    DatabaseModule,
    FileModule,
    AuthModule,
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          url: process.env.REDIS_URL,
          keyPrefix: 'haha:',
        },
      }),
    }),
  ],
  providers: [AppService],
  exports: [CoreModule],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
