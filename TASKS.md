# Smart Inventory Management System — Task Breakdown

> **Total Tasks:** 58 (MVP) + deferred post-MVP tasks  
> **Estimated Total Time:** ~18–22 hours (MVP tasks only)  
> **Average Task Duration:** 15–30 minutes  
> **Rule:** Complete tasks in order. Each task depends only on previously completed tasks.  
> **Related docs:** [PROJECT_PLAN.md](./PROJECT_PLAN.md) · [FEATURES.md](./FEATURES.md)  
> **Note:** Docker (Task 56) and automated testing (Tasks 20, 55) are **deferred until after MVP** per project decisions.

---

## How to Use This File

1. Work through tasks sequentially (Task 01 → Task 50).
2. Mark a task complete only when its acceptance criteria are met.
3. Do not skip ahead — later tasks assume earlier ones are done.
4. Difficulty ratings:
   - **Easy** — Straightforward setup or wiring; minimal decision-making
   - **Medium** — Requires understanding patterns; moderate complexity
   - **Hard** — Multi-step logic, transactions, or cross-layer integration

---

## Phase 0: Project Foundation (Tasks 01–08)

### Task 01 — Initialize root monorepo workspace

**Description:** Create the root `package.json` with npm/pnpm workspaces pointing to `client/` and `server/`. Add root-level scripts (`dev`, `build`, `lint`) and `.gitignore`.

| Field              | Value                                                               |
| ------------------ | ------------------------------------------------------------------- |
| **Difficulty**     | Easy                                                                |
| **Estimated Time** | 15 min                                                              |
| **Depends On**     | —                                                                   |
| **Files Affected** | `package.json`, `.gitignore`, `pnpm-workspace.yaml` (or equivalent) |

**Acceptance Criteria:**

- [ ] Root workspace installs and recognizes `client` and `server` packages
- [ ] `.gitignore` excludes `node_modules`, `.env`, `dist`, and build artifacts

---

### Task 02 — Scaffold Express + TypeScript server package

**Description:** Initialize the `server/` package with TypeScript, ts-node-dev (or tsx), and basic folder structure (`src/config`, `src/middleware`, `src/modules`, `src/utils`).

| Field              | Value                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------ |
| **Difficulty**     | Easy                                                                                       |
| **Estimated Time** | 20 min                                                                                     |
| **Depends On**     | Task 01                                                                                    |
| **Files Affected** | `server/package.json`, `server/tsconfig.json`, `server/src/server.ts`, `server/src/app.ts` |

**Acceptance Criteria:**

- [ ] Server starts on configured port with a placeholder route
- [ ] TypeScript compiles without errors

---

### Task 03 — Scaffold React + Vite + TypeScript client package

**Description:** Initialize the `client/` package with Vite, React 18, and TypeScript. Create minimal `App.tsx` and entry point.

| Field              | Value                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Easy                                                                                                                                     |
| **Estimated Time** | 20 min                                                                                                                                   |
| **Depends On**     | Task 01                                                                                                                                  |
| **Files Affected** | `client/package.json`, `client/vite.config.ts`, `client/tsconfig.json`, `client/index.html`, `client/src/main.tsx`, `client/src/App.tsx` |

**Acceptance Criteria:**

- [ ] Vite dev server runs and renders a placeholder page
- [ ] TypeScript and HMR work correctly

---

### Task 04 — Configure ESLint, Prettier, and Husky

**Description:** Add shared linting and formatting config at the root. Set up Husky pre-commit hook to run lint-staged.

| Field              | Value                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                            |
| **Estimated Time** | 25 min                                                                                                            |
| **Depends On**     | Tasks 02, 03                                                                                                      |
| **Files Affected** | `.eslintrc.cjs`, `.prettierrc`, `.husky/pre-commit`, `package.json`, `client/package.json`, `server/package.json` |

**Acceptance Criteria:**

- [ ] `npm run lint` passes on both packages
- [ ] Pre-commit hook blocks commits with lint errors

---

### Task 05 — Set up PostgreSQL database connection

**Description:** Configure PostgreSQL for local development using a local install (Homebrew/Postgres.app) or Neon free tier. Add `.env.example` for the server with `DATABASE_URL`. **Do not use Docker** — deferred to post-MVP.

| Field              | Value                                 |
| ------------------ | ------------------------------------- |
| **Difficulty**     | Easy                                  |
| **Estimated Time** | 15 min                                |
| **Depends On**     | Task 02                               |
| **Files Affected** | `.env.example`, `server/.env.example` |

**Acceptance Criteria:**

- [ ] PostgreSQL running and reachable on port 5432 (local or Neon)
- [ ] Server can connect using `DATABASE_URL` from `.env.example`

---

### Task 06 — Install and configure Prisma in the server

**Description:** Add Prisma to the server package. Create `schema.prisma` with datasource and generator blocks. Add Prisma scripts to `package.json`.

| Field              | Value                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------- |
| **Difficulty**     | Easy                                                                                  |
| **Estimated Time** | 15 min                                                                                |
| **Depends On**     | Tasks 02, 05                                                                          |
| **Files Affected** | `server/package.json`, `server/prisma/schema.prisma`, `server/src/config/database.ts` |

**Acceptance Criteria:**

- [ ] Prisma client generates successfully
- [ ] Database connection works against PostgreSQL (local or Neon)

---

### Task 07 — Define full Prisma schema and run initial migration

**Status:** Complete — July 31, 2026.

**Description:** Add all models to `schema.prisma`: User, Category, Supplier, Product, Purchase, PurchaseItem, Sale, SaleItem, InventoryTransaction, ActivityLog, RefreshToken. Include enums, relations, indexes, and the initial migration.

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| **Difficulty**     | Medium                                                       |
| **Estimated Time** | 30 min                                                       |
| **Depends On**     | Task 06                                                      |
| **Files Affected** | `server/prisma/schema.prisma`, `server/prisma/migrations/**` |

**Acceptance Criteria:**

