import { z } from 'zod';

export const dateSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const paginationSchema = z.object({
  page: z.number().positive().default(1),
  pageSize: z.number().positive().default(10),
});
