import { type NextFunction, type Request, type Response } from 'express';

import { sendSuccess } from '../../utils/apiResponse.util';
import {
  type ChangePasswordInput,
  type LoginInput,
  type RegisterInput,
} from './auth.schema';
import * as authService from './auth.service';

// ─── Cookie Config ────────────────────────────────────────────────────────────
// Cookie name used consistently across set/clear operations.
const REFRESH_COOKIE = 'refresh_token';

// 7 days in milliseconds — mirrors JWT_REFRESH_EXPIRES_IN from env
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Helper: set the HttpOnly refresh token cookie on the response.
 * Encapsulated here so every handler (register, login, refresh) uses
 * identical, secure cookie settings.
 */
const setRefreshCookie = (res: Response, token: string): void => {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true, // JS cannot read this cookie
    secure: process.env['NODE_ENV'] === 'production', // HTTPS only in production
    sameSite: 'strict', // No cross-site cookie sending
    maxAge: COOKIE_MAX_AGE_MS,
  });
};

/**
 * Helper: clear the refresh token cookie (used on logout).
 */
const clearRefreshCookie = (res: Response): void => {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'strict',
  });
};

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/register
 * Creates a new user account and returns an access token + refresh cookie.
 */
export const registerHandler = async (
  req: Request<object, object, RegisterInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { accessToken, refreshToken, user } = await authService.register(
      req.body,
    );
    setRefreshCookie(res, refreshToken);
    sendSuccess(
      res,
      {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      201,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/login
 * Authenticates a user and returns an access token + refresh cookie.
 */
export const loginHandler = async (
  req: Request<object, object, LoginInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(
      req.body,
    );
    setRefreshCookie(res, refreshToken);
    sendSuccess(res, {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/refresh
 * Issues a new access token using the refresh token from the cookie.
 */
export const refreshHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rawRefreshToken = req.cookies[REFRESH_COOKIE] as string | undefined;
    if (!rawRefreshToken) {
      res.status(401).json({
        success: false,
        error: { message: 'No refresh token provided' },
      });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refresh(rawRefreshToken);

    setRefreshCookie(res, newRefreshToken);
    sendSuccess(res, { accessToken });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/logout
 * Clears the refresh token cookie and deletes the record from the database.
 */
export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rawRefreshToken = req.cookies[REFRESH_COOKIE] as string | undefined;

    if (rawRefreshToken) {
      await authService.logout(rawRefreshToken);
    }

    clearRefreshCookie(res);
    sendSuccess(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/auth/me
 * Returns the profile of the currently authenticated user.
 * Protected: requires a valid access token (Task 18 middleware will populate req.user).
 * Placeholder until Task 18 adds the authenticate middleware.
 */
export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // req.user will be populated by the authenticate middleware (Task 18).
    // For now, we read the user ID from the Authorization header directly so
    // the route exists and can be verified before Task 18 is built.
    const userId = (req as Request & { user?: { id: string } }).user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }
    const user = await authService.getMe(userId);
    sendSuccess(res, { user });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/auth/password
 * Changes the current user's password and invalidates all other sessions.
 * Protected: requires a valid access token (Task 18 middleware will populate req.user).
 */
export const changePasswordHandler = async (
  req: Request<object, object, ChangePasswordInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as Request & { user?: { id: string } }).user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }
    await authService.changePassword(userId, req.body);
    clearRefreshCookie(res);
    sendSuccess(res, {
      message: 'Password changed successfully. Please log in again.',
    });
  } catch (err) {
    next(err);
  }
};
