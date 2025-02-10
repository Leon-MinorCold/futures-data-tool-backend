import { z } from 'zod';

export const dateSchema = z.object({
  createdAt: z
    .number({
      invalid_type_error: '创建时间必须是数字时间戳',
      required_error: '缺少创建时间',
    })
    .int()
    .positive()
    .describe('创建时间戳')
    .refine((v) => v < Date.now() + 1000, '时间戳不能超过当前时间1秒')
    .optional(),
  updatedAt: z
    .number({
      invalid_type_error: '更新时间必须是数字时间戳',
      required_error: '缺少更新时间',
    })
    .int()
    .positive()
    .describe('更新时间戳')
    .optional(),
});

export const paginationSchema = z.object({
  page: z.number().positive().default(1),
  pageSize: z.number().positive().default(10),
});

export interface PaginatedResponse<T> {
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}