- [ ] All entities from PROJECT_PLAN.md exist in schema
- [ ] Migration applies cleanly to local database
- [ ] Relations and indexes are defined

---

### Task 08 — Create database seed script with demo data

**Description:** Write `prisma/seed.ts` to populate admin/employee users, categories, suppliers, products, purchases, sales, and activity logs. Wire seed command in `package.json`.

| Field              | Value                                          |
| ------------------ | ---------------------------------------------- |
| **Difficulty**     | Medium                                         |
| **Estimated Time** | 30 min                                         |
| **Depends On**     | Task 07                                        |
| **Files Affected** | `server/prisma/seed.ts`, `server/package.json` |

**Acceptance Criteria:**

- [ ] `npx prisma db seed` runs without errors
- [ ] Demo credentials exist: `admin@demo.com`, `employee@demo.com`
- [ ] Dashboard-ready sample data (sales, low-stock products) is present

---

## Phase 1: Server Core Infrastructure (Tasks 09–14)

### Task 09 — Add environment variable validation

**Description:** Create `config/env.ts` using Zod to validate `DATABASE_URL`, JWT secrets, port, and `CLIENT_URL` at startup.

| Field              | Value                                                                     |
| ------------------ | ------------------------------------------------------------------------- |
| **Difficulty**     | Easy                                                                      |
| **Estimated Time** | 20 min                                                                    |
| **Depends On**     | Task 02                                                                   |
| **Files Affected** | `server/src/config/env.ts`, `server/src/server.ts`, `server/.env.example` |

**Acceptance Criteria:**

- [ ] Server fails fast with clear error if required env vars are missing
- [ ] All secrets documented in `.env.example`

---

### Task 10 — Build Express middleware stack

**Description:** Configure CORS, Helmet, cookie-parser, JSON body parser, rate limiter, and request logger middleware in `app.ts`.

| Field              | Value                                                             |
| ------------------ | ----------------------------------------------------------------- |
| **Difficulty**     | Medium                                                            |
| **Estimated Time** | 25 min                                                            |
| **Depends On**     | Tasks 02, 09                                                      |
| **Files Affected** | `server/src/app.ts`, `server/src/middleware/logger.middleware.ts` |

**Acceptance Criteria:**

- [ ] CORS allows client origin from env
- [ ] Rate limiting active on `/api` routes
- [ ] Requests logged with method, path, and duration

---

### Task 11 — Implement standardized API response helpers

**Description:** Create utility functions for success and error responses with consistent envelope format (`success`, `data`, `meta`, `error`).

| Field              | Value                                                                   |
| ------------------ | ----------------------------------------------------------------------- |
| **Difficulty**     | Easy                                                                    |
| **Estimated Time** | 15 min                                                                  |
| **Depends On**     | Task 02                                                                 |
| **Files Affected** | `server/src/utils/apiResponse.util.ts`, `server/src/types/express.d.ts` |

**Acceptance Criteria:**

- [ ] Success and error helpers used consistently
- [ ] Pagination meta shape defined

---

### Task 12 — Implement global error-handling middleware

**Description:** Create `error.middleware.ts` to catch Prisma errors, Zod validation errors, and custom `AppError` instances. Return appropriate HTTP status codes.

| Field              | Value                                                            |
| ------------------ | ---------------------------------------------------------------- |
| **Difficulty**     | Medium                                                           |
| **Estimated Time** | 25 min                                                           |
| **Depends On**     | Task 11                                                          |
| **Files Affected** | `server/src/middleware/error.middleware.ts`, `server/src/app.ts` |

**Acceptance Criteria:**

- [ ] Unhandled errors return 500 with safe message
- [ ] Validation errors return 400 with field details
- [ ] 404 errors return consistent JSON shape

---

### Task 13 — Add health check endpoint

**Description:** Create `GET /api/v1/health` that verifies server uptime and database connectivity via Prisma `$queryRaw`.

| Field              | Value                                                |
| ------------------ | ---------------------------------------------------- |
| **Difficulty**     | Easy                                                 |
| **Estimated Time** | 15 min                                               |
| **Depends On**     | Tasks 06, 10                                         |
| **Files Affected** | `server/src/app.ts` (or dedicated health route file) |

**Acceptance Criteria:**

- [ ] Returns 200 when DB is reachable
- [ ] Returns 503 when DB is down

---

### Task 14 — Create Zod validation middleware

**Description:** Build reusable `validate.middleware.ts` that accepts Zod schemas for `body`, `query`, and `params`. Integrate with error middleware.

| Field              | Value                                          |
| ------------------ | ---------------------------------------------- |
| **Difficulty**     | Medium                                         |
| **Estimated Time** | 20 min                                         |
| **Depends On**     | Tasks 12, 11                                   |
| **Files Affected** | `server/src/middleware/validate.middleware.ts` |

**Acceptance Criteria:**

- [ ] Invalid request body returns 400 with Zod error details
- [ ] Valid requests pass through to controller

---

## Phase 2: Authentication — Backend (Tasks 15–20)

### Task 15 — Implement password and JWT utilities

**Description:** Create `password.util.ts` (bcrypt hash/compare) and `jwt.util.ts` (sign/verify access and refresh tokens).

| Field              | Value                                                               |
| ------------------ | ------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                              |
| **Estimated Time** | 25 min                                                              |
| **Depends On**     | Task 09                                                             |
| **Files Affected** | `server/src/utils/password.util.ts`, `server/src/utils/jwt.util.ts` |

**Acceptance Criteria:**

- [ ] Passwords hashed with bcrypt (12 rounds)
- [ ] Access token expires in 15 min; refresh in 7 days

---

### Task 16 — Build auth service (register, login, refresh, logout)

**Description:** Implement `auth.service.ts` with user registration, login, token refresh, and logout (refresh token invalidation).

