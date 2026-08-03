export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    details?: unknown; // For Zod validation errors, etc.
  };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// ─── Authenticated Request User ───────────────────────────────────────────────
// Augment the Express Request interface so req.user is available in every
// protected controller without casting. Populated by auth.middleware.ts.
export interface AuthUser {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
