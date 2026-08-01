import 'dotenv/config';

import { z } from 'zod';

// ─── Environment Schema ────────────────────────────────────────────────────────
// Define the expected structure and constraints of all environment variables.
// Zod provides robust runtime validation and compiles into a static TypeScript type.
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z.coerce.number().int().min(1).max(65535).default(5000),

  HOST: z.string().default('0.0.0.0'),

  DATABASE_URL: z
    .string()
    .url('DATABASE_URL must be a valid PostgreSQL connection string'),

  JWT_ACCESS_SECRET: z
    .string()
    .min(
      32,
      'JWT_ACCESS_SECRET must be at least 32 characters long for security',
    ),

  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),

  JWT_REFRESH_SECRET: z
    .string()
    .min(
      32,
      'JWT_REFRESH_SECRET must be at least 32 characters long for security',
    ),

  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL'),
});

// ─── Validation ───────────────────────────────────────────────────────────────
// Parse process.env once at startup.
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Missing or invalid environment variables:');

  // Format the ZodError into a developer-friendly list.
  const fieldErrors = parsedEnv.error.flatten().fieldErrors;
  for (const [key, errors] of Object.entries(fieldErrors)) {
    console.error(`  - ${key}: ${errors?.join(', ')}`);
  }

  // Fail fast: Prevent the server from starting with invalid configuration.
  process.exit(1);
}

// ─── Export ───────────────────────────────────────────────────────────────────
// Export the validated, strongly-typed environment configuration object.
// Throughout the app, use `import { env } from './config/env'` instead of `process.env`.
export const env = parsedEnv.data;
