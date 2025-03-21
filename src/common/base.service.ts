import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service'; // 假设你有一个数据库服务
import { eq } from 'drizzle-orm';

@Injectable()
export class BaseService<T, UpdateDto = Partial<T>> {
  protected readonly database: DatabaseService;

  constructor(
    database: DatabaseService,
    private readonly table: any,
    private readonly tableName: string,
  ) {
    this.database = database;
  }

  async findOneById(id: string): Promise<T> {
    const [entity] = await this.database.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);

    if (!entity) {
      throw new NotFoundException(`${this.tableName} with ID ${id} not found`);
    }

    return entity as T;
  }

  async update(id: string, data: UpdateDto): Promise<T> {
    await this.findOneById(id);
    const [updatedEntity] = await this.database.db
      .update(this.table)
      .set(data)
      .where(eq(this.table.id, id))
      .returning();
    return updatedEntity;
  }

  async delete(id: string): Promise<T> {
    await this.findOneById(id);

    const [deletedEntity] = await this.database.db
      .delete(this.table)
      .where(eq(this.table.id, id))
      .returning();
    return deletedEntity;
  }
}
