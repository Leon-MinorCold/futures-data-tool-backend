import { bigint, customType } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const timestampsColumns = {
  createdAt: bigint('created_at', { mode: 'number' }) // 存储秒级 UNIX 时间戳
    .default(sql`EXTRACT(EPOCH FROM NOW())`)
    .notNull(),

  updatedAt: bigint('updated_at', { mode: 'number' }) // 自动更新
    .default(sql`EXTRACT(EPOCH FROM NOW())`)
    .notNull(),
};

// FixBug: 解决 drizzle-orm numeric 返回string类型 与 zod 的number类型不兼容问题
// To: https://github.com/drizzle-team/drizzle-orm/issues/1042#issuecomment-2224689025
type NumericConfig = {
  precision?: number;
  scale?: number;
};

export const numericCasted = customType<{
  data: number;
  driverData: string;
  config: NumericConfig;
}>({
  dataType: (config) => {
    if (config?.precision && config?.scale) {
      return `numeric(${config.precision}, ${config.scale})`;
    }
    return 'numeric';
  },
  fromDriver: (value: string) => Number.parseFloat(value), // note: precision loss for very large/small digits so area to refactor if needed
  toDriver: (value: number) => value.toString(),
});

// 将对象的 key 从 camelCase 转换为 snake_case
export function toSnakeCase<T>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );
      acc[newKey] = toSnakeCase(obj[key as keyof T]);
      return acc;
    }, {} as any);
  }
  return obj;
}

// 将对象的 key 从 snake_case 转换为 camelCase
export function toCamelCase<T>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );
      acc[newKey] = toCamelCase(obj[key as keyof T]);
      return acc;
    }, {} as any);
  }
  return obj;
}
