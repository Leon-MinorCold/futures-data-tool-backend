import { pgEnum, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestampsColumns, numericCasted } from '../utils/columns-helper';

export const tradeDirectionEnum = pgEnum('trade_direction', ['long', 'short']);

export const futuresTradeHistory = pgTable('futures_trade_history', {
  id: uuid().defaultRandom().primaryKey().unique(),

  name: varchar('name', { length: 50 }).notNull(),

  // 交易方向: 做空or做多
  tradeDirection: tradeDirectionEnum('trade_direction')
    .default('long')
    .notNull(),

  // 交易资金
  tradeAmount: numericCasted('trade_amount', {
    precision: 10,
    scale: 4,
  }).notNull(),

  // 开仓价格
  entryPrice: numericCasted('entry_price', {
    precision: 10,
    scale: 4,
  }).notNull(),

  // 浮盈
  floatingProfit: numericCasted('floating_profit', {
    precision: 10,
    scale: 4,
  }).notNull(),

  description: text('description0'),

  ...timestampsColumns,
});
