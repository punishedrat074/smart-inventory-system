import express from 'express';
import type { Application, Request, Response } from 'express';

const app: Application = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────
// Parse incoming requests with JSON payloads.
// Required for all REST API endpoints that receive a body.
app.use(express.json());

// Parse URL-encoded bodies (e.g. HTML form submissions).
// `extended: false` uses the built-in querystring library — sufficient for our needs.
app.use(express.urlencoded({ extended: false }));

// ─── Routes ───────────────────────────────────────────────────────────────────
// Temporary root route — confirms the API is reachable before any modules exist.
// This will be replaced by the versioned router (/api/v1/...) as modules are built
// in Tasks 10–50. Do not add business logic here.
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Smart Inventory Management System API',
    version: '1.0.0',
    docs: '/api/v1',
  });
});

export default app;
