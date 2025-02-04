import { timestamp } from 'drizzle-orm/pg-core';

export const timestampsColumns = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
};
