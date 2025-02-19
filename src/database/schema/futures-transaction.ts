import { jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestampsColumns } from '../utils/columns-helper';
import {
  DEFAULT_FUTURES_TRANSACTION_BASIS,
  FuturesTransactionBasis,
  FuturesTransactionEntry,
  DEFAULT_FUTURES_TRANSACTION_ENTRY,
  FuturesTransactionProfit,
  DEFAULT_FUTURES_TRANSACTION_PROFIT,
  FuturesTransactionMeta,
} from '../../types/futures-transaction';
import { futures } from './futures';

export const futuresTransaction = pgTable('futures_transaction', {
  id: uuid().defaultRandom().primaryKey().unique(),
  futuresId: uuid('futures_id').references(() => futures.id),
  futuresMeta: jsonb('futures_meta').$type<FuturesTransactionMeta>().notNull(),
  description: text('description'),

  basis: jsonb('basis')
    .default(DEFAULT_FUTURES_TRANSACTION_BASIS)
    .$type<FuturesTransactionBasis>(),
  entry: jsonb('entry')
    .default(DEFAULT_FUTURES_TRANSACTION_ENTRY)
    .$type<FuturesTransactionEntry>(),
  profit: jsonb('profit')
    .default(DEFAULT_FUTURES_TRANSACTION_PROFIT)
    .$type<FuturesTransactionProfit>(),

  ...timestampsColumns,
});