| Field              | Value                                                                               |
| ------------------ | ----------------------------------------------------------------------------------- |
| **Difficulty**     | Hard                                                                                |
| **Estimated Time** | 30 min                                                                              |
| **Depends On**     | Tasks 07, 15                                                                        |
| **Files Affected** | `server/src/modules/auth/auth.service.ts`, `server/src/modules/auth/auth.schema.ts` |

**Acceptance Criteria:**

- [ ] Register creates user with hashed password
- [ ] Login returns access token and sets refresh cookie
- [ ] Refresh endpoint issues new access token
- [ ] Logout clears refresh token from DB

---

### Task 17 — Build auth controller and routes

**Description:** Wire auth endpoints: `POST /register`, `POST /login`, `POST /logout`, `POST /refresh`, `GET /me`, `PATCH /password`.

| Field              | Value                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                      |
| **Estimated Time** | 25 min                                                                                                      |
| **Depends On**     | Tasks 14, 16                                                                                                |
| **Files Affected** | `server/src/modules/auth/auth.controller.ts`, `server/src/modules/auth/auth.routes.ts`, `server/src/app.ts` |

**Acceptance Criteria:**

- [ ] All auth routes respond with standardized JSON
- [ ] Routes mounted under `/api/v1/auth`

---

### Task 18 — Implement auth and RBAC middleware

**Description:** Create `auth.middleware.ts` to verify JWT and attach user to request. Create `rbac.middleware.ts` to enforce Admin/Employee roles per route.

| Field              | Value                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                  |
| **Estimated Time** | 25 min                                                                                                                  |
| **Depends On**     | Tasks 15, 17                                                                                                            |
| **Files Affected** | `server/src/middleware/auth.middleware.ts`, `server/src/middleware/rbac.middleware.ts`, `server/src/types/express.d.ts` |

**Acceptance Criteria:**

- [ ] Missing/invalid token returns 401
- [ ] Wrong role returns 403
- [ ] `req.user` available in protected controllers

---

### Task 19 — Build users module (Admin CRUD)

**Description:** Implement users service, controller, routes, and schemas for list/create/update/deactivate user endpoints.

| Field              | Value                                                                                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                                                                                                   |
| **Estimated Time** | 30 min                                                                                                                                                                                                   |
| **Depends On**     | Task 18                                                                                                                                                                                                  |
| **Files Affected** | `server/src/modules/users/users.service.ts`, `server/src/modules/users/users.controller.ts`, `server/src/modules/users/users.routes.ts`, `server/src/modules/users/users.schema.ts`, `server/src/app.ts` |

**Acceptance Criteria:**

- [ ] Admin can list, create, update, and deactivate users
- [ ] Employee receives 403 on all user management routes

---

### Task 20 — ~~Write auth integration tests~~ (DEFERRED — Post-MVP)

**Status:** Skipped during MVP. Implement in Phase 1.5 after all Required features in [FEATURES.md](./FEATURES.md) are complete.

**Description:** Set up Vitest + Supertest test harness. Write tests for register, login, protected route access, and RBAC denial.

| Field              | Value                                                                       |
| ------------------ | --------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                      |
| **Estimated Time** | 30 min                                                                      |
| **Depends On**     | Tasks 17, 18                                                                |
| **Phase**          | 1.5 (Post-MVP)                                                              |
| **Files Affected** | `server/tests/setup.ts`, `server/tests/auth.test.ts`, `server/package.json` |

**Acceptance Criteria:**

- [ ] Tests run against test database or mocked Prisma
- [ ] Happy path and unauthorized cases covered

---

## Phase 3: Client Foundation (Tasks 21–26)

### Task 21 — Configure Tailwind CSS and dark-mode-first design tokens

**Description:** Install Tailwind, set up `tailwind.config.ts` with SaaS-inspired tokens (Vercel/Linear aesthetic), and configure `index.css` with CSS variables. **Design dark mode first**; light mode is the variant.

| Field              | Value                                                                           |
| ------------------ | ------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                          |
| **Estimated Time** | 25 min                                                                          |
| **Depends On**     | Task 03                                                                         |
| **Files Affected** | `client/tailwind.config.ts`, `client/src/index.css`, `client/postcss.config.js` |

**Acceptance Criteria:**

- [ ] Tailwind utilities work in components
- [ ] Light/dark CSS variables defined per design system

---

### Task 22 — Initialize shadcn/ui and core primitives

**Description:** Run shadcn init. Add Button, Input, Label, Card, Badge, Table, Dialog, Sheet, DropdownMenu, Toast, Skeleton, and Select components.

| Field              | Value                                                                             |
| ------------------ | --------------------------------------------------------------------------------- |
| **Difficulty**     | Easy                                                                              |
| **Estimated Time** | 20 min                                                                            |
| **Depends On**     | Task 21                                                                           |
| **Files Affected** | `client/components.json`, `client/src/components/ui/**`, `client/src/utils/cn.ts` |

**Acceptance Criteria:**

- [ ] shadcn components render correctly
- [ ] `cn()` utility available for class merging

---

### Task 23 — Set up Axios client and API types

**Description:** Create Axios instance with base URL, auth header interceptor, and 401 refresh-token retry logic. Define shared API response types.

| Field              | Value                                                                              |
| ------------------ | ---------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                             |
| **Estimated Time** | 25 min                                                                             |
| **Depends On**     | Task 03                                                                            |
| **Files Affected** | `client/src/api/client.ts`, `client/src/types/api.types.ts`, `client/.env.example` |

**Acceptance Criteria:**

- [ ] API client reads `VITE_API_URL` from env
- [ ] 401 responses trigger token refresh once

---

### Task 24 — Configure TanStack Query and app providers

**Description:** Set up `queryClient.ts`, wrap app in `QueryClientProvider`, and add toast provider.

| Field              | Value                                                                        |
| ------------------ | ---------------------------------------------------------------------------- |
| **Difficulty**     | Easy                                                                         |
| **Estimated Time** | 15 min                                                                       |
| **Depends On**     | Tasks 03, 22                                                                 |
| **Files Affected** | `client/src/lib/queryClient.ts`, `client/src/main.tsx`, `client/src/App.tsx` |

