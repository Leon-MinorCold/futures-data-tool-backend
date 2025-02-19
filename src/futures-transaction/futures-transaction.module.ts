import { Module } from '@nestjs/common';
import { FuturesTransactionController } from './futures-transaction.controller';
import { FuturesTransactionService } from './futures-transaction.service';

@Module({
  controllers: [FuturesTransactionController],
  providers: [FuturesTransactionService],
  exports: [FuturesTransactionService],
})
export class FuturesTransactionModule {}
