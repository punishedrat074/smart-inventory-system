// ─── Environment Configuration ──────────────────────────────────────────────────
// Load and validate all environment variables before doing anything else.
// If any required variables are missing or invalid, this will log the errors
// and exit the process immediately (fail fast).
import http from 'http';

import app from './app';
import { env } from './config/env';

// ─── HTTP Server ──────────────────────────────────────────────────────────────
// Wrap the Express app in Node's built-in http.Server so we have a reference
// for graceful shutdown (server.close()) without relying on the return value
// of app.listen(), which is the same thing but less explicit.
const server = http.createServer(app);

server.listen(env.PORT, env.HOST, () => {
  console.log(`[server] Running in ${env.NODE_ENV} mode`);
  console.log(`[server] Listening on http://${env.HOST}:${env.PORT}`);
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
