import {
  pgEnum,
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { timestampsColumns } from '../utils/columns-helper';

// 创建角色枚举
export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);

export const users = pgTable('users', {
  id: uuid().defaultRandom().primaryKey().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  salt: text('salt').notNull(),
  password: text('password').notNull(),
  role: userRoleEnum('role').default('user').notNull(),
  last_signed_in: timestamp('last_signed_in'),
  refresh_token: text('refresh_token'),
  ...timestampsColumns,
});
