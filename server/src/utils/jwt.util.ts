import jwt from 'jsonwebtoken';

import { env } from '../config/env';

// ─── Payload Types ────────────────────────────────────────────────────────────
// Define the exact shape of each token's payload.
// Keeping access and refresh payloads separate ensures a refresh token
// can never be misused as an access token (and vice versa).

export interface AccessTokenPayload {
  sub: string; // User ID (subject — standard JWT claim)
  role: string; // User role — used by authorization middleware to gate endpoints
}

export interface RefreshTokenPayload {
  sub: string; // User ID — used to look up the refresh token record in the DB
}

// ─── Access Tokens ────────────────────────────────────────────────────────────
// Short-lived (15 min). Sent in the Authorization: Bearer header on every API call.
// Does NOT get stored in the database — stateless by design.

/**
 * Sign a new access token for an authenticated user.
 *
 * @param payload - The data to embed in the token (user ID and role)
 * @returns A signed JWT string
 */
export const signAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verify and decode an access token.
 * Throws a `JsonWebTokenError` or `TokenExpiredError` if invalid or expired —
 * these are caught and handled by the `authenticate` middleware (Task 18).
 *
 * @param token - The raw JWT string from the Authorization header
 * @returns The decoded payload if valid
 */
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
};

// ─── Refresh Tokens ───────────────────────────────────────────────────────────
// Long-lived (7 days). Stored in an HttpOnly cookie (not accessible to JavaScript).
// A record of the hashed token is also stored in the database to enable revocation
// (logout from all devices, token rotation, and brute-force detection).

/**
 * Sign a new refresh token for an authenticated user.
 *
 * @param payload - The data to embed in the token (user ID only)
 * @returns A signed JWT string
 */
export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verify and decode a refresh token.
 * Throws a `JsonWebTokenError` or `TokenExpiredError` if invalid or expired.
 *
 * @param token - The raw JWT string from the HttpOnly cookie
 * @returns The decoded payload if valid
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
};
