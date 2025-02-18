import { Module } from '@nestjs/common';
import { FuturesTransactionHistoryController } from './futures-transaction-history.controller';
import { FuturesTransactionHistoryService } from './futures-transaction-history.service';

@Module({
  controllers: [FuturesTransactionHistoryController],
  providers: [FuturesTransactionHistoryService],
  exports: [FuturesTransactionHistoryService],
})
export class FuturesTransactionHistoryModule {}
