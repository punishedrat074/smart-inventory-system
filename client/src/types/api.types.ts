/**
 * api.types.ts — Shared API response types
 *
 * Mirrors the server's response envelope defined in server/src/types/express.d.ts
 * and the standardised apiResponse utility (server/src/utils/apiResponse.util.ts).
 *
 * Every API call through the Axios client returns one of these shapes.
 * Generic parameter T represents the `data` payload for successful responses.
 */

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Response Envelope ────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    /** Zod validation error details or other structured error info */
    details?: unknown;
  };
}

/** Union type — every API response is either a success or an error. */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Convenience Error Type ───────────────────────────────────────────────────

/**
 * The shape thrown when the Axios response interceptor encounters an API error.
 * Catch this in components / TanStack Query callbacks to display error messages.
 */
export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

// ─── Paginated Result Helper ──────────────────────────────────────────────────

/**
 * Represents a paginated list response from the server.
 * T is the type of items in the list.
 *
 * Usage: ApiSuccessResponse<PaginatedResult<User>>
 */
export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
