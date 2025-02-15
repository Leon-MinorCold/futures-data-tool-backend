import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/base.service';
import {
  CreateFuturesTradeHistoryDto,
  FuturesTradeHistory,
} from '../types/futures-trade-history';
import { DatabaseService } from '../database/database.service';
import { futuresTradeHistory } from '../database/schema/futures-trade-history';

@Injectable()
export class FuturesTradeHistoryService extends BaseService<FuturesTradeHistory> {
  constructor(protected readonly database: DatabaseService) {
    super(database, futuresTradeHistory, 'FuturesTradeHistory');
  }

  async create(
    data: CreateFuturesTradeHistoryDto,
  ): Promise<FuturesTradeHistory> {
    const {
      name,
      tradeAmount,
      tradeDirection,
      entryPrice,
      floatingProfit,
      description,
    } = data;

    const _data = {
      name,
      tradeAmount,
      tradeDirection,
      entryPrice,
      floatingProfit,
      description,
    };

    const [newItem] = await this.database.db
      .insert(futuresTradeHistory)
      .values(_data)
      .returning();

    return newItem;
  }
}
