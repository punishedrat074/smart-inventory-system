// ─── Prisma CLI Configuration ─────────────────────────────────────────────────
//
// This file configures Prisma CLI commands (migrate, generate, studio, db push).
// It is NOT imported at runtime — it is only read by the Prisma CLI.
//
// Prisma 7 change: The database connection URL moved here from schema.prisma.
//
//   prisma.config.ts  → used by: prisma migrate, prisma generate, prisma studio
//   process.env       → used by: PrismaClient at runtime (via server/.env)
//
// Docs: https://www.prisma.io/docs/orm/reference/prisma-config-reference
// ─────────────────────────────────────────────────────────────────────────────

import 'dotenv/config';

import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Path to the Prisma schema file (relative to this config file).
  schema: 'prisma/schema.prisma',

  migrations: {
    // Directory where migration files are stored and read from.
    path: 'prisma/migrations',

    // Command to run when `prisma db seed` is called (Task 08).
    // tsx is used to run TypeScript seed files without a separate compile step.
    seed: 'tsx prisma/seed.ts',
  },

  // Database connection URL for CLI commands.
  // ⚠️  Never commit real credentials here. This reads from the environment.
  // ⚠️  The .env file is gitignored — see .env.example for the required format.
  datasource: {
    url: env('DATABASE_URL'),
  },
});
