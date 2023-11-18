import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RepositoryModule } from './repositories';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          dbName: configService.get('MONGODB_NAME'),
          uri: configService.get('MONGODB_URL'),
        };
      },
    }),
    RepositoryModule,
  ],
  exports: [MongooseModule, RepositoryModule],
})
export class DatabaseModule {}
