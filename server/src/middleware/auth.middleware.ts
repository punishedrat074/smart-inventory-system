import { type NextFunction, type Request, type Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { AppError } from '../utils/AppError.util';
import { verifyAccessToken } from '../utils/jwt.util';

/**
 * Authenticate Middleware
 *
 * Reads the JWT from the `Authorization: Bearer <token>` header,
 * verifies it using the access token secret, and attaches the decoded
 * payload to `req.user` so downstream controllers can access the user's
 * ID and role without re-querying the database.
 *
 * On failure, passes an AppError to the global error handler:
 *   - Missing token  → 401
 *   - Expired token  → 401 (with a specific message to prompt client refresh)
 *   - Invalid token  → 401
 *
 * Usage:
 *   router.get('/protected', authenticate, controller);
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  // Expect the header to be in the format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new AppError(
        'Authentication required. Please provide a valid access token.',
        401,
      ),
    );
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    const payload = verifyAccessToken(token);

    // Attach the decoded user identity to the request object.
    // Controllers can now access req.user.id and req.user.role directly.
    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return next(
        new AppError(
          'Access token has expired. Please refresh your session.',
          401,
        ),
      );
    }
    if (err instanceof JsonWebTokenError) {
      return next(new AppError('Invalid access token.', 401));
    }
    // Forward any unexpected error (e.g., algorithm mismatch)
    next(err);
  }
};
