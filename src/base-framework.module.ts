import { Global, Module } from '@nestjs/common';
import { CoreModule } from './core';
import { HandleEvent } from './handle-event';

@Global()
@Module({
  imports: [CoreModule],
  providers: [HandleEvent],
  exports: [CoreModule],
})
export class BaseFrameworkModule {}
