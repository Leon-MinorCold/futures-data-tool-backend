import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestampsColumns, numericCasted } from '../utils/columns-helper';

// 期货

export const futures = pgTable('futures', {
  id: uuid().defaultRandom().primaryKey().unique(),

  // 期货代码 ex: 玻璃 "FG"
  code: varchar('code', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 50 }).notNull(),

  // 最小价格变动 ex: 玻璃 1(元/吨)
  minPriceTick: numericCasted('min_price_tick', {
    precision: 10,
    scale: 4,
  }).notNull(),

  // 每跳波动价值 = 最小变动单位 * 合约单位 ex: 玻璃每跳波动价值 = 1 * 20 = 20(元)
  // tickValue: numericCasted('tick_value', { precision: 10, scale: 4 }).notNull(),

  // 交易手续费 ex: 玻璃 76 (元)
  fee: numericCasted('fee', {
    precision: 10,
    scale: 4,
  }).notNull(),

  // 交易所
  exchange: varchar('exchange', { length: 50 }).notNull(),

  // 合约值 ex: 玻璃 20(吨/手)
  size: numericCasted('size', {
    precision: 10,
    scale: 4,
  }).notNull(),

  // 合约单位 ex：玻璃 -> 吨(/手)
  unit: varchar('unit', { length: 10 }).notNull(), // 例如 "吨/手"

  // 创建和更新时间
  ...timestampsColumns,
});
