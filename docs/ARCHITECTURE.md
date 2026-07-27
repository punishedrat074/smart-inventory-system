# SIMS — Architecture Reference

> **Version:** 1.2
> **Last Updated:** Task 05 (Environment configuration and PostgreSQL setup)
> **Maintainer:** Update this document after every task that changes architecture, adds a new pattern, or introduces a new dependency.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Backend Architecture](#2-backend-architecture)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Request Flow](#5-request-flow)
6. [Authentication Flow (Planned)](#6-authentication-flow-planned)
7. [Database Layer (Planned)](#7-database-layer-planned)
8. [Project Conventions](#8-project-conventions)

---

## 1. System Overview

SIMS is a full-stack monorepo composed of two independent packages — `client` (React frontend) and `server` (Express backend) — managed by **npm workspaces** from a shared root.

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (port 5173)                 │
│              Vite Dev Server / Production CDN           │
│                                                         │
│   React 18 · TypeScript · Tailwind · shadcn/ui          │
│   TanStack Query · Zustand · React Router               │
└───────────────────────┬─────────────────────────────────┘
                        │  HTTP /api/v1/*
                        │  (dev: proxied by Vite)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                Express Server (port 5000)               │
│                                                         │
│   Node.js · TypeScript · Express · Prisma              │
│   JWT Auth · Zod Validation · Winston Logging          │
└───────────────────────┬─────────────────────────────────┘
                        │  Prisma Client
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                  │
│                                                         │
│   Local (dev) · Neon / Supabase (production)           │
└─────────────────────────────────────────────────────────┘
```

### Ports

| Service         | Port   | Notes                                    |
| --------------- | ------ | ---------------------------------------- |
| Vite dev server | `5173` | Client — only runs in development        |
| Express API     | `5000` | Server — runs in both dev and production |
| PostgreSQL      | `5432` | Database — local or cloud                |

### Monorepo Root

The root `package.json` defines npm workspaces and orchestration scripts. It contains no application code.

```
package.json          ← npm workspaces root
├── client/           ← @sims/client  (React frontend)
└── server/           ← @sims/server  (Express backend)
```

---

## 2. Backend Architecture

### 2.1 Entry Point Separation

The server is split into two files — a deliberate architectural decision:

```
server/src/
├── server.ts    ← Process layer: binds port, handles OS signals
└── app.ts       ← Application layer: Express setup, middleware, routes
```

**`app.ts`** creates and exports the Express `Application` object. It:

- Has no side effects (no network binding, no file I/O)
- Can be `import`ed in integration tests without starting a real server
- Registers all middleware and routes

**`server.ts`** is the only file that touches the OS:

- Calls `app.listen()` to bind to the configured port
- Handles `SIGTERM` and `SIGINT` for graceful shutdown
- Catches `unhandledRejection` and `uncaughtException` — fails loudly, never silently

### 2.2 Feature-Based Module Architecture

All business logic is organized into **domain modules**. Each module owns exactly four files:

```
server/src/modules/
└── products/
    ├── products.controller.ts   ← HTTP layer: parse request, call service, send response
    ├── products.service.ts      ← Business logic: validates, transforms, calls Prisma
    ├── products.routes.ts       ← Route registration: mount paths, apply middleware
    └── products.schema.ts       ← Zod schemas: request body/query/params validation
```

**The controller → service → Prisma chain is strict:**

- **Controllers** are thin. They parse the request, call the service, and send the response. Zero business logic.
- **Services** own all logic. They validate business rules, call Prisma, and throw typed errors. They know nothing about HTTP.
- **Routes** wire controllers to URL paths and apply middleware (auth, RBAC, validation) in the correct order.
- **Schemas** define Zod shapes for input validation. Shared with the route to validate before the controller runs.

This separation means: services can be tested without HTTP, controllers can be tested without a database.

### 2.3 Middleware Stack (Planned — Task 10)

Middleware is applied in this order in `app.ts`:

```
Request
  │
  ▼
[1] Helmet          — Security headers (X-Frame-Options, CSP, etc.)
  ▼
[2] CORS            — Allow requests from CLIENT_URL only
  ▼
[3] Rate Limiter    — Prevent brute-force and DoS on /api routes
  ▼
[4] cookie-parser   — Parse HTTP-only refresh token cookie
  ▼
[5] express.json()  — Parse JSON request bodies
  ▼
[6] Logger          — Log method, path, status, duration (Winston/Pino)
  ▼
[7] Routes          — /api/v1/* module routers
  ▼
[8] 404 Handler     — Catch unmatched routes
  ▼
[9] Error Handler   — Global error middleware (Prisma, Zod, AppError)
  ▼
Response
```

### 2.4 Error Handling Strategy

All errors bubble up to a single global error middleware. Four error classes are handled:

| Error Type                      | Status | Example                                               |
| ------------------------------- | ------ | ----------------------------------------------------- |
| `ZodError`                      | 400    | Missing required field, invalid email                 |
| `AppError`                      | varies | "Product not found" (404), "Insufficient stock" (422) |
| `PrismaClientKnownRequestError` | varies | Unique constraint violation (409)                     |
| Unknown                         | 500    | Unhandled exceptions — message hidden from client     |

### 2.5 API Response Envelope

All responses use a consistent JSON shape:

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": {            // pagination only
    "page": 1,
    "pageSize": 20,
    "total": 142,
    "totalPages": 8
  }
}

// Error
{
  "success": false,
  "error": {
    "message": "Product not found",
    "code": "PRODUCT_NOT_FOUND",
    "details": [ ... ]  // Zod field errors, if applicable
  }
}
```

### 2.6 TypeScript Configuration

- **Target:** ES2022 / CommonJS — standard for Node.js servers
- **Strict:** true + `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`
- **Dev runtime:** `tsx watch` (esbuild-based, instant restarts)
- **Production:** `tsc` → `node dist/server.js`
- **Type checking:** `npm run typecheck --workspace=server` (runs `tsc --noEmit`)

---

## 3. Frontend Architecture

### 3.1 Technology Stack

| Concern           | Library                  | Task       |
| ----------------- | ------------------------ | ---------- |
| UI framework      | React 18                 | Task 03 ✅ |
| Build tool        | Vite                     | Task 03 ✅ |
| Styling           | Tailwind CSS             | Task 21    |
| Component library | shadcn/ui                | Task 22    |
| HTTP client       | Axios                    | Task 23    |
| Server state      | TanStack Query           | Task 24    |
| Client state      | Zustand                  | Task 25    |
| Routing           | React Router v6          | Task 27    |
| Forms             | React Hook Form + Zod    | Task 26+   |
| Charts            | Recharts                 | Task 35    |
| Animation         | Framer Motion (optional) | Task 28+   |

### 3.2 Component Hierarchy

```
main.tsx
└── <React.StrictMode>
    └── App.tsx
        └── <QueryClientProvider>           (Task 24)
            └── <ToastProvider>             (Task 24)
                └── <ThemeProvider>         (Task 29)
                    └── <BrowserRouter>     (Task 27)
                        └── <AppRoutes>     (Task 27)
                            ├── /login      → LoginPage
                            ├── /register   → RegisterPage
                            └── (protected)
                                └── <AppShell>         (Task 28)
                                    ├── <Sidebar>
                                    ├── <Header>
                                    └── <Outlet>       (page content)
```

### 3.3 Feature-Based Component Structure

Components are organized by domain, **not by type**. The rule: every file has an obvious home.

```
src/components/
├── ui/           ← shadcn/ui primitives ONLY (Button, Input, Card, etc.)
│                   Never add feature logic here.
├── layout/       ← AppShell, Sidebar, Header, PageHeader, MobileNav
├── auth/         ← LoginForm, RegisterForm, ProtectedRoute, RoleGuard
├── dashboard/    ← StatCard, SalesTrendChart, LowStockTable, etc.
├── inventory/    ← ProductTable, ProductForm, StockBadge, etc.
├── suppliers/    ← SupplierTable, SupplierForm, SupplierCard
├── purchases/    ← PurchaseTable, PurchaseForm, PurchaseLineItems
├── sales/        ← SaleTable, SaleForm, InvoicePreview
├── shared/       ← DataTable, Pagination, SearchInput, EmptyState, etc.
└── alerts/       ← LowStockAlert, AlertBanner
```

**Decision rule:** If a component is reusable across multiple domains → `shared/`. If it belongs to one domain → that domain's subfolder.

### 3.4 Data Flow

```
User Action
    │
    ▼
Page Component (e.g., ProductsPage)
    │
    ├── reads from TanStack Query cache
    │       └── useQuery('products', productsApi.list)
    │                       └── products.api.ts
    │                               └── client.ts (Axios instance)
    │                                       └── GET /api/v1/products
    │
    └── mutations via useMutation
            └── productsApi.create(data)
                    └── POST /api/v1/products
                            └── invalidate query cache on success
```

**Zustand is used only for:**

- `authStore` — current user, access token, isAuthenticated
- `themeStore` — light/dark/system preference (persisted to localStorage)

Server state (products, sales, suppliers, etc.) lives **entirely** in TanStack Query. Never duplicate server data into Zustand.

### 3.5 Path Alias

All imports within `src/` use the `@/` alias (configured in both `vite.config.ts` and `tsconfig.json`):

```typescript
// ✅ Correct
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// ❌ Never write relative paths from deep nesting
import { Button } from '../../../../components/ui/button';
```

### 3.6 TypeScript Configuration

- **Module:** ESNext (Vite handles ES modules natively)
- **Module resolution:** `Bundler` (TypeScript 5+ resolver for bundler environments)
- **JSX:** `react-jsx` (automatic runtime — no `import React` needed for JSX)
- **isolatedModules:** `true` — required because Vite/esbuild transpiles each file independently
- **noEmit:** `true` — Vite builds; `tsc` is type-checking only
- **Type checking:** `npm run typecheck --workspace=client` (runs `tsc --noEmit`)
- **Build:** `tsc && vite build` — type-checks before bundling, catches errors before they ship

---

## 4. Folder Structure

### 4.1 Root

```
smart-inventory-system/
├── client/                    # @sims/client — React frontend
├── server/                    # @sims/server — Express backend
├── docs/                      # Architecture, API docs, ERD
│   └── ARCHITECTURE.md
├── .editorconfig              # Editor formatting rules
├── .gitignore                 # Excludes node_modules, .env, dist, etc.
├── package.json               # npm workspaces root + orchestration scripts
├── CLAUDE.md                  # AI agent instructions
├── PROJECT_PLAN.md            # Full technical implementation plan
├── FEATURES.md                # Feature specifications with priority labels
└── TASKS.md                   # Sequential task breakdown (58 MVP tasks)
```

### 4.2 Server

```
server/
├── prisma/
│   ├── schema.prisma          # All data models, enums, relations, indexes
│   ├── migrations/            # Auto-generated migration SQL files
│   └── seed.ts                # Demo data for development and portfolio
├── src/
│   ├── config/
│   │   ├── env.ts             # Zod-validated environment variables (fail-fast)
│   │   └── database.ts        # Prisma client singleton (one instance across app)
│   ├── middleware/
│   │   ├── auth.middleware.ts      # Verify JWT, attach req.user
│   │   ├── rbac.middleware.ts      # Enforce Admin/Employee roles per route
│   │   ├── validate.middleware.ts  # Zod schema validation for body/query/params
│   │   ├── error.middleware.ts     # Global error handler (last middleware in chain)
│   │   └── logger.middleware.ts    # Structured request logging
│   ├── modules/
│   │   ├── auth/              # Login, register, refresh, logout, /me
│   │   ├── users/             # Admin user management (list, create, update)
│   │   ├── products/          # Product CRUD, search, stock adjustment
│   │   ├── categories/        # Category management (Admin-only writes)
│   │   ├── suppliers/         # Supplier CRUD
│   │   ├── purchases/         # Purchase orders and status workflow
│   │   ├── sales/             # Sales and invoice generation
│   │   ├── dashboard/         # KPI aggregations and chart data
│   │   ├── invoices/          # PDF generation
│   │   └── activity/          # Audit log queries
│   ├── utils/
│   │   ├── jwt.util.ts            # Sign/verify access and refresh tokens
│   │   ├── password.util.ts       # bcrypt hash and compare
│   │   ├── pagination.util.ts     # Shared pagination helper for list queries
│   │   └── apiResponse.util.ts    # success() and error() response helpers
│   ├── types/
│   │   └── express.d.ts           # Extends Express Request with req.user
│   ├── app.ts                     # Express app — middleware + route registration
│   └── server.ts                  # HTTP server — port binding + graceful shutdown
├── tsconfig.json
└── package.json
```

### 4.3 Client

```
client/
├── public/
│   ├── favicon.svg            # App icon (branded asset — added with design system)
│   └── logo.svg               # Full logo lockup
├── src/
│   ├── api/                   # One file per backend module
│   │   ├── client.ts          # Axios instance + auth interceptor + refresh retry
│   │   ├── auth.api.ts
│   │   ├── products.api.ts
│   │   ├── suppliers.api.ts
│   │   ├── purchases.api.ts
│   │   ├── sales.api.ts
│   │   ├── dashboard.api.ts
│   │   └── activity.api.ts
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives — never modified for features
│   │   ├── layout/            # AppShell, Sidebar, Header, PageHeader, MobileNav
│   │   ├── auth/              # LoginForm, RegisterForm, ProtectedRoute, RoleGuard
│   │   ├── dashboard/         # StatCard, SalesTrendChart, LowStockTable, etc.
│   │   ├── inventory/         # ProductTable, ProductForm, StockBadge, etc.
│   │   ├── suppliers/         # SupplierTable, SupplierForm, SupplierCard
│   │   ├── purchases/         # PurchaseTable, PurchaseForm, LineItems
│   │   ├── sales/             # SaleTable, SaleForm, InvoicePreview
│   │   ├── shared/            # DataTable, Pagination, SearchInput, EmptyState
│   │   └── alerts/            # LowStockAlert, AlertBanner
│   ├── hooks/
│   │   ├── useAuth.ts         # Current user, role, token from authStore
│   │   ├── useTheme.ts        # Theme toggle, system preference detection
│   │   ├── useDebounce.ts     # Debounce hook for search inputs (300ms)
│   │   └── usePermissions.ts  # Role-based permission checks
│   ├── pages/
│   │   ├── auth/              # LoginPage, RegisterPage
│   │   ├── inventory/         # ProductsPage, ProductDetailPage, CategoriesPage
│   │   ├── suppliers/         # SuppliersPage, SupplierDetailPage
│   │   ├── purchases/         # PurchasesPage, PurchaseDetailPage
│   │   ├── sales/             # SalesPage, SaleDetailPage
│   │   ├── DashboardPage.tsx
│   │   ├── ActivityLogPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── routes/
│   │   ├── AppRoutes.tsx      # All route definitions in one place
│   │   └── ProtectedRoute.tsx # Redirects unauthenticated users to /login
│   ├── store/
│   │   ├── authStore.ts       # Zustand: user object, token, isAuthenticated
│   │   └── themeStore.ts      # Zustand: theme preference (persisted)
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── product.types.ts
│   │   ├── supplier.types.ts
│   │   ├── purchase.types.ts
│   │   ├── sale.types.ts
│   │   └── api.types.ts       # ApiResponse<T>, PaginatedResponse<T>, ApiError
│   ├── utils/
│   │   ├── formatters.ts      # formatCurrency(), formatDate(), formatRelative()
│   │   ├── constants.ts       # APP_NAME, ROUTES, QUERY_KEYS, etc.
│   │   └── cn.ts              # Tailwind class merge utility (clsx + tailwind-merge)
│   ├── lib/
│   │   └── queryClient.ts     # TanStack QueryClient configuration
│   ├── App.tsx                # Root component — providers + router
│   ├── main.tsx               # React 18 createRoot entry point
│   ├── index.css              # Global styles, Tailwind directives, CSS variables
│   └── vite-env.d.ts          # import.meta.env type declarations
├── index.html                 # Vite entry point (not a template — the actual HTML)
├── vite.config.ts             # Vite: React plugin, @ alias, dev proxy, chunking
├── tsconfig.json              # App source TypeScript config
├── tsconfig.node.json         # Vite config TypeScript config (Node environment)
└── package.json
```

---

## 5. Request Flow

### 5.1 Development (Vite Dev Server)

```
Browser
  │  GET http://localhost:5173/
  ▼
Vite Dev Server (:5173)
  │  Serves React app (index.html + JS modules)
  │
  │  GET http://localhost:5173/api/v1/products
  ▼
Vite Proxy (vite.config.ts)
  │  Forwards → http://localhost:5000/api/v1/products
  ▼
Express Server (:5000)
  │  Middleware chain (helmet, cors, auth, validate, etc.)
  ▼
Router → Controller → Service → Prisma → PostgreSQL
  │
  ▼
JSON Response
  │
  ▼
Vite Proxy → Browser
  │
  ▼
TanStack Query (caches response, triggers UI re-render)
```

**Why proxy?** Both servers share the same origin (`localhost:5173`) from the browser's perspective. No CORS configuration needed in development. The setup mirrors production where a reverse proxy routes `/api/*` to Express and `/*` to static files.

### 5.2 Production

```
Browser
  │  GET https://sims.example.com/
  ▼
Reverse Proxy (Nginx / Railway / Render)
  │
  ├── /api/*  →  Express Server (:5000)
  │               │
  │               ▼
  │             PostgreSQL (Neon / Supabase)
  │
  └── /*      →  Static files (client/dist/)
                  index.html, hashed JS/CSS bundles
```

### 5.3 A Typical Authenticated API Request

```
1. Browser sends:
   GET /api/v1/products?page=1&search=laptop
   Authorization: Bearer <access_token>

2. auth.middleware.ts
   - Extracts token from Authorization header
   - Verifies JWT signature and expiry
   - Attaches decoded payload to req.user
   - Returns 401 if token is missing, malformed, or expired

3. validate.middleware.ts
   - Validates query params against products Zod schema
   - Returns 400 with field-level errors if invalid
   - Calls next() if valid

4. products.controller.ts
   - Extracts validated query params (req.query is fully typed)
   - Calls productsService.list(params, req.user)

5. products.service.ts
   - Builds Prisma where/orderBy/skip/take from params
   - Runs query + count in parallel (Promise.all)
   - Returns { data, meta } shaped for the response envelope

6. products.controller.ts
   - Calls successResponse(res, data, meta)

7. Browser receives:
   { "success": true, "data": [...], "meta": { "page": 1, "total": 47 } }

8. TanStack Query
   - Caches under key: ['products', { page: 1, search: 'laptop' }]
   - Re-renders ProductsPage with fresh data
```

---

## 6. Authentication Flow (Planned)

> **Status:** Designed — implementation begins at Task 15.

### 6.1 Token Strategy

SIMS uses a **dual-token pattern**:

| Token         | Storage                      | Lifetime   | Purpose                           |
| ------------- | ---------------------------- | ---------- | --------------------------------- |
| Access token  | Memory (Zustand `authStore`) | 15 minutes | Authenticates every API request   |
| Refresh token | HTTP-only cookie             | 7 days     | Silently issues new access tokens |

**Why this split?**

- Access tokens in memory cannot be stolen by XSS — JavaScript cannot read memory between page loads.
- Refresh tokens in HTTP-only cookies are invisible to JavaScript entirely — the browser sends them automatically but they cannot be read or exfiltrated by scripts.

### 6.2 Login Flow

```
1. POST /api/v1/auth/login  { email, password }

2. auth.service.ts
   - Find user by email
   - Compare password with bcrypt hash (12 rounds)
   - Reject if user not found, password wrong, or isActive = false

3. On success:
   - Sign access token  (JWT, 15 min, ACCESS_TOKEN_SECRET)
   - Sign refresh token (JWT, 7 days, REFRESH_TOKEN_SECRET)
   - Hash and store refresh token in RefreshToken table
   - Set refresh token as HTTP-only, Secure, SameSite=Strict cookie

4. Response: { "success": true, "data": { "accessToken": "...", "user": {...} } }

5. authStore (client):
   - accessToken → Zustand memory state
   - user → Zustand memory state
   - Redirect → /dashboard
```

### 6.3 Silent Token Refresh

```
1. Any API request returns 401 (access token expired)

2. Axios response interceptor (client.ts):
   - Pauses the failed request
   - POST /api/v1/auth/refresh  (cookie sent automatically by browser)
   - Receives new access token
   - Updates authStore.accessToken
   - Retries the original request with new token

3. If refresh fails (cookie expired / token revoked):
   - authStore.clear()
   - navigate('/login')
```

### 6.4 Role-Based Access Control (RBAC)

**Backend (per route):**

```typescript
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), deleteProduct);
```

**Frontend (per component):**

```typescript
const { canDelete } = usePermissions();
// or
<CanAccess role="ADMIN"><DeleteButton /></CanAccess>
```

| Role       | What they can do                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `ADMIN`    | Everything — user management, delete operations, category management, full audit logs           |
| `EMPLOYEE` | Day-to-day work — view all, create/update products/suppliers/purchases/sales, generate invoices |

### 6.5 Logout

```
1. POST /api/v1/auth/logout

2. Server:
   - Deletes RefreshToken record (revokes the token server-side)
   - Clears the HTTP-only cookie (Set-Cookie: refresh_token=; MaxAge=0)

3. Client:
   - authStore.clear() — removes accessToken and user from memory
   - navigate('/login')
```

---

## 7. Database Layer (Planned)

> **Status:** Schema designed — implementation begins at Task 06.

### 7.1 Technology

| Tool              | Role                                                                 |
| ----------------- | -------------------------------------------------------------------- |
| **PostgreSQL**    | Relational database — ACID guarantees, foreign key integrity         |
| **Prisma ORM**    | Type-safe query builder, schema-as-code, migration management        |
| **Prisma Client** | Auto-generated TypeScript client (singleton in `config/database.ts`) |

### 7.2 Entity Relationship Overview

```
User ─────────────────────────────── ActivityLog
  │
  ├── (creates) ──► Purchase ──◄── PurchaseItem ──►── Product ──► Category
  │                     │
  │                     └──►── Supplier ◄────────────────────────────┘
  │                                                          (default supplier)
  └── (creates) ──► Sale ────◄── SaleItem ──────────────►── Product
```

### 7.3 Core Models Summary

| Model          | Key Fields                                                  | Notes                                                    |
| -------------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| `User`         | id, email, passwordHash, role, isActive                     | `role`: ADMIN \| EMPLOYEE                                |
| `Category`     | id, name, description                                       | Admin-managed                                            |
| `Supplier`     | id, name, contactPerson, email, isActive                    | Soft delete via `isActive`                               |
| `Product`      | id, sku, name, quantity, reorderLevel, costPrice, unitPrice | Central stock entity                                     |
| `Purchase`     | id, purchaseNumber, status, supplierId                      | `PO-YYYY-NNNN`, status: DRAFT→ORDERED→RECEIVED→CANCELLED |
| `PurchaseItem` | purchaseId, productId, quantity, unitCost, subtotal         | Line items                                               |
| `Sale`         | id, saleNumber, status, totalAmount, completedAt            | `INV-YYYY-NNNN`, status: DRAFT→COMPLETED→CANCELLED       |
| `SaleItem`     | saleId, productId, quantity, unitPrice, subtotal            | Line items                                               |
| `ActivityLog`  | userId, action, entityType, entityId, metadata              | Full audit trail                                         |
| `RefreshToken` | userId, token (hashed), expiresAt                           | Enables server-side logout/revocation                    |

### 7.4 Critical Stock Rules

**Stock quantity is never set arbitrarily.** It changes in exactly two ways:

1. **Purchase → RECEIVED:**

   ```
   prisma.$transaction([
     ...items.map(item =>
       prisma.product.update({ where: { id: item.productId },
         data: { quantity: { increment: item.quantity } } })
     )
   ])
   ```

2. **Sale → COMPLETED:**
   ```
   prisma.$transaction([
     // Verify sufficient stock first, then decrement
     ...items.map(item =>
       prisma.product.update({ where: { id: item.productId },
         data: { quantity: { decrement: item.quantity } } })
     )
   ])
   // Reject entire transaction if any product would go below 0
   ```

Both use `prisma.$transaction()` — all items update atomically or none do.

### 7.5 Prisma Client Singleton

```typescript
// server/src/config/database.ts
// One PrismaClient instance for the entire server lifetime.
// Multiple instances = multiple connection pools = connection exhaustion.
// In development, hot-reload creates new module instances — the global
// pattern prevents duplicate clients between reloads.
```

### 7.6 Seed Data (for portfolio demo)

| Entity         | Count | Notes                                      |
| -------------- | ----- | ------------------------------------------ |
| Admin users    | 1     | `admin@demo.com` / `password123`           |
| Employee users | 2     | `employee@demo.com`                        |
| Categories     | 5     | Electronics, Clothing, Food, Office, Other |
| Suppliers      | 10    | Mix of active/inactive                     |
| Products       | 50    | Mix of in-stock, low-stock, out-of-stock   |
| Purchases      | 20    | Various statuses for UI testing            |
| Sales          | 30    | Last 90 days — powers dashboard charts     |
| Activity logs  | 100   | Variety of action types                    |

---

## 8. Project Conventions

### 8.1 Naming

| Item                        | Convention                      | Example                         |
| --------------------------- | ------------------------------- | ------------------------------- |
| Server files                | `domain.type.ts`                | `products.service.ts`           |
| React components            | `PascalCase.tsx`                | `ProductForm.tsx`               |
| Hooks                       | `useNoun.ts`                    | `useDebounce.ts`                |
| Zustand stores              | `nounStore.ts`                  | `authStore.ts`                  |
| API modules                 | `noun.api.ts`                   | `products.api.ts`               |
| TypeScript types/interfaces | `PascalCase` (no `I` prefix)    | `ProductFilters`, `ApiResponse` |
| Environment variables       | `SCREAMING_SNAKE_CASE`          | `DATABASE_URL`                  |
| Client env variables        | `VITE_` prefix                  | `VITE_API_URL`                  |
| Prisma models               | `PascalCase`                    | `Product`                       |
| Database columns            | `snake_case` (mapped by Prisma) | `created_at`                    |
| CSS custom properties       | `--kebab-case`                  | `--color-primary`               |

### 8.2 Import Order

Enforced by ESLint in Task 04:

```typescript
// 1. Node built-ins
import path from 'path';
import http from 'http';

// 2. External packages
import express from 'express';
import { z } from 'zod';

// 3. Internal — absolute path (@ alias)
import { successResponse } from '@/utils/apiResponse.util';

// 4. Internal — relative path
import type { ProductFilters } from './products.schema';
```

### 8.3 Comments Policy

Comments explain **why**, not what. The code already explains what it does.

```typescript
// ✅ Explains a non-obvious architectural decision
// $transaction ensures both the stock decrement and the sale status update
// are atomic — a network failure mid-operation cannot leave stock inconsistent.
await prisma.$transaction([...]);

// ❌ Restates what the code obviously does
// Increment the count
count++;
```

Allowed exceptions:

- `// ─── Section Name ──────────────` dividers for long files
- JSDoc `/** ... */` on exported utility functions
- `// TODO(task-XX):` for intentional scaffolding that will be replaced

### 8.4 TypeScript Rules

| Rule                                  | Rationale                                                        |
| ------------------------------------- | ---------------------------------------------------------------- |
| No `any` — use `unknown` + narrowing  | `any` silently disables all type checking                        |
| `import type` for type-only imports   | Signals intent; enables `isolatedModules` erasure                |
| `satisfies` for typed object literals | Catches type errors while preserving literal inference           |
| No non-null assertions (`!`)          | Replace with proper null checks or throw descriptive errors      |
| No `process.env.X` inline             | Use `config/env.ts` on server, `import.meta.env` on client       |
| No inline `as SomeType` casts         | Cast only when TypeScript is wrong; add a comment explaining why |

### 8.5 Git Workflow

```
Branch naming:  task/02-server-scaffold
                task/21-tailwind-design-tokens
                fix/auth-token-refresh

Commit format:  type(scope): description (Task NN)

  Types:   feat | fix | chore | docs | refactor | style
  Scopes:  server | client | db | auth | root | docs

Examples:
  feat(server): scaffold Express + TypeScript server package (Task 02)
  feat(client): scaffold Vite + React 18 + TypeScript client package (Task 03)
  docs(root): add ARCHITECTURE.md
```

Never commit: `.env`, `node_modules/`, `dist/`, `*.log`, `.DS_Store`

### 8.6 Environment Variables

| File                  | Committed | Purpose                                                      |
| --------------------- | --------- | ------------------------------------------------------------ |
| `server/.env`         | ❌ No     | Local dev secrets (DATABASE_URL, JWT secrets)                |
| `server/.env.example` | ✅ Yes    | Template — shows all required keys with empty/example values |
| `client/.env`         | ❌ No     | Local dev client config (`VITE_API_URL`)                     |
| `client/.env.example` | ✅ Yes    | Template for all `VITE_*` variables                          |

**Complete server environment variable reference** (as defined in `server/.env.example`):

| Variable                 | Required | Default                 | Introduced |
| ------------------------ | -------- | ----------------------- | ---------- |
| `NODE_ENV`               | Yes      | `development`           | Task 02    |
| `PORT`                   | Yes      | `5000`                  | Task 02    |
| `HOST`                   | Yes      | `0.0.0.0`               | Task 02    |
| `DATABASE_URL`           | Yes      | —                       | Task 05    |
| `JWT_ACCESS_SECRET`      | Yes      | —                       | Task 15    |
| `JWT_ACCESS_EXPIRES_IN`  | Yes      | `15m`                   | Task 15    |
| `JWT_REFRESH_SECRET`     | Yes      | —                       | Task 15    |
| `JWT_REFRESH_EXPIRES_IN` | Yes      | `7d`                    | Task 15    |
| `CLIENT_URL`             | Yes      | `http://localhost:5173` | Task 10    |

**DATABASE_URL formats:**

```
# Local PostgreSQL (Homebrew / Postgres.app)
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/sims_dev

# Neon (free tier cloud PostgreSQL)
DATABASE_URL=postgresql://USERNAME:PASSWORD@ep-XXXX.REGION.aws.neon.tech/sims_dev?sslmode=require
```

Server variables are Zod-validated at startup in `config/env.ts` (Task 09).
Invalid or missing variables cause an immediate process exit with a clear error
message — fail fast, fail loudly.

### 8.7 Error Handling Rules

**Server:**

- All errors propagate to the global error middleware — never swallow silently
- Services throw `AppError` instances with a message, HTTP status code, and optional machine-readable `code`
- 500 responses never expose internal details (stack traces, Prisma internals) to the client

**Client:**

- Every `useMutation` has `onSuccess` (toast: "Product created") and `onError`
  (toast: "Failed to create product")
- Every data-fetching view has three states: loading skeleton, error state, data
- No empty catch blocks anywhere

### 8.8 Code Toolchain (Task 04)

All tooling is installed at the **monorepo root** (`devDependencies` in root
`package.json`). Both workspaces share one ESLint config, one Prettier config,
and one set of Git hooks.

| Tool        | Config File                | Purpose                                        |
| ----------- | -------------------------- | ---------------------------------------------- |
| ESLint 9    | `eslint.config.mjs` (root) | Static analysis — bugs, patterns, import order |
| Prettier 3  | `.prettierrc` (root)       | Code formatting — style enforcement            |
| Husky 9     | `.husky/pre-commit`        | Git hook runner — wires lint-staged on commit  |
| lint-staged | `package.json#lint-staged` | Runs ESLint + Prettier only on staged files    |

**ESLint flat config layer order** (later layers override earlier ones):

1. Global ignores (`dist/`, `node_modules/`, etc.)
2. `@eslint/js` recommended — base JS rules
3. `typescript-eslint` recommended — TypeScript-aware rules (all `.ts/.tsx`)
4. Import sort rules (`simple-import-sort`) — enforces §8.2 import order
5. Server glob (`server/**/*.ts`) — Node globals
6. Client glob (`client/**/*.{ts,tsx}`) — React rules + browser globals
7. `eslint-config-prettier` — disables formatting rules that conflict with Prettier

**Pre-commit flow:**

```
git commit
  └── .husky/pre-commit
        └── npx lint-staged
              ├── **/*.{ts,tsx} → eslint --fix → prettier --write
              ├── **/*.{js,mjs,cjs} → prettier --write
              └── **/*.{json,md,css,yml,yaml} → prettier --write
```

If ESLint finds an **unfixable error**, the commit is blocked and the developer
must fix it manually before committing.

**Root scripts added:**

| Script                 | Command                         |
| ---------------------- | ------------------------------- |
| `npm run lint`         | ESLint on both workspaces       |
| `npm run lint:fix`     | ESLint --fix on both workspaces |
| `npm run format`       | Prettier --write all files      |
| `npm run format:check` | Prettier --check (CI)           |

---

_Last updated after: **Task 05** — Environment configuration and PostgreSQL setup_
_Next update due after: **Task 06** — Prisma ORM installation_
