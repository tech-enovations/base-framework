import { Global, Module } from '@nestjs/common';
import { CoreModule } from './core';

@Global()
@Module({
  imports: [CoreModule],
  exports: [CoreModule],
})
export class BaseFrameworkModule {}
