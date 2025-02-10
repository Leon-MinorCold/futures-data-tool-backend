import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateFuturesDto, Futures } from '../types/futures';
import { futures } from 'src/database/schema/futures';
import { eq } from 'drizzle-orm';
import { BaseService } from '../common/base.service';

@Injectable()
export class FuturesService extends BaseService<Futures> {
  constructor(readonly database: DatabaseService) {
    super(database, futures, 'Futures');
  }

  async findAll({ page = 1, pageSize = 10 }): Promise<Futures[]> {
    const offset = (page - 1) * pageSize;
    return await this.database.db
      .select()
      .from(futures)
      .limit(pageSize)
      .offset(offset);
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
      .where(eq(futures.contractCode, code))
      .limit(1);
    return futuresItem;
  }

  async create(data: CreateFuturesDto): Promise<Futures> {
    const {
      contractCode,
      contractName,
      minPriceTick,
      tickValue,
      tradeFee,
      exchange,
      contractUnitType,
      contractUnitValue,
    } = data;
    const existingFutures = await this.findOneByCode(data.contractCode);
    if (existingFutures)
      throw new ConflictException(
        `Futures with code ${data.contractCode} already exists`,
      );

    const futuresData = {
      contractCode,
      contractName,
      minPriceTick,
      tickValue,
      tradeFee,
      exchange,
      contractUnitType,
      contractUnitValue,
    };
    const [newFutures] = await this.database.db
      .insert(futures)
      .values(futuresData)
      .returning();

    return newFutures;
  }
}
