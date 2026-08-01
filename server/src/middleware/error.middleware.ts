import { type NextFunction, type Request, type Response } from 'express';
import { ZodError, type ZodIssue } from 'zod';

import { Prisma } from '../generated/prisma';
import { sendError } from '../utils/apiResponse.util';
import { AppError } from '../utils/AppError.util';

/**
 * 404 Not Found Middleware
 * Catch-all for requests that don't match any defined routes.
 * Converts it to an AppError and passes it down to the global error handler.
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const error = new AppError(
    `Can't find ${req.method} ${req.originalUrl} on this server`,
    404,
  );
  next(error);
};

/**
 * Global Error Handler Middleware
 * Intercepts all errors thrown in the application and formats them into
 * a standardized JSON response using the sendError utility.
 *
 * Note: Express recognizes error handlers by their 4 arguments (err, req, res, next).
 */
export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // 1. AppError (Custom operational errors thrown by controllers)
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.details);
    return;
  }

  // 2. ZodError (Validation errors from request payloads)
  if (err instanceof ZodError) {
    const zodErr = err as unknown as { errors: ZodIssue[] };
    const formattedErrors = zodErr.errors.map((e: ZodIssue) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'Validation failed', 400, formattedErrors);
    return;
  }

  // 3. Prisma Errors (Database errors)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint failed
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      sendError(
        res,
        `Duplicate value for ${target}. Please use another value.`,
        409,
      );
      return;
    }

    // P2025: Record to update or delete not found
    if (err.code === 'P2025') {
      sendError(res, 'Record not found.', 404);
      return;
    }

    // Generic fallback for other known Prisma errors
    sendError(res, 'Database request error.', 400);
    return;
  }

  // 4. Unhandled/Unknown Errors (Programming bugs or unknown database issues)
  // Log the full error to the console for the developer/monitoring tools
  console.error('❌ UNHANDLED ERROR 💥', err);

  // Send a safe, generic message to the client to avoid leaking sensitive data or stack traces
  sendError(res, 'Internal Server Error', 500);
};
