import { type NextFunction, type Request, type Response } from 'express';
import { ZodError, type ZodSchema } from 'zod';

/**
 * Type representing supported Zod schemas for request validation.
 * Can be a standard Zod object schema or a Zod effect (e.g., schema with .refine()).
 */
type ValidationSchema = ZodSchema;

/**
 * Validation Middleware Factory
 *
 * Accepts a Zod schema to validate incoming `req.body`, `req.query`, and/or `req.params`.
 * If validation succeeds, sanitized/coerced data is assigned back to `req` and execution continues to `next()`.
 * If validation fails, the `ZodError` is caught and passed to `next(err)`, where our global error
 * middleware (`error.middleware.ts`) formats it into a standardized 400 Bad Request response.
 *
 * @param schema - Zod schema defining the expected shape of body, query, or params
 *
 * @example
 * const createUserSchema = z.object({
 *   body: z.object({
 *     email: z.string().email(),
 *     password: z.string().min(8),
 *   }),
 * });
 *
 * router.post('/users', validate(createUserSchema), userController.create);
 */
export const validate =
  (schema: ValidationSchema) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // Parse body, query, and params through the schema
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as {
        body?: unknown;
        query?: Record<string, unknown>;
        params?: Record<string, unknown>;
      };

      // Replace req objects with validated & coerced values if present in parsed result
      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }
      if (parsed.query !== undefined) {
        req.query = parsed.query as typeof req.query;
      }
      if (parsed.params !== undefined) {
        req.params = parsed.params as typeof req.params;
      }

      next();
    } catch (error) {
      // Forward ZodError (or any unexpected validation error) to global error handler
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(error);
      }
    }
  };
