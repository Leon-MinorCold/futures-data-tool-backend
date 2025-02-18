import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/base.service';
import {
  CreateFuturesTransactionHistoryDto,
  FuturesTransactionHistory,
} from '../types/futures-transaction-history';
import { DatabaseService } from '../database/database.service';
import { futuresTransactionHistory } from '../database/schema/futures-transaction-history';
import { PaginationDto } from '../types/common';
import { count } from 'drizzle-orm';

@Injectable()
export class FuturesTransactionHistoryService extends BaseService<FuturesTransactionHistory> {
  constructor(protected readonly database: DatabaseService) {
    super(database, futuresTransactionHistory, 'FuturesTransactionHistory');
  }

  async findAll({
    page = 1,
    pageSize = 10,
  }: PaginationDto): Promise<FuturesTransactionHistory[]> {
    const offset = (page - 1) * pageSize;
    return this.database.db
      .select()
      .from(futuresTransactionHistory)
      .limit(pageSize)
      .offset(offset);
  }

  async getTotalCount(): Promise<number> {
    const result = await this.database.db
      .select({ count: count() })
      .from(futuresTransactionHistory);
    return Number(result[0]?.count || 0);
  }

  async create(
    data: CreateFuturesTransactionHistoryDto,
  ): Promise<FuturesTransactionHistory> {
    const [newItem] = await this.database.db
      .insert(futuresTransactionHistory)
      .values(data)
      .returning();

    return newItem;
  }
}
