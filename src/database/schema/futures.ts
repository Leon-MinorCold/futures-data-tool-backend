import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestampsColumns, numericCasted } from '../utils/columns-helper';

// 期货

export const futures = pgTable('futures', {
  id: uuid().defaultRandom().primaryKey().unique(),

  // 期货代码 ex: 玻璃 "FG"
  contractCode: varchar('contract_code', { length: 20 }).notNull().unique(),
  contractName: varchar('contract_name', { length: 50 }).notNull(),

  // 最小价格变动 ex: 玻璃 1元/吨
  minPriceTick: numericCasted('min_price_tick', {
    precision: 10,
    scale: 4,
  }).notNull(),

  // 每跳波动价值 = 最小变动单位 * 合约单位 ex: 玻璃每跳波动价值 = 1 * 20 = 20元
  tickValue: numericCasted('tick_value', { precision: 10, scale: 4 }).notNull(),

  // 交易手续费 ex: 玻璃 76元
  tradeFee: numericCasted('trade_fee', {
    precision: 10,
    scale: 4,
  }).notNull(),

  // 交易所
  exchange: varchar('exchange', { length: 50 }).notNull(),

  // 合约值 ex: 玻璃 20吨/手
  contractUnitValue: numericCasted('contract_unit_value', {
    precision: 10,
    scale: 4,
  }).notNull(),

  // 合约单位 ex：玻璃- 吨/手
  contractUnitType: varchar('contract_unit_type', { length: 10 }).notNull(), // 例如 "吨/手"

  // 创建和更新时间
  ...timestampsColumns,
});
