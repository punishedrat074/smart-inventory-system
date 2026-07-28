import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma';

// ─── Global Singleton ────────────────────────────────────────────────────────
//
// Problem: tsx watch (hot-reload during development) re-executes module code
// on every file save. Without this pattern, each hot-reload creates a new
// PrismaClient instance, which opens a new connection pool. PostgreSQL has
// a limited number of simultaneous connections — Neon's free tier allows ~100.
// After enough reloads, the connection pool is exhausted and queries start
// failing with "too many clients."
//
// Solution: Store the PrismaClient instance on `globalThis`. In Node.js,
// `globalThis` persists across module re-evaluations during hot-reload.
// The first reload creates the client; subsequent reloads reuse it.
//
// In production, there is no hot-reload, so this only runs once anyway.
// The `!== 'production'` guard prevents the global from persisting in
// environments where module caching is reliable (e.g., serverless cold starts).
//
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ─── Client Factory ──────────────────────────────────────────────────────────
//
// Prisma 7 requires a driver adapter — the client no longer reads the
// connection URL implicitly from schema.prisma. The adapter is explicit:
//   PrismaPg  → wraps the standard `pg` driver for PostgreSQL
//
// The factory is called at most once per process (singleton ensures this).
// Failing early with a clear message is better than a cryptic connection error
// deep inside a request handler.
//
// Log levels by environment:
//
//   'query'  — Logs every SQL statement Prisma executes.
//              Essential for catching N+1 query problems during development
//              (e.g., accidentally loading 50 products × 50 supplier queries).
//              NEVER use in production — queries can contain sensitive data
//              (email addresses, hashed passwords) and create log bloat.
//
//   'warn'   — Logs Prisma-level deprecation warnings and slow query hints.
//
//   'error'  — Logs database connection failures and fatal Prisma errors.
//              Always enabled in both environments.
//
function createPrismaClient(): PrismaClient {
  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. ' +
        'Copy server/.env.example to server/.env and fill in your Neon connection string.',
    );
  }

  // PrismaPg uses the `pg` driver under the hood, which manages an internal
  // connection pool. Pool configuration (size, timeouts) can be added here
  // in Task 07+ once connection behaviour under load is known.
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env['NODE_ENV'] === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

// ─── Singleton Export ─────────────────────────────────────────────────────────
//
// Import this in any module that needs to query the database:
//   import { prisma } from '../config/database';
//
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}
