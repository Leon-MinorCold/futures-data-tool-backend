import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/base.service';
import {
  CreateFuturesTransactionDto,
  FuturesTransaction,
} from '../types/futures-transaction';
import { DatabaseService } from '../database/database.service';
import { futuresTransaction } from '../database/schema/futures-transaction';
import { PaginationDto } from '../types/common';
import { count } from 'drizzle-orm';

@Injectable()
export class FuturesTransactionService extends BaseService<FuturesTransaction> {
  constructor(protected readonly database: DatabaseService) {
    super(database, futuresTransaction, 'FuturesTransaction');
  }

  async findAll({
    page = 1,
    pageSize = 10,
  }: PaginationDto): Promise<FuturesTransaction[]> {
    const offset = (page - 1) * pageSize;
    return this.database.db
      .select()
      .from(futuresTransaction)
      .limit(pageSize)
      .offset(offset);
  }

  async getTotalCount(): Promise<number> {
    const result = await this.database.db
      .select({ count: count() })
      .from(futuresTransaction);
    return Number(result[0]?.count || 0);
  }

  async create(data: CreateFuturesTransactionDto): Promise<FuturesTransaction> {
    const { futuresMeta, futuresId, ...rest } = data;
    const _data = {
      futuresMeta,
      futuresId,
      ...rest,
    };

    const [newTransaction] = await this.database.db
      .insert(futuresTransaction)
      .values(_data)
      .returning();

    return newTransaction;
  }
}
