import { QueryClient } from '@tanstack/react-query';

import type { ApiError } from '@/types/api.types';

/**
 * queryClient.ts — Global TanStack Query Configuration
 *
 * Configures default options for queries and mutations across the application.
 *
 * Design Decisions:
 *   - staleTime (5 mins): Prevents redundant background network requests when
 *     components remount within a reasonable window.
 *   - gcTime / cacheTime (10 mins): Retains unused query data in memory for 10
 *     minutes before garbage collection.
 *   - refetchOnWindowFocus (false): Prevents unexpected refetching and UI jumps
 *     when switching browser tabs in a data-dense SaaS dashboard.
 *   - retry (smart handler): Retries network/5xx server errors up to 1 time.
 *     Disables retries for 4xx client errors (401, 403, 404, 422) where retrying
 *     without user action would produce identical failures.
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      retry: (failureCount, error) => {
        // Stop retrying after 1 attempt
        if (failureCount >= 1) return false;

        // Do not retry 4xx status codes (unauthorized, forbidden, not found, validation error)
        const apiError = error as Partial<ApiError>;
        if (
          apiError.status &&
          apiError.status >= 400 &&
          apiError.status < 500
        ) {
          return false;
        }

        return true;
      },
    },
    mutations: {
      retry: false, // Do not retry mutations automatically
    },
  },
});
