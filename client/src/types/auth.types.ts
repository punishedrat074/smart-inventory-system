/**
 * auth.types.ts — Shared authentication TypeScript declarations
 *
 * Defines the data contracts for user profiles, credentials, request payloads,
 * and authentication responses. Mirrors the backend schemas defined in
 * server/src/modules/auth/auth.schema.ts and auth.service.ts.
 */

// ─── User Roles ───────────────────────────────────────────────────────────────
export type UserRole = 'ADMIN' | 'EMPLOYEE';

// ─── Authenticated User Profile ───────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Request Payload Inputs ───────────────────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

// ─── Response Payload Shapes ──────────────────────────────────────────────────

/** Returned by POST /api/v1/auth/login and POST /api/v1/auth/register */
export interface AuthData {
  accessToken: string;
  user: AuthUser;
}

/** Returned by GET /api/v1/auth/me */
export interface MeData {
  user: AuthUser;
}

/** Returned by POST /api/v1/auth/refresh */
export interface RefreshData {
  accessToken: string;
}

/** Returned by PATCH /api/v1/auth/password */
export interface ChangePasswordData {
  message: string;
}
