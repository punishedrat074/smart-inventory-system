// Load environment variables from .env before anything else.
// This must be the first import so all subsequent modules see process.env populated.
// In Task 09, this will be replaced by Zod-validated config (config/env.ts).
import 'dotenv/config';

import http from 'http';
import app from './app';

// ─── Configuration ────────────────────────────────────────────────────────────
const rawPort = parseInt(process.env['PORT'] ?? '5000', 10);

// Fail fast if PORT is set to a non-numeric value (e.g. PORT=abc).
// Zod-validated config (Task 09) will make this guard unnecessary, but for now
// this prevents a silent NaN that causes listen() to throw EINVAL at runtime.
if (isNaN(rawPort) || rawPort < 1 || rawPort > 65535) {
  console.error(`[server] Invalid PORT value: "${process.env['PORT']}". Must be a number between 1–65535.`);
  process.exit(1);
}

const PORT = rawPort;
const HOST = process.env['HOST'] ?? '0.0.0.0';
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

// ─── HTTP Server ──────────────────────────────────────────────────────────────
// Wrap the Express app in Node's built-in http.Server so we have a reference
// for graceful shutdown (server.close()) without relying on the return value
// of app.listen(), which is the same thing but less explicit.
const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`[server] Running in ${NODE_ENV} mode`);
  console.log(`[server] Listening on http://${HOST}:${PORT}`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
// When the process receives a termination signal (SIGTERM from Docker/Kubernetes
// or a process manager, SIGINT from Ctrl+C in the terminal), we:
//   1. Stop accepting new connections.
//   2. Wait for in-flight requests to finish.
//   3. Exit cleanly with code 0.
// Without this, abrupt process.exit() can drop active requests and leave
// database connections open.
const shutdown = (signal: string): void => {
  console.log(`\n[server] Received ${signal}. Shutting down gracefully...`);

  server.close(() => {
    console.log('[server] All connections closed. Process exiting.');
    process.exit(0);
  });

  // Safety net: force-exit after 10 seconds if connections don't close.
  // This prevents the process from hanging indefinitely on a stalled connection.
  setTimeout(() => {
    console.error('[server] Forceful shutdown after timeout.');
    process.exit(1);
  }, 10_000).unref(); // .unref() lets the event loop exit normally if this is the only timer.
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ─── Unhandled Errors ─────────────────────────────────────────────────────────
// Unhandled promise rejections (e.g., a forgotten await that throws) must not
// be swallowed silently. Log them and exit — a crashed server should fail loudly
// so monitoring/alerting can detect it. The alternative (ignoring them) leads to
// corruption bugs that are nearly impossible to reproduce.
process.on('unhandledRejection', (reason: unknown) => {
  console.error('[server] Unhandled promise rejection:', reason);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (error: Error) => {
  console.error('[server] Uncaught exception:', error);
  server.close(() => process.exit(1));
});
