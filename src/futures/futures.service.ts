import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  CreateFuturesDto,
  Futures,
  GetPaginatedFuturesDto,
  GetFuturesDto,
} from '../types/futures';
import { futures } from '../database/schema/futures';
import { eq, count, desc } from 'drizzle-orm';
import { BaseService } from '../common/base.service';

@Injectable()
export class FuturesService extends BaseService<Futures> {
  constructor(readonly database: DatabaseService) {
    super(database, futures, 'Futures');
  }

  // 全量查询
  async findAll(filter?: GetFuturesDto): Promise<Futures[]> {
    const query = this.database.db
      .select()
      .from(futures)
      .orderBy(desc(futures.updatedAt));
    if (filter?.exchange) {
      query.where(eq(futures.exchange, filter.exchange));
    }
    return query;
  }

  //  分页查询
  async findPaginated({
    page,
    pageSize,
  }: GetPaginatedFuturesDto): Promise<Futures[]> {
    const offset = (page - 1) * pageSize;
    return this.database.db
      .select()
      .from(futures)
      .orderBy(desc(futures.updatedAt))
      .limit(pageSize)
      .offset(offset);
  }

  async getTotalCount(): Promise<number> {
    const result = await this.database.db
      .select({ count: count() })
      .from(futures);
    return Number(result[0]?.count || 0);
  }

  async findOneById(id: string): Promise<Futures> {
    const [entity] = await this.database.db
      .select()
      .from(futures)
      .where(eq(futures.id, id))
      .limit(1);

    if (!entity) {
      throw new NotFoundException(`Futures with ID ${id} not found`);
    }

    return entity;
  }

  async findOneByCode(code: string): Promise<Futures> {
    const [futuresItem] = await this.database.db
      .select()
      .from(futures)
      .where(eq(futures.code, code))
      .limit(1);
    return futuresItem;
  }

  async create(data: CreateFuturesDto): Promise<Futures> {
    const { code, name, minPriceTick, fee, exchange, size, unit } = data;
    const existingFutures = await this.findOneByCode(data.code);
    if (existingFutures)
      throw new ConflictException(
        `Futures with code ${data.code} already exists`,
      );

    const futuresData = {
      code,
      name,
      minPriceTick,
      fee,
      exchange,
      size,
      unit,
    };
    const [newFutures] = await this.database.db
      .insert(futures)
      .values(futuresData)
      .returning();

    return newFutures;
  }
}