**Acceptance Criteria:**

- [ ] React Query Devtools available in development
- [ ] Toast notifications render globally

---

### Task 25 — Build auth store and auth API module

**Description:** Create Zustand `authStore.ts` for user state and tokens. Create `auth.api.ts` with login, register, logout, and getMe functions.

| Field              | Value                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                          |
| **Estimated Time** | 25 min                                                                                          |
| **Depends On**     | Tasks 23, 17                                                                                    |
| **Files Affected** | `client/src/store/authStore.ts`, `client/src/api/auth.api.ts`, `client/src/types/auth.types.ts` |

**Acceptance Criteria:**

- [ ] Login updates store with user and token
- [ ] Logout clears store and redirects to login

---

### Task 26 — Build Login and Register pages

**Description:** Create auth layout (split panel), `LoginForm`, `RegisterForm`, and pages with React Hook Form + Zod validation.

| Field              | Value                                                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                                                                     |
| **Estimated Time** | 30 min                                                                                                                                                                     |
| **Depends On**     | Tasks 22, 25                                                                                                                                                               |
| **Files Affected** | `client/src/pages/auth/LoginPage.tsx`, `client/src/pages/auth/RegisterPage.tsx`, `client/src/components/auth/LoginForm.tsx`, `client/src/components/auth/RegisterForm.tsx` |

**Acceptance Criteria:**

- [ ] Forms validate email and password
- [ ] Successful login redirects to dashboard
- [ ] Errors shown via toast or inline messages

---

## Phase 4: Routing & Layout (Tasks 27–32)

### Task 27 — Set up React Router and protected routes

**Description:** Configure `AppRoutes.tsx` with public and protected route groups. Implement `ProtectedRoute` and redirect logic.

| Field              | Value                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                          |
| **Estimated Time** | 20 min                                                                                          |
| **Depends On**     | Tasks 25, 26                                                                                    |
| **Files Affected** | `client/src/routes/AppRoutes.tsx`, `client/src/routes/ProtectedRoute.tsx`, `client/src/App.tsx` |

**Acceptance Criteria:**

- [ ] Unauthenticated users redirected to `/login`
- [ ] Authenticated users cannot access login page (redirect to dashboard)

---

### Task 28 — Build AppShell, Sidebar, and Header

**Description:** Create main layout components with navigation links, active state, user dropdown (profile/logout), and content area.

| Field              | Value                                                                                                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                                                                            |
| **Estimated Time** | 30 min                                                                                                                                                                            |
| **Depends On**     | Tasks 22, 27                                                                                                                                                                      |
| **Files Affected** | `client/src/components/layout/AppShell.tsx`, `client/src/components/layout/Sidebar.tsx`, `client/src/components/layout/Header.tsx`, `client/src/components/layout/PageHeader.tsx` |

**Acceptance Criteria:**

- [ ] All main nav links present (Dashboard, Inventory, Suppliers, Purchases, Sales, Activity, Settings)
- [ ] Active route highlighted in sidebar
- [ ] Logout works from user menu

---

### Task 29 — Implement dark mode with theme store

**Description:** Create `themeStore.ts` and `useTheme` hook. Add light/dark/system toggle in Header. Persist preference in localStorage.

| Field              | Value                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Easy                                                                                                                                |
| **Estimated Time** | 20 min                                                                                                                              |
| **Depends On**     | Tasks 21, 28                                                                                                                        |
| **Files Affected** | `client/src/store/themeStore.ts`, `client/src/hooks/useTheme.ts`, `client/src/components/layout/Header.tsx`, `client/src/index.css` |

**Acceptance Criteria:**

- [ ] Theme toggle switches between light and dark
- [ ] Preference persists across page reloads
- [ ] No flash of wrong theme on load

---

### Task 30 — Add responsive mobile navigation

**Description:** Implement collapsible sidebar for desktop and Sheet/drawer navigation for mobile. Add `MobileNav` component.

| Field              | Value                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                                |
| **Estimated Time** | 25 min                                                                                                                                |
| **Depends On**     | Task 28                                                                                                                               |
| **Files Affected** | `client/src/components/layout/Sidebar.tsx`, `client/src/components/layout/MobileNav.tsx`, `client/src/components/layout/AppShell.tsx` |

**Acceptance Criteria:**

- [ ] Sidebar collapses on screens < 768px
- [ ] Hamburger menu opens mobile nav drawer
- [ ] All nav links accessible on mobile

---

### Task 31 — Build shared DataTable, Pagination, and SearchInput

**Description:** Create reusable table wrapper with sorting headers, pagination controls, and debounced search input hook.

| Field              | Value                                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Difficulty**     | Medium                                                                                                                                                                         |
| **Estimated Time** | 30 min                                                                                                                                                                         |
| **Depends On**     | Tasks 22, 24                                                                                                                                                                   |
| **Files Affected** | `client/src/components/shared/DataTable.tsx`, `client/src/components/shared/Pagination.tsx`, `client/src/components/shared/SearchInput.tsx`, `client/src/hooks/useDebounce.ts` |

**Acceptance Criteria:**

- [ ] DataTable accepts columns and data generically
- [ ] Pagination emits page change events
- [ ] SearchInput debounces at 300ms

---

### Task 32 — Add NotFound page and utility formatters

**Description:** Create 404 page and utility functions for currency, date, and number formatting.

| Field              | Value                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| **Difficulty**     | Easy                                                                                                   |
| **Estimated Time** | 15 min                                                                                                 |
| **Depends On**     | Task 27                                                                                                |
| **Files Affected** | `client/src/pages/NotFoundPage.tsx`, `client/src/utils/formatters.ts`, `client/src/utils/constants.ts` |

**Acceptance Criteria:**

- [ ] Unknown routes render 404 page with link home
- [ ] `formatCurrency(1234.5)` returns locale-formatted string

---

## Phase 5: Dashboard (Tasks 33–36)

### Task 33 — Build dashboard API endpoints

