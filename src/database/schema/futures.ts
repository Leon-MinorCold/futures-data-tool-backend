import { pgTable, uuid, varchar, decimal } from 'drizzle-orm/pg-core';
import { timestampsColumns } from '../utils/columns-helper';

// 期货

export const futures = pgTable('futures', {
  id: uuid().defaultRandom().primaryKey().unique(),

  // 期货代码 ex: 玻璃 "FG"
  contract_code: varchar('contract_code', { length: 20 }).notNull().unique(),
  contract_name: varchar('contract_name', { length: 50 }).notNull(),

  // 最小价格变动 ex: 玻璃 1元/吨
  min_price_tick: decimal('min_price_tick', {
    precision: 10,
    scale: 4,
  }).notNull(),

  // 每跳波动价值 = 最小变动单位 * 合约单位 ex: 玻璃每跳波动价值 = 1 * 20 = 20元
  tick_value: decimal('tick_value', { precision: 10, scale: 4 }).notNull(),

  // 交易手续费 ex: 玻璃 76元
  trading_fee: decimal('trading_fee', { precision: 10, scale: 4 }).notNull(),

  // 交易所
  exchange: varchar('exchange', { length: 50 }).notNull(),

  // 合约单位 ex: 玻璃 20吨/手
  contract_unit: decimal('contract_unit', {
    precision: 10,
    scale: 4,
  }).notNull(),
  ...timestampsColumns,
});

// TypeScript 类型
export type Future = typeof futures.$inferSelect;
export type NewFuture = typeof futures.$inferInsert;
