/**
 * constants.ts — Shared application-level constants
 *
 * Centralises all magic strings and numbers used across the application.
 * Import from '@/utils' to access these values.
 *
 * Sections:
 *   - API routes
 *   - Pagination defaults
 *   - Stock thresholds
 *   - Product status labels and styles
 *   - Role labels
 *   - Date/time formats
 */

// ─── API Routes ───────────────────────────────────────────────────────────────

/** Base prefix for all API endpoints (matches server mount path) */
export const API_BASE = '/api/v1';

export const API_ROUTES = {
  auth: {
    login: `${API_BASE}/auth/login`,
    register: `${API_BASE}/auth/register`,
    logout: `${API_BASE}/auth/logout`,
    refresh: `${API_BASE}/auth/refresh`,
    me: `${API_BASE}/auth/me`,
    password: `${API_BASE}/auth/password`,
  },
  users: `${API_BASE}/users`,
  categories: `${API_BASE}/categories`,
  products: `${API_BASE}/products`,
  suppliers: `${API_BASE}/suppliers`,
  purchases: `${API_BASE}/purchases`,
  sales: `${API_BASE}/sales`,
  dashboard: `${API_BASE}/dashboard`,
  activity: `${API_BASE}/activity`,
} as const;

// ─── Pagination ───────────────────────────────────────────────────────────────

/** Default number of rows shown per page across all DataTable instances */
export const DEFAULT_PAGE_SIZE = 10;

/** Available page size options in the Pagination component dropdown */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

// ─── Stock Thresholds ─────────────────────────────────────────────────────────

/** Products at or below this quantity are flagged as LOW_STOCK */
export const LOW_STOCK_THRESHOLD = 10;

/** Products at this quantity are flagged as OUT_OF_STOCK */
export const OUT_OF_STOCK_THRESHOLD = 0;

// ─── Product Status ───────────────────────────────────────────────────────────

export type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

/** Human-readable labels for product stock status values */
export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
} as const;

/**
 * Tailwind class sets for product status badge styling.
 * Use with the shadcn Badge component.
 */
export const PRODUCT_STATUS_STYLES: Record<ProductStatus, string> = {
  IN_STOCK: 'bg-success/15 text-success border-success/30',
  LOW_STOCK: 'bg-warning/15 text-warning border-warning/30',
  OUT_OF_STOCK: 'bg-destructive/15 text-destructive border-destructive/30',
} as const;

// ─── User Roles ───────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'EMPLOYEE';

/** Human-readable labels for user role values */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrator',
  EMPLOYEE: 'Employee',
} as const;

// ─── Navigation Routes ────────────────────────────────────────────────────────

/** Canonical app route paths — keeps navigation consistent and refactor-safe */
export const ROUTES = {
  dashboard: '/dashboard',
  inventory: '/inventory',
  categories: '/categories',
  suppliers: '/suppliers',
  purchases: '/purchases',
  sales: '/sales',
  activity: '/activity',
  users: '/users',
  settings: '/settings',
  login: '/login',
  register: '/register',
} as const;

// ─── Query Keys ───────────────────────────────────────────────────────────────

/**
 * TanStack Query key factories.
 * Using factory functions guarantees key uniqueness and enables
 * fine-grained cache invalidation (e.g. invalidate only one product's key).
 *
 * @example
 *   queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all })
 *   queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.detail('abc') })
 */
export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
    salesTrend: ['dashboard', 'sales-trend'] as const,
    topProducts: ['dashboard', 'top-products'] as const,
    categoryBreakdown: ['dashboard', 'category-breakdown'] as const,
  },
  products: {
    all: ['products'] as const,
    list: (params: Record<string, unknown>) =>
      ['products', 'list', params] as const,
    detail: (id: string) => ['products', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    detail: (id: string) => ['categories', id] as const,
  },
  suppliers: {
    all: ['suppliers'] as const,
    list: (params: Record<string, unknown>) =>
      ['suppliers', 'list', params] as const,
    detail: (id: string) => ['suppliers', id] as const,
  },
  purchases: {
    all: ['purchases'] as const,
    list: (params: Record<string, unknown>) =>
      ['purchases', 'list', params] as const,
    detail: (id: string) => ['purchases', id] as const,
  },
  sales: {
    all: ['sales'] as const,
    list: (params: Record<string, unknown>) =>
      ['sales', 'list', params] as const,
    detail: (id: string) => ['sales', id] as const,
  },
  users: {
    all: ['users'] as const,
    list: (params: Record<string, unknown>) =>
      ['users', 'list', params] as const,
    detail: (id: string) => ['users', id] as const,
  },
  activity: {
    all: ['activity'] as const,
    list: (params: Record<string, unknown>) =>
      ['activity', 'list', params] as const,
  },
} as const;