**Description:** Implement dashboard service and routes for stats, sales trend, top products, and category breakdown.

| Field              | Value                                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Difficulty**     | Medium                                                                                                                                                                               |
| **Estimated Time** | 30 min                                                                                                                                                                               |
| **Depends On**     | Tasks 08, 18                                                                                                                                                                         |
| **Files Affected** | `server/src/modules/dashboard/dashboard.service.ts`, `server/src/modules/dashboard/dashboard.controller.ts`, `server/src/modules/dashboard/dashboard.routes.ts`, `server/src/app.ts` |

**Acceptance Criteria:**

- [ ] `/dashboard/stats` returns KPI counts
- [ ] Chart endpoints return data shaped for Recharts
- [ ] Queries perform efficiently on seeded data

---

### Task 34 — Build dashboard API client and StatCard component

**Description:** Create `dashboard.api.ts` and `StatCard` component with icon, label, value, and optional trend indicator.

| Field              | Value                                                                             |
| ------------------ | --------------------------------------------------------------------------------- |
| **Difficulty**     | Easy                                                                              |
| **Estimated Time** | 20 min                                                                            |
| **Depends On**     | Tasks 24, 33                                                                      |
| **Files Affected** | `client/src/api/dashboard.api.ts`, `client/src/components/dashboard/StatCard.tsx` |

**Acceptance Criteria:**

- [ ] StatCard renders four KPI variants
- [ ] API hooks fetch dashboard stats via React Query

---

### Task 35 — Build dashboard charts with Recharts

**Description:** Create `SalesTrendChart`, `TopProductsChart`, and `CategoryBreakdownChart` components. Install and configure Recharts.

| Field              | Value                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                                                                                             |
| **Estimated Time** | 30 min                                                                                                                                                                                             |
| **Depends On**     | Task 34                                                                                                                                                                                            |
| **Files Affected** | `client/src/components/dashboard/SalesTrendChart.tsx`, `client/src/components/dashboard/TopProductsChart.tsx`, `client/src/components/dashboard/CategoryBreakdownChart.tsx`, `client/package.json` |

**Acceptance Criteria:**

- [ ] Line, bar, and donut charts render with seed data
- [ ] Charts responsive inside Card containers
- [ ] Dark mode colors readable

---

### Task 36 — Assemble Dashboard page with low-stock widget

**Description:** Compose `DashboardPage` with KPI row, charts, `LowStockTable`, and `RecentActivityFeed` placeholders.

| Field              | Value                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                                              |
| **Estimated Time** | 25 min                                                                                                                                              |
| **Depends On**     | Tasks 28, 35                                                                                                                                        |
| **Files Affected** | `client/src/pages/DashboardPage.tsx`, `client/src/components/dashboard/LowStockTable.tsx`, `client/src/components/dashboard/RecentActivityFeed.tsx` |

**Acceptance Criteria:**

- [ ] Dashboard is the default authenticated landing page
- [ ] Low-stock table links to product detail
- [ ] Loading skeletons shown while fetching

---

## Phase 6: Categories & Products (Tasks 37–42)

### Task 37 — Build categories API module

**Description:** Implement categories CRUD (Admin-only for write operations) with validation schemas.

| Field              | Value                                                                                                                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Difficulty**     | Easy                                                                                                                                                                                                                                             |
| **Estimated Time** | 20 min                                                                                                                                                                                                                                           |
| **Depends On**     | Task 18                                                                                                                                                                                                                                          |
| **Files Affected** | `server/src/modules/categories/categories.service.ts`, `server/src/modules/categories/categories.controller.ts`, `server/src/modules/categories/categories.routes.ts`, `server/src/modules/categories/categories.schema.ts`, `server/src/app.ts` |

**Acceptance Criteria:**

- [ ] All users can list categories
- [ ] Only Admin can create/update/delete

---

### Task 38 — Build products API module (CRUD + search/filter)

**Description:** Implement products service with pagination, search, category filter, stock status filter, and soft delete.

| Field              | Value                                                                                                                                                                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Hard                                                                                                                                                                                                                                                                    |
| **Estimated Time** | 30 min                                                                                                                                                                                                                                                                  |
| **Depends On**     | Tasks 18, 37                                                                                                                                                                                                                                                            |
| **Files Affected** | `server/src/modules/products/products.service.ts`, `server/src/modules/products/products.controller.ts`, `server/src/modules/products/products.routes.ts`, `server/src/modules/products/products.schema.ts`, `server/src/utils/pagination.util.ts`, `server/src/app.ts` |

**Acceptance Criteria:**

- [ ] Search matches name and SKU
- [ ] Filters: category, low stock, out of stock
- [ ] Pagination meta returned correctly

---

### Task 39 — Add low-stock and manual stock adjustment endpoints

**Description:** Implement `GET /products/low-stock` and `PATCH /products/:id/stock` with validation and activity logging stub.

| Field              | Value                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                              |
| **Estimated Time** | 20 min                                                                                              |
| **Depends On**     | Task 38                                                                                             |
| **Files Affected** | `server/src/modules/products/products.service.ts`, `server/src/modules/products/products.routes.ts` |

**Acceptance Criteria:**

- [ ] Low-stock query returns products where `quantity <= reorderLevel`
- [ ] Stock adjustment updates quantity atomically

---

### Task 40 — Build Categories page (Admin)

**Description:** Create categories list with create/edit/delete dialogs. Restrict page actions to Admin via `usePermissions`.

| Field              | Value                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                    |
| **Estimated Time** | 25 min                                                                                                                    |
| **Depends On**     | Tasks 31, 37                                                                                                              |
| **Files Affected** | `client/src/pages/inventory/CategoriesPage.tsx`, `client/src/api/categories.api.ts`, `client/src/hooks/usePermissions.ts` |

**Acceptance Criteria:**

- [ ] Admin can manage categories inline
- [ ] Employee sees read-only list or 403 redirect

---

### Task 41 — Build products API client and shared inventory components

