import { z } from 'zod';

export const dateSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
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
