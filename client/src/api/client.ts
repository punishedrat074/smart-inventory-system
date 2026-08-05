/**
 * client.ts — Axios HTTP client
 *
 * The single HTTP gateway for the entire frontend. All API calls go through
 * this instance — never use fetch() directly in feature code.
 *
 * Responsibilities:
 *   1. Attach the base URL from VITE_API_URL (falls back to /api for dev proxy)
 *   2. Inject the JWT access token into every outgoing request
 *   3. Intercept 401 responses, refresh the token once, and retry the request
 *   4. Log out the user if the refresh also fails
 *   5. Normalise all error responses into a consistent ApiError shape
 *
 * Token security model:
 *   - Access token: stored in module memory (never localStorage/sessionStorage)
 *     Memory storage is immune to XSS attacks that can steal localStorage values.
 *   - Refresh token: stored in an HttpOnly cookie by the server.
 *     The browser sends it automatically — this code never reads it.
 */

import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api.types';

// ─── Access Token Store ───────────────────────────────────────────────────────
// Module-level variable. Survives page navigation but resets on hard refresh,
// which forces a re-authentication — acceptable and intentional behaviour.

let accessToken: string | null = null;

/** Called by the auth store after a successful login or token refresh. */
export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

/** Returns the current in-memory access token (read-only). */
export const getAccessToken = (): string | null => accessToken;

// ─── Axios Instance ───────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  // In development, Vite's proxy (vite.config.ts) forwards /api/* to port 5000.
  // VITE_API_URL is empty-string falsy in dev so we use the relative /api path.
  // In production, VITE_API_URL points to the deployed API domain.
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true, // Sends the HttpOnly refresh-token cookie on every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Runs before every request leaves the browser.

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ─── Response Interceptor — 401 Token Refresh ─────────────────────────────────
// Runs after every response is received.
//
// Strategy:
//   1. If the response is not 401, pass it through unchanged.
//   2. If it IS 401 and we haven't already tried to refresh, call /auth/refresh.
//   3. If the refresh succeeds: store the new token and retry ALL queued requests.
//   4. If the refresh fails: clear the token and dispatch a logout event so the
//      auth store can redirect to login without a circular import.

/** Prevent multiple simultaneous refresh calls (thundering herd protection). */
let isRefreshing = false;

/** Queue of { resolve, reject } callbacks for requests that arrived during refresh. */
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

/** Resolve all queued requests with the new access token. */
const processQueue = (err: unknown, token: string | null): void => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (err || !token) {
      reject(err);
    } else {
      resolve(token);
    }
  });
  refreshQueue = [];
};

apiClient.interceptors.response.use(
  // Pass-through all successful responses unchanged.
  (response: AxiosResponse) => response,

  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retried?: boolean;
    };

    // Only attempt refresh for 401 errors that haven't been retried yet.
    // Skip refresh if the failing request IS the refresh call itself.
    const is401 = error.response?.status === 401;
    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh');
    const alreadyRetried = originalRequest._retried === true;

    if (!is401 || isRefreshEndpoint || alreadyRetried) {
      return Promise.reject(normaliseError(error));
    }

    if (isRefreshing) {
      // Another request is already refreshing. Queue this one to be retried
      // once the refresh completes, rather than firing a second refresh.
      return new Promise<AxiosResponse>((resolve, reject) => {
        refreshQueue.push({
          resolve: (newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    // Mark as refreshing and prevent future queued requests from re-entering.
    isRefreshing = true;
    originalRequest._retried = true;

    try {
      const response = await apiClient.post<
        ApiSuccessResponse<{ accessToken: string }>
      >('/api/v1/auth/refresh');

      const newToken = response.data.data.accessToken;
      setAccessToken(newToken);
      processQueue(null, newToken);

      // Retry the original failed request with the new token.
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed — clear token and signal the app to log out.
      setAccessToken(null);
      processQueue(refreshError, null);

      // Dispatch a custom DOM event so the auth store (Task 25) can listen
      // and redirect to login without requiring a direct import here.
      window.dispatchEvent(new CustomEvent('auth:logout'));

      return Promise.reject(
        normaliseError(refreshError as AxiosError<ApiErrorResponse>),
      );
    } finally {
      isRefreshing = false;
    }
  },
);

// ─── Error Normalisation ──────────────────────────────────────────────────────

/**
 * Extracts a consistent { message, status, details } shape from any Axios error.
 * Callers (TanStack Query, components) catch this shape — never raw AxiosError.
 */
function normaliseError(error: AxiosError<ApiErrorResponse>): {
  message: string;
  status: number;
  details?: unknown;
} {
  const status = error.response?.status ?? 0;
  const apiMessage = error.response?.data?.error?.message;
  const details = error.response?.data?.error?.details;

  const message =
    apiMessage ??
    error.message ??
    'An unexpected error occurred. Please try again.';

  return { message, status, details };
}

export default apiClient;

// ─── Typed Helper Functions ───────────────────────────────────────────────────
// Thin wrappers that return the unwrapped `data` field, removing the need to
// write `.data.data` in every calling function.

export const apiGet = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiSuccessResponse<T>> => {
  const res = await apiClient.get<ApiSuccessResponse<T>>(url, config);
  return res.data;
};

export const apiPost = async <T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<ApiSuccessResponse<T>> => {
  const res = await apiClient.post<ApiSuccessResponse<T>>(url, body, config);
  return res.data;
};

export const apiPatch = async <T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<ApiSuccessResponse<T>> => {
  const res = await apiClient.patch<ApiSuccessResponse<T>>(url, body, config);
  return res.data;
};

export const apiDelete = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiSuccessResponse<T>> => {
  const res = await apiClient.delete<ApiSuccessResponse<T>>(url, config);
  return res.data;
};
