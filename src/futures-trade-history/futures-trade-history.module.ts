import { Module } from '@nestjs/common';
import { FuturesTradeHistoryController } from './futures-trade-history.controller';
import { FuturesTradeHistoryService } from './futures-trade-history.service';

@Module({
  controllers: [FuturesTradeHistoryController],
  providers: [FuturesTradeHistoryService],
  exports: [FuturesTradeHistoryService],
})
export class FuturesTradeHistoryModule {}
