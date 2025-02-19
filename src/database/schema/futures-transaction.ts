import { jsonb, pgTable, uuid } from 'drizzle-orm/pg-core';
import { timestampsColumns } from '../utils/columns-helper';
import {
  DEFAULT_FUTURES_TRANSACTION_BASIS,
  FuturesTransactionBasis,
  FuturesTransactionEntry,
  DEFAULT_FUTURES_TRANSACTION_ENTRY,
  FuturesTransactionProfit,
  DEFAULT_FUTURES_TRANSACTION_PROFIT,
} from '../../types/futures-transaction';

export const futuresTransaction = pgTable('futures_transaction', {
  id: uuid().defaultRandom().primaryKey().unique(),
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