**Description:** Create `products.api.ts`, `StockBadge`, `StatusBadge`, and `ProductForm` with category/supplier selects.

| Field              | Value                                                                                                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                                                                                                                     |
| **Estimated Time** | 30 min                                                                                                                                                                                                                     |
| **Depends On**     | Tasks 38, 22                                                                                                                                                                                                               |
| **Files Affected** | `client/src/api/products.api.ts`, `client/src/types/product.types.ts`, `client/src/components/inventory/StockBadge.tsx`, `client/src/components/inventory/ProductForm.tsx`, `client/src/components/shared/StatusBadge.tsx` |

**Acceptance Criteria:**

- [ ] ProductForm validates required fields with Zod
- [ ] StockBadge shows green/yellow/red based on reorder level

---

### Task 42 — Build Products list and detail pages

**Description:** Create `ProductsPage` with search, filters, pagination, and `ProductDetailPage` with edit mode and stock adjustment modal.

| Field              | Value                                                                                                                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                                                                                                            |
| **Estimated Time** | 30 min                                                                                                                                                                                                            |
| **Depends On**     | Tasks 31, 41                                                                                                                                                                                                      |
| **Files Affected** | `client/src/pages/inventory/ProductsPage.tsx`, `client/src/pages/inventory/ProductDetailPage.tsx`, `client/src/components/inventory/ProductTable.tsx`, `client/src/components/inventory/StockAdjustmentModal.tsx` |

**Acceptance Criteria:**

- [ ] Product list supports search and category filter
- [ ] Detail page shows product info and allows edit
- [ ] Stock adjustment updates quantity via API

---

## Phase 7: Suppliers (Tasks 43–44)

### Task 43 — Build suppliers API module

**Description:** Implement suppliers CRUD with pagination, soft deactivate, and detail view including linked products.

| Field              | Value                                                                                                                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                                                                                                                                   |
| **Estimated Time** | 25 min                                                                                                                                                                                                                                   |
| **Depends On**     | Task 18                                                                                                                                                                                                                                  |
| **Files Affected** | `server/src/modules/suppliers/suppliers.service.ts`, `server/src/modules/suppliers/suppliers.controller.ts`, `server/src/modules/suppliers/suppliers.routes.ts`, `server/src/modules/suppliers/suppliers.schema.ts`, `server/src/app.ts` |

**Acceptance Criteria:**

- [ ] Supplier detail includes related products count
- [ ] Delete is soft (sets `isActive = false`)

---

### Task 44 — Build Suppliers list and detail pages

**Description:** Create `SuppliersPage` and `SupplierDetailPage` with `SupplierForm`, table/card view, and linked products list.

| Field              | Value                                                                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                                                                                                                                                                                |
| **Estimated Time** | 30 min                                                                                                                                                                                                                                                                                |
| **Depends On**     | Tasks 31, 43                                                                                                                                                                                                                                                                          |
| **Files Affected** | `client/src/pages/suppliers/SuppliersPage.tsx`, `client/src/pages/suppliers/SupplierDetailPage.tsx`, `client/src/api/suppliers.api.ts`, `client/src/types/supplier.types.ts`, `client/src/components/suppliers/SupplierTable.tsx`, `client/src/components/suppliers/SupplierForm.tsx` |

**Acceptance Criteria:**

- [ ] Create and edit supplier from UI
- [ ] Detail page shows purchase history summary

---

## Phase 8: Purchases (Tasks 45–47)

### Task 45 — Build purchases API with line items and status workflow

**Description:** Implement purchase CRUD, line item management, auto-generated purchase numbers, and status transitions (Draft → Ordered → Received → Cancelled).

| Field              | Value                                                                                                                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Hard                                                                                                                                                                                                                                     |
| **Estimated Time** | 30 min                                                                                                                                                                                                                                   |
| **Depends On**     | Tasks 38, 43                                                                                                                                                                                                                             |
| **Files Affected** | `server/src/modules/purchases/purchases.service.ts`, `server/src/modules/purchases/purchases.controller.ts`, `server/src/modules/purchases/purchases.routes.ts`, `server/src/modules/purchases/purchases.schema.ts`, `server/src/app.ts` |

**Acceptance Criteria:**

- [ ] Purchase number auto-generated (e.g., `PO-2026-0001`)
- [ ] Only Draft purchases can be edited
- [ ] Status endpoint validates allowed transitions

---

### Task 46 — Implement stock increment on purchase received

**Description:** Add Prisma transaction in purchase service: when status becomes `RECEIVED`, increment product quantities and set `receivedAt`.

| Field              | Value                                               |
| ------------------ | --------------------------------------------------- |
| **Difficulty**     | Hard                                                |
| **Estimated Time** | 25 min                                              |
| **Depends On**     | Task 45                                             |
| **Files Affected** | `server/src/modules/purchases/purchases.service.ts` |

**Acceptance Criteria:**

- [ ] Stock updated atomically for all line items
- [ ] Double-receive prevented (idempotent or blocked)
- [ ] `costPrice` optionally updated on product

---

### Task 47 — Build Purchases list, create, and detail pages

**Description:** Create purchase pages with `PurchaseForm`, `PurchaseLineItems`, supplier select, and status action buttons.

| Field              | Value                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Hard                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Estimated Time** | 30 min                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Depends On**     | Tasks 31, 45, 44                                                                                                                                                                                                                                                                                                                                                                                            |
| **Files Affected** | `client/src/pages/purchases/PurchasesPage.tsx`, `client/src/pages/purchases/PurchaseDetailPage.tsx`, `client/src/api/purchases.api.ts`, `client/src/types/purchase.types.ts`, `client/src/components/purchases/PurchaseTable.tsx`, `client/src/components/purchases/PurchaseForm.tsx`, `client/src/components/purchases/PurchaseLineItems.tsx`, `client/src/components/purchases/PurchaseStatusActions.tsx` |

**Acceptance Criteria:**

- [ ] Create purchase with multiple line items
- [ ] Mark as Received updates stock (verify via product detail)
- [ ] Status badges reflect current state

