import { z } from 'zod';

export const configSchema = z.object({
  NEST_PUBLIC_SUPABASE_URL: z.string().url().startsWith('https://'),
  NEST_PUBLIC_SUPABASE_ANON_KEY: z.string().startsWith('ey'),
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  PORT: z.coerce.number().default(3000).optional(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
});

export type Config = z.infer<typeof configSchema>;
