import { type NextFunction, type Request, type Response } from 'express';

import { AppError } from '../utils/AppError.util';

/**
 * RBAC (Role-Based Access Control) Middleware Factory
 *
 * Returns a middleware that allows only users whose role is in the
 * `allowedRoles` list to proceed. Must be used AFTER the `authenticate`
 * middleware (which populates `req.user`).
 *
 * Usage:
 *   router.get('/admin-only', authenticate, rbac(['ADMIN']), controller);
 *   router.post('/shared',    authenticate, rbac(['ADMIN', 'EMPLOYEE']), controller);
 *
 * @param allowedRoles - Array of role strings that are permitted to access the route
 */
export const rbac = (allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // req.user is guaranteed to exist if authenticate ran before this middleware.
    // The guard below protects against programmer error (e.g. using rbac without authenticate).
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. This action requires one of the following roles: ${allowedRoles.join(', ')}.`,
          403,
        ),
      );
    }

    next();
  };
};