---

## Phase 9: Sales & Invoices (Tasks 48–51)

### Task 48 — Build sales API with line items and stock deduction

**Description:** Implement sales CRUD, line items, auto-generated sale numbers, and stock decrement on `COMPLETED` status within a transaction.

| Field              | Value                                                                                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Hard                                                                                                                                                                                                     |
| **Estimated Time** | 30 min                                                                                                                                                                                                   |
| **Depends On**     | Task 38                                                                                                                                                                                                  |
| **Files Affected** | `server/src/modules/sales/sales.service.ts`, `server/src/modules/sales/sales.controller.ts`, `server/src/modules/sales/sales.routes.ts`, `server/src/modules/sales/sales.schema.ts`, `server/src/app.ts` |

**Acceptance Criteria:**

- [ ] Sale rejected if insufficient stock
- [ ] Completed sale deducts quantities atomically
- [ ] Sale number auto-generated (e.g., `INV-2026-0001`)

---

### Task 49 — Implement invoice PDF generation endpoint

**Description:** Create invoices module using pdfkit. Add `GET /sales/:id/invoice` returning PDF with sale details, line items, and totals.

| Field              | Value                                                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Hard                                                                                                                                                                       |
| **Estimated Time** | 30 min                                                                                                                                                                     |
| **Depends On**     | Task 48                                                                                                                                                                    |
| **Files Affected** | `server/src/modules/invoices/invoices.service.ts`, `server/src/modules/invoices/invoices.controller.ts`, `server/src/modules/sales/sales.routes.ts`, `server/package.json` |

**Acceptance Criteria:**

- [ ] PDF downloads with correct filename
- [ ] Invoice includes sale number, date, items, and total
- [ ] Only completed sales can generate invoices

---

### Task 50 — Build Sales list, POS form, and detail pages

**Description:** Create POS-style sale form with product search combobox, cart line items, customer info, and sale detail with invoice download.

| Field              | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Difficulty**     | Hard                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Estimated Time** | 30 min                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Depends On**     | Tasks 31, 48, 41                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Files Affected** | `client/src/pages/sales/SalesPage.tsx`, `client/src/pages/sales/SaleDetailPage.tsx`, `client/src/api/sales.api.ts`, `client/src/types/sale.types.ts`, `client/src/components/sales/SaleTable.tsx`, `client/src/components/sales/SaleForm.tsx`, `client/src/components/sales/SaleLineItems.tsx`, `client/src/components/sales/ProductSearchCombobox.tsx`, `client/src/components/sales/InvoicePreview.tsx`, `client/src/components/sales/InvoiceDownloadButton.tsx` |

**Acceptance Criteria:**

- [ ] Add products to cart via search
- [ ] Complete sale deducts stock
- [ ] Invoice PDF downloadable from detail page

---

## Phase 10: Activity Logs, Settings & Polish (Tasks 51–55)

### Task 51 — Implement activity logging service

**Description:** Create activity module that logs CREATE/UPDATE/DELETE/LOGIN actions with user, entity, and metadata. Integrate into product, purchase, and sale services.

| Field              | Value                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                                                                                                                                                                                                                              |
| **Estimated Time** | 30 min                                                                                                                                                                                                                                                                                                                              |
| **Depends On**     | Tasks 38, 45, 48                                                                                                                                                                                                                                                                                                                    |
| **Files Affected** | `server/src/modules/activity/activity.service.ts`, `server/src/modules/activity/activity.controller.ts`, `server/src/modules/activity/activity.routes.ts`, `server/src/modules/products/products.service.ts`, `server/src/modules/purchases/purchases.service.ts`, `server/src/modules/sales/sales.service.ts`, `server/src/app.ts` |

**Acceptance Criteria:**

- [ ] Product create/update logged with metadata
- [ ] Login events logged
- [ ] Employee sees only own logs; Admin sees all

---

### Task 52 — Build Activity Log page

**Description:** Create filterable activity log table with user, action, entity type, and date range filters. Add expandable row for metadata diff.

| Field              | Value                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Difficulty**     | Medium                                                                                                                                                                                     |
| **Estimated Time** | 25 min                                                                                                                                                                                     |
| **Depends On**     | Tasks 31, 51                                                                                                                                                                               |
| **Files Affected** | `client/src/pages/ActivityLogPage.tsx`, `client/src/api/activity.api.ts`, `client/src/components/activity/ActivityLogTable.tsx`, `client/src/components/activity/ActivityDetailDrawer.tsx` |

**Acceptance Criteria:**

- [ ] Filters reduce results correctly
- [ ] Recent activity feed on dashboard populated

---

### Task 53 — Build Settings page (profile, password, user management)

**Description:** Create tabbed Settings page: Profile tab, Appearance tab (theme), Users tab (Admin only) with user table and role assignment.

| Field              | Value                                                                           |
| ------------------ | ------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                          |
| **Estimated Time** | 30 min                                                                          |
| **Depends On**     | Tasks 19, 29, 25                                                                |
| **Files Affected** | `client/src/pages/SettingsPage.tsx`, `client/src/components/auth/RoleGuard.tsx` |

**Acceptance Criteria:**

- [ ] User can update name and change password
- [ ] Admin can create/deactivate users and assign roles
- [ ] Employee cannot access Users tab

---

### Task 54 — Add UX polish (empty states, skeletons, error boundary, toasts)

**Description:** Create `EmptyState`, `LoadingSpinner`, and `ErrorBoundary` components. Add loading skeletons to all list pages and toast feedback on all mutations.

| Field              | Value                                                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                                                                                          |
| **Estimated Time** | 30 min                                                                                                                                                                          |
| **Depends On**     | Tasks 42, 44, 47, 50                                                                                                                                                            |
| **Files Affected** | `client/src/components/shared/EmptyState.tsx`, `client/src/components/shared/LoadingSpinner.tsx`, `client/src/components/shared/ErrorBoundary.tsx`, `client/src/pages/**/*.tsx` |

