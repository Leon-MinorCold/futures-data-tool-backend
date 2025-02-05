import { z } from 'zod';

export const dateSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});
