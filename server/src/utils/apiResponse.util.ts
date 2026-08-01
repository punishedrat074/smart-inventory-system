import { type Response } from 'express';

import {
  type ErrorResponse,
  type PaginationMeta,
  type SuccessResponse,
} from '../types/express';

/**
 * Send a standardized success JSON response.
 *
 * @param res - Express Response object
 * @param data - The payload to send
 * @param statusCode - HTTP status code (default: 200)
 * @param meta - Optional pagination metadata
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: PaginationMeta,
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  res.status(statusCode).json(response);
};

/**
 * Send a standardized error JSON response.
 *
 * @param res - Express Response object
 * @param message - User-friendly error message
 * @param statusCode - HTTP status code (default: 500)
 * @param details - Optional error details (e.g., Zod validation array, stack trace)
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  details?: unknown,
): void => {
  const response: ErrorResponse = {
    success: false,
    error: {
      message,
    },
  };

  if (details) {
    response.error.details = details;
  }

  res.status(statusCode).json(response);
};
