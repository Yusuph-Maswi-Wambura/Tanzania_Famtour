import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  CLIENT_ORIGIN: z.string().default('http://localhost:3000'),
  TRUST_PROXY: z
    .string()
    .default('false')
    .transform((value) => value === 'true'),
  DATABASE_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
