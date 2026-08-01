import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Application, Request, Response } from 'express';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { env } from './config/env';
import { requestLogger } from './middleware/logger.middleware';

const app: Application = express();

// ─── Security & Logging Middleware ────────────────────────────────────────────
// Helmet sets secure HTTP headers to protect against common web vulnerabilities.
app.use(helmet());

// CORS enables cross-origin requests from our trusted frontend domain.
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true, // Crucial for receiving HttpOnly cookies containing refresh tokens
  }),
);

// Log all incoming requests for debugging and monitoring.
app.use(requestLogger);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Protect /api routes from brute-force and basic DoS attacks.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  },
});

app.use('/api', apiLimiter);

// ─── Core Middleware ──────────────────────────────────────────────────────────
// Parse incoming requests with JSON payloads.
app.use(express.json());

// Parse URL-encoded bodies (e.g., standard HTML forms).
app.use(express.urlencoded({ extended: false }));

// Parse Cookie headers into req.cookies. Required for session management.
app.use(cookieParser());

import { sendSuccess } from './utils/apiResponse.util';

// ─── Routes ───────────────────────────────────────────────────────────────────
// Temporary root route — confirms the API is reachable.
// This will be replaced/complemented by versioned routers (e.g., /api/v1/...).
app.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, {
    message: 'Smart Inventory Management System API',
    version: '1.0.0',
    docs: '/api/v1',
  });
});

export default app;
