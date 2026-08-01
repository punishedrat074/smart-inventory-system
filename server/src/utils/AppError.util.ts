/**
 * Custom application error class.
 * Allows throwing errors with a specific HTTP status code and optional details.
 * The global error handler will catch this and format it correctly.
 */
export class AppError extends Error {
  public statusCode: number;
  public details?: unknown;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // Operational errors are expected (e.g., invalid input, not found).

    // Capturing stack trace, excluding the constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }
}
