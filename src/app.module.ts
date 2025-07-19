import { Module } from '@nestjs/common';

import { controllers } from './ctrls';
import { services } from './services';

@Module({
  imports: [],
  controllers: [...controllers],
  providers: [...services],
})
export class AppModule {}
