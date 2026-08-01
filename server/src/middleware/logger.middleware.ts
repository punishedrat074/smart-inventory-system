import { type NextFunction, type Request, type Response } from 'express';

/**
 * Request Logger Middleware
 *
 * Logs the lifecycle of incoming HTTP requests.
 * Captures the HTTP method, URL path, response status code, and the total
 * duration of the request in milliseconds.
 *
 * Useful for debugging and monitoring performance during development.
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();

  // The 'finish' event fires when the response has been fully handed off to the OS.
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    // Log format: [METHOD] /path - STATUS - 123ms
    console.log(`[${method}] ${originalUrl} - ${statusCode} - ${duration}ms`);
  });

  next();
};