**Acceptance Criteria:**

- [ ] Empty lists show illustration and CTA
- [ ] All API mutations show success/error toasts
- [ ] Render errors caught by ErrorBoundary

---

### Task 55 — ~~Write integration tests for critical flows~~ (DEFERRED — Post-MVP)

**Status:** Skipped during MVP. Implement in Phase 1.5.

**Description:** Add server tests for product CRUD, purchase receive (stock increment), and sale complete (stock decrement). Add client smoke test for login flow.

| Field              | Value                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Hard                                                                                                                        |
| **Estimated Time** | 30 min                                                                                                                      |
| **Depends On**     | Tasks 46, 48                                                                                                                |
| **Phase**          | 1.5 (Post-MVP)                                                                                                              |
| **Files Affected** | `server/tests/products.test.ts`, `server/tests/purchases.test.ts`, `server/tests/sales.test.ts`, `client/src/**/*.test.tsx` |

**Acceptance Criteria:**

- [ ] Stock increment/decrement tests pass
- [ ] Insufficient stock sale rejected in test
- [ ] All tests run in CI

---

## Phase 11: Deployment & Documentation (Tasks 56–58)

### Task 56 — ~~Create Docker production builds and CI pipeline~~ (DEFERRED — Post-MVP)

**Status:** Skipped during MVP. Implement in Phase 1.5.

**Description:** Add `Dockerfile.client`, `Dockerfile.server`, production docker-compose, and GitHub Actions `ci.yml` for lint, test, and build.

| Field              | Value                                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                                          |
| **Estimated Time** | 30 min                                                                                                          |
| **Depends On**     | Task 55                                                                                                         |
| **Phase**          | 1.5 (Post-MVP)                                                                                                  |
| **Files Affected** | `docker/Dockerfile.client`, `docker/Dockerfile.server`, `docker/docker-compose.yml`, `.github/workflows/ci.yml` |

**Acceptance Criteria:**

- [ ] CI runs on pull requests
- [ ] Docker images build successfully
- [ ] Production compose starts all services

---

### Task 57 — Deploy to production (Vercel + Railway + Neon)

**Description:** Deploy frontend to Vercel, backend to Railway/Render, database to Neon/Supabase. Configure environment variables and run production migrations.

| Field              | Value                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **Difficulty**     | Medium                                                                                    |
| **Estimated Time** | 30 min                                                                                    |
| **Depends On**     | Task 54 (MVP deploy — no Docker/CI required)                                              |
| **Files Affected** | `.github/workflows/deploy.yml`, `README.md`, `client/.env.example`, `server/.env.example` |

**Acceptance Criteria:**

- [ ] Live URL accessible publicly
- [ ] Login works against production DB
- [ ] CORS configured for production client URL

---

### Task 58 — Write README, API docs, and finalize demo assets

**Description:** Complete README with setup, architecture diagram, demo credentials, and screenshots. Add Swagger/OpenAPI spec at `/api/docs`.

| Field              | Value                                                                           |
| ------------------ | ------------------------------------------------------------------------------- |
| **Difficulty**     | Easy                                                                            |
| **Estimated Time** | 25 min                                                                          |
| **Depends On**     | Task 57                                                                         |
| **Files Affected** | `README.md`, `docs/API.md`, `docs/ERD.png`, `server/src/app.ts` (Swagger mount) |

**Acceptance Criteria:**

- [ ] README allows new developer to run project locally in < 15 min
- [ ] Demo credentials documented
- [ ] API docs cover all MVP endpoints

---

## Summary

| Phase                            | Tasks        | Est. Time   |
| -------------------------------- | ------------ | ----------- |
| 0 — Project Foundation           | 01–08        | ~2.5 hrs    |
| 1 — Server Infrastructure        | 09–14        | ~2 hrs      |
| 2 — Auth Backend                 | 15–20        | ~2.75 hrs   |
| 3 — Client Foundation            | 21–26        | ~2.25 hrs   |
| 4 — Routing & Layout             | 27–32        | ~2.25 hrs   |
| 5 — Dashboard                    | 33–36        | ~1.75 hrs   |
| 6 — Categories & Products        | 37–42        | ~2.75 hrs   |
| 7 — Suppliers                    | 43–44        | ~1 hr       |
| 8 — Purchases                    | 45–47        | ~1.5 hrs    |
| 9 — Sales & Invoices             | 48–50        | ~1.5 hrs    |
| 10 — Activity, Settings & Polish | 51–55        | ~2.5 hrs    |
| 11 — Deployment & Docs           | 56–58        | ~1.5 hrs    |
| **Total**                        | **58 tasks** | **~23 hrs** |

---

## Progress Tracker

Copy this checklist to track completion:

```
Phase 0:  [x] 01  [x] 02  [x] 03  [x] 04  [x] 05  [x] 06  [x] 07  [x] 08
Phase 1:  [x] 09  [x] 10  [x] 11  [x] 12  [x] 13  [x] 14
Phase 2:  [x] 15  [x] 16  [ ] 17  [ ] 18  [ ] 19  [ ] 20
Phase 3:  [ ] 21  [ ] 22  [ ] 23  [ ] 24  [ ] 25  [ ] 26
Phase 4:  [ ] 27  [ ] 28  [ ] 29  [ ] 30  [ ] 31  [ ] 32
Phase 5:  [ ] 33  [ ] 34  [ ] 35  [ ] 36
Phase 6:  [ ] 37  [ ] 38  [ ] 39  [ ] 40  [ ] 41  [ ] 42
Phase 7:  [ ] 43  [ ] 44
Phase 8:  [ ] 45  [ ] 46  [ ] 47
Phase 9:  [ ] 48  [ ] 49  [ ] 50
Phase 10: [ ] 51  [ ] 52  [ ] 53  [ ] 54  [ ] 55
Phase 11: [ ] 56  [ ] 57  [ ] 58
```

---

_Reference: See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for architecture details, schema definitions, and API specifications._
