import { Module } from '@nestjs/common';
import { CoreServices } from '../types';
import { AwsS3Service } from './services';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: CoreServices.StorageService,
      useClass: AwsS3Service,
    },
  ],
  exports: [CoreServices.StorageService],
})
export class AwsModule {}
