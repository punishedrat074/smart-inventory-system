import crypto from 'crypto';

import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError.util';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt.util';
import { comparePassword, hashPassword } from '../../utils/password.util';
import {
  type ChangePasswordInput,
  type LoginInput,
  type RegisterInput,
} from './auth.schema';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Hash a raw JWT string using SHA-256.
 * We store this hash — not the raw token — in the database.
 * If the database is ever exposed, hashed tokens cannot be replayed.
 */
const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Build the expiry Date for a refresh token.
 * Mirrors JWT_REFRESH_EXPIRES_IN ('7d') but expressed as a JS Date
 * so Prisma can store it in the `expiresAt` column.
 */
const refreshTokenExpiresAt = (): Date => {
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + SEVEN_DAYS_MS);
};

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * Hashes the password before storing. Returns a fresh access + refresh token pair.
 */
export const register = async (input: RegisterInput) => {
  // Prevent duplicate accounts (email is unique in the DB, but we give a cleaner error)
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    },
  });

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshTokenExpiresAt(),
    },
  });

  return { accessToken, refreshToken, user };
};

/**
 * Login an existing user.
 * Returns a fresh access + refresh token pair on success.
 */
export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // Use a constant-time comparison path for missing users to prevent user enumeration attacks.
  // We still run comparePassword even when user is null (compare against a dummy hash) so the
  // response time is the same whether or not the email exists.
  const DUMMY_HASH =
    '$2b$12$invalidhashinvalidhashinvalidhashinvalidhashinvalidhashi';
  const isMatch = await comparePassword(
    input.password,
    user?.passwordHash ?? DUMMY_HASH,
  );

  if (!user || !isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError(
      'Your account has been deactivated. Please contact an administrator.',
      403,
    );
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshTokenExpiresAt(),
    },
  });

  return { accessToken, refreshToken, user };
};

/**
 * Refresh an access token using a valid refresh token cookie.
 * Implements token rotation: the old refresh token is deleted, a new one is issued.
 * This limits the damage window if a refresh token is stolen.
 */
export const refresh = async (rawRefreshToken: string) => {
  // 1. Verify the JWT signature and expiry
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // 2. Check the DB to confirm this specific token hasn't been revoked/rotated
  const tokenHash = hashToken(rawRefreshToken);
  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new AppError(
      'Refresh token not found or expired. Please log in again.',
      401,
    );
  }

  // 3. Load the user — they might have been deactivated since the token was issued
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) {
    throw new AppError('User not found or deactivated', 401);
  }

  // 4. Rotate: delete old token record, issue new pair (deleteMany avoids throwing on concurrent calls)
  await prisma.refreshToken.deleteMany({ where: { tokenHash } });

  const newAccessToken = signAccessToken({ sub: user.id, role: user.role });
  const newRefreshToken = signRefreshToken({ sub: user.id });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: refreshTokenExpiresAt(),
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

/**
 * Logout: delete the refresh token record from the database.
 * The access token will expire on its own within 15 minutes (stateless — cannot be revoked).
 * Silently succeeds even if the token is not in the DB (already expired or logged out).
 */
export const logout = async (rawRefreshToken: string) => {
  const tokenHash = hashToken(rawRefreshToken);
  // deleteMany instead of delete to avoid throwing if the token doesn't exist
  await prisma.refreshToken.deleteMany({ where: { tokenHash } });
};

/**
 * Get the current authenticated user's profile (used by GET /me).
 * Excludes the passwordHash from the response.
 */
export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

/**
 * Change password for the currently authenticated user.
 * Validates the current password before applying the new one.
 */
export const changePassword = async (
  userId: string,
  input: ChangePasswordInput,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isMatch = await comparePassword(
    input.currentPassword,
    user.passwordHash,
  );
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  const newHash = await hashPassword(input.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  // Invalidate all existing refresh tokens so other sessions are logged out
  await prisma.refreshToken.deleteMany({ where: { userId } });
};
