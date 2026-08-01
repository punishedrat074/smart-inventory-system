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
