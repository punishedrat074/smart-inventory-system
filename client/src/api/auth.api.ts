/**
 * auth.api.ts — Authentication API service module
 *
 * Provides dedicated wrapper methods around the Axios HTTP client (api/client.ts)
 * for all authentication endpoints exposed by the backend server.
 */

import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { ApiSuccessResponse } from '@/types/api.types';
import type {
  AuthData,
  ChangePasswordData,
  ChangePasswordInput,
  LoginInput,
  MeData,
  RefreshData,
  RegisterInput,
} from '@/types/auth.types';

/**
 * POST /api/v1/auth/login
 * Authenticates user credentials and returns user profile + access token.
 * Refresh token is set in an HttpOnly cookie by the server.
 */
export const loginApi = async (
  input: LoginInput,
): Promise<ApiSuccessResponse<AuthData>> => {
  return apiPost<AuthData>('/api/v1/auth/login', input);
};

/**
 * POST /api/v1/auth/register
 * Registers a new user account and returns user profile + access token.
 */
export const registerApi = async (
  input: RegisterInput,
): Promise<ApiSuccessResponse<AuthData>> => {
  return apiPost<AuthData>('/api/v1/auth/register', input);
};

/**
 * POST /api/v1/auth/logout
 * Invalidates the refresh token record on the server and clears the HttpOnly cookie.
 */
export const logoutApi = async (): Promise<
  ApiSuccessResponse<{ message: string }>
> => {
  return apiPost<{ message: string }>('/api/v1/auth/logout');
};

/**
 * GET /api/v1/auth/me
 * Retrieves the current authenticated user's profile using the access token.
 */
export const getMeApi = async (): Promise<ApiSuccessResponse<MeData>> => {
  return apiGet<MeData>('/api/v1/auth/me');
};

/**
 * POST /api/v1/auth/refresh
 * Obtains a new access token using the HttpOnly refresh cookie.
 */
export const refreshApi = async (): Promise<
  ApiSuccessResponse<RefreshData>
> => {
  return apiPost<RefreshData>('/api/v1/auth/refresh');
};

/**
 * PATCH /api/v1/auth/password
 * Updates the authenticated user's password.
 */
export const changePasswordApi = async (
  input: ChangePasswordInput,
): Promise<ApiSuccessResponse<ChangePasswordData>> => {
  return apiPatch<ChangePasswordData>('/api/v1/auth/password', input);
};
