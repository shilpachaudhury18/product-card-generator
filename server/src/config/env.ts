import 'dotenv/config';
import { z } from 'zod';

const list = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5001),
  // not required at startup - without it the generate route just returns a config error
  GEMINI_API_KEY: z.string().trim().optional(),
  GEMINI_MODEL: z.string().trim().min(1).default('gemini-flash-latest'),
  GEMINI_FALLBACK_MODELS: z.string().default('').transform(list),
  CORS_ORIGIN: z.string().default('http://localhost:5173').transform(list),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // only print the variable names, never the values
  const names = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ');
  throw new Error(`Invalid environment variables: ${names}`);
}

export const env = parsed.data;
