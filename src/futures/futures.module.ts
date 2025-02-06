import { Module } from '@nestjs/common';
import { FuturesController } from './futures.controller';
import { FuturesService } from './futures.service';

@Module({
  controllers: [FuturesController],
  providers: [FuturesService],
  exports: [FuturesService],
})
export class FuturesModule {}
