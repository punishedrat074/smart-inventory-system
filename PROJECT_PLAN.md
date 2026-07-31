# Smart Inventory Management System — Implementation Plan

> **Version:** 1.2
> **Last Updated:** July 31, 2026
> **Status:** Pre-development planning  
> **Purpose:** Software engineering portfolio & resume showcase  
> **Related docs:** [FEATURES.md](./FEATURES.md) · [TASKS.md](./TASKS.md)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
   - [Engineering Priorities](#17-engineering-priorities)
   - [Development Principles](#18-development-principles)
   - [Phased Delivery Model](#19-phased-delivery-model)
2. [Folder Structure](#2-folder-structure)
3. [Database Schema](#3-database-schema)
4. [User Roles and Permissions](#4-user-roles-and-permissions)
5. [UI Pages](#5-ui-pages)
6. [React Components](#6-react-components)
7. [Backend Architecture](#7-backend-architecture)
8. [API Endpoints](#8-api-endpoints)
9. [Development Roadmap](#9-development-roadmap)
10. [Git Commit Strategy](#10-git-commit-strategy)
11. [Deployment Strategy](#11-deployment-strategy)
12. [Suggested Project Timeline](#12-suggested-project-timeline)

---

## 1. Project Overview

### 1.1 Vision

Build a **Smart Inventory Management System (SIMS)** that looks and behaves like a real SaaS product for small businesses (retail shops, warehouses, distributors). The system enables businesses to track stock, manage suppliers, record purchases and sales, generate invoices, and monitor inventory health through analytics and alerts.

This project is built primarily as a **software engineering portfolio piece** — something a recruiter or hiring manager can evaluate on a live URL, in a GitHub repo, and on a resume. Every architectural and UI decision should reflect professional engineering standards, not tutorial-level output.

### 1.2 Goals

| Goal                     | Description                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------- |
| **Portfolio impact**     | Demonstrates full-stack proficiency through a deployed, demo-ready SaaS application |
| **Clean architecture**   | Feature-based modules, clear separation of concerns, readable and maintainable code |
| **Professional UI/UX**   | Modern SaaS aesthetic comparable to Linear, Vercel, Stripe, and Clerk dashboards    |
| **Production readiness** | Auth, RBAC, validation, error handling, logging, and deployment                     |
| **Scalable foundation**  | Modular design that supports future AI features without major rewrites              |
| **Business value**       | Solves real inventory pain points: stock visibility, reorder alerts, sales tracking |

### 1.3 Tech Stack

| Layer     | Technology                     | Purpose                                                          |
| --------- | ------------------------------ | ---------------------------------------------------------------- |
| Frontend  | React 18 + TypeScript          | Type-safe UI with component reusability                          |
| Build     | Vite                           | Fast dev server and optimized production builds                  |
| Styling   | Tailwind CSS + shadcn/ui       | Utility-first CSS with accessible, polished components           |
| State     | TanStack Query + Zustand       | Server state caching + lightweight client state (theme, sidebar) |
| Forms     | React Hook Form + Zod          | Validated forms with shared schemas                              |
| Backend   | Node.js + Express + TypeScript | REST API with structured middleware                              |
| Database  | PostgreSQL                     | Relational data with ACID guarantees                             |
| ORM       | Prisma                         | Type-safe queries, migrations, seeding                           |
| Auth      | JWT (access + refresh tokens)  | Stateless authentication with secure refresh flow                |
| PDF       | pdfkit or react-pdf            | Invoice generation                                               |
| Charts    | Recharts                       | Dashboard analytics visualizations                               |
| Animation | Framer Motion (optional)       | Page transitions and micro-interactions                          |
| Linting   | ESLint + Prettier + Husky      | Code quality and pre-commit hooks                                |

**Deferred until after MVP:**

| Layer            | Technology                                 | When                 |
| ---------------- | ------------------------------------------ | -------------------- |
| Testing          | Vitest + React Testing Library + Supertest | Phase 1.5 (post-MVP) |
| Containerization | Docker + Docker Compose                    | Phase 1.5 (post-MVP) |
| AI / LLM         | OpenAI / Anthropic via abstraction layer   | Phase 2 only         |

### 1.4 Core Features (MVP)

See **[FEATURES.md](./FEATURES.md)** for the complete feature list with Required / Optional / Future labels.

MVP scope (Phase 1) includes:

- User authentication (register, login, logout, password change)
- Role-based access control (Admin & Employee)
- Dashboard with KPIs and charts
- Inventory (products) management with categories
- Supplier management
- Purchase order management
- Sales order management
- Search, filtering, sorting, and pagination
- Low stock alerts (threshold-based)
- Invoice PDF generation
- Activity/audit logs
- Responsive design (desktop + mobile)
- Dark mode from the beginning (not added later)
- Modern SaaS UI/UX (see §5.3)

**Explicitly excluded from MVP:** Docker, automated tests, AI features, email notifications.

### 1.5 AI Features (Phase 2 Only)

> **Hard rule:** Do not implement any AI functionality until the complete inventory management system is fully working and deployed.

AI features are documented in [FEATURES.md § AI Features](./FEATURES.md#ai-features). They will be built in **Phase 2** only, after all Required MVP features are complete and manually verified.

| Feature                   | Description                                        | Integration Point                      |
| ------------------------- | -------------------------------------------------- | -------------------------------------- |
| AI Inventory Assistant    | Chatbot for inventory questions                    | New `/assistant` page + `/api/ai/chat` |
| Inventory Recommendations | Suggest reorder quantities based on sales velocity | Dashboard widget + background job      |
| Sales Summaries           | Auto-generated weekly/monthly reports              | Reports page + scheduled cron          |
| Natural Language Queries  | "Show me low stock items in Electronics"           | NL → SQL/API layer via LLM             |

Phase 2 will use an abstraction layer (`AIService`) so the core app remains independent of any specific LLM provider.

### 1.6 Non-Functional Requirements

- **Security:** bcrypt password hashing, HTTP-only refresh cookies, CORS, rate limiting, input sanitization
- **Performance:** Pagination on all list endpoints, database indexes on foreign keys and search fields
- **Accessibility:** WCAG 2.1 AA target — keyboard navigation, ARIA labels, color contrast
- **Observability:** Structured logging (Winston/Pino), health check endpoint
- **Documentation:** README with setup instructions; OpenAPI/Swagger optional in MVP
- **Code quality:** ESLint + Prettier enforced; clear naming; comments only where logic is non-obvious

### 1.7 Engineering Priorities

These priorities guide every implementation decision. When trade-offs arise, resolve them in this order:

1. **Clean architecture** — Feature-based modules, thin controllers, business logic in services, no god files
2. **Professional code quality** — Consistent patterns, typed interfaces, no `any`, no dead code
3. **Beautiful UI/UX** — SaaS-grade visual design; never accept "good enough for a student project"
4. **Readability** — Code should be understandable by a reviewer in a 30-minute read
5. **Maintainability** — Easy to extend (e.g., adding AI later) without rewriting core modules
6. **Production-quality folder structure** — Every file has an obvious home; no dumping grounds
7. **Clear comments where appropriate** — Explain _why_, not _what_; never comment obvious code

### 1.8 Development Principles

| Principle                                      | Application                                                             |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| **Dark mode first**                            | Design and build in dark mode from day one; light mode is the variant   |
| **No beginner aesthetics**                     | No harsh primary colors, no cramped layouts, no unstyled default HTML   |
| **Consistent spacing**                         | Use Tailwind spacing scale systematically; generous whitespace          |
| **Component reuse**                            | Shared primitives before one-off implementations                        |
| **Validate at boundaries**                     | Zod schemas on API inputs; React Hook Form + Zod on all forms           |
| **Fail gracefully**                            | Error boundaries, toast feedback, loading skeletons on every async view |
| **Manual verification over premature testing** | Test flows manually during MVP; add automated tests post-MVP            |
| **Local PostgreSQL for dev**                   | Use local install or cloud free tier (Neon); Docker deferred            |
| **No AI until MVP ships**                      | Resist adding AI "early" — it distracts from core inventory flows       |

### 1.9 Phased Delivery Model

```
Phase 1   — MVP              Build complete inventory system; deploy live demo
Phase 1.5 — Advanced         Automated tests, CI, Docker (optional)
Phase 2   — AI               Only after MVP is 100% working (see FEATURES.md gate)
Phase 3   — Future           Multi-tenant, mobile, integrations (see FEATURES.md)
```

---

## 2. Folder Structure

```
smart-inventory-system/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, test, build on PR
│       └── deploy.yml                # Deploy on merge to main
├── client/                           # React frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   └── logo.svg
│   ├── src/
│   │   ├── api/                      # Axios/fetch wrappers per resource
│   │   │   ├── auth.api.ts
│   │   │   ├── products.api.ts
│   │   │   ├── suppliers.api.ts
│   │   │   ├── purchases.api.ts
│   │   │   ├── sales.api.ts
│   │   │   ├── dashboard.api.ts
│   │   │   ├── activity.api.ts
│   │   │   └── client.ts             # Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui primitives (Button, Input, etc.)
│   │   │   ├── layout/               # AppShell, Sidebar, Header, Footer
│   │   │   ├── auth/                 # LoginForm, RegisterForm, ProtectedRoute
│   │   │   ├── dashboard/            # StatCard, Chart widgets
│   │   │   ├── inventory/            # ProductTable, ProductForm, StockBadge
│   │   │   ├── suppliers/            # SupplierTable, SupplierForm
│   │   │   ├── purchases/            # PurchaseTable, PurchaseForm, LineItems
│   │   │   ├── sales/                # SaleTable, SaleForm, InvoicePreview
│   │   │   ├── shared/               # DataTable, SearchBar, Pagination, EmptyState
│   │   │   └── alerts/               # LowStockAlert, AlertBanner
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useTheme.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── usePermissions.ts
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── inventory/
│   │   │   │   ├── ProductsPage.tsx
│   │   │   │   ├── ProductDetailPage.tsx
│   │   │   │   └── CategoriesPage.tsx
│   │   │   ├── suppliers/
│   │   │   │   ├── SuppliersPage.tsx
│   │   │   │   └── SupplierDetailPage.tsx
│   │   │   ├── purchases/
│   │   │   │   ├── PurchasesPage.tsx
│   │   │   │   └── PurchaseDetailPage.tsx
│   │   │   ├── sales/
│   │   │   │   ├── SalesPage.tsx
│   │   │   │   └── SaleDetailPage.tsx
│   │   │   ├── ActivityLogPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   └── themeStore.ts
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   ├── product.types.ts
│   │   │   ├── supplier.types.ts
│   │   │   ├── purchase.types.ts
│   │   │   ├── sale.types.ts
│   │   │   └── api.types.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts         # Currency, date formatting
│   │   │   ├── constants.ts
│   │   │   └── cn.ts                 # Tailwind class merge utility
│   │   ├── lib/
│   │   │   └── queryClient.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── server/                           # Express backend
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts                # Validated environment variables (Zod)
│   │   │   └── database.ts           # Prisma client singleton
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rbac.middleware.ts
│   │   │   ├── validate.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── logger.middleware.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.schema.ts
│   │   │   ├── users/
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   ├── users.routes.ts
│   │   │   │   └── users.schema.ts
│   │   │   ├── products/
│   │   │   │   ├── products.controller.ts
│   │   │   │   ├── products.service.ts
│   │   │   │   ├── products.routes.ts
│   │   │   │   └── products.schema.ts
│   │   │   ├── categories/
│   │   │   │   └── ...
│   │   │   ├── suppliers/
│   │   │   │   └── ...
│   │   │   ├── purchases/
│   │   │   │   └── ...
│   │   │   ├── sales/
│   │   │   │   └── ...
│   │   │   ├── dashboard/
│   │   │   │   └── ...
│   │   │   ├── invoices/
│   │   │   │   └── ...
│   │   │   └── activity/
│   │   │       └── ...
│   │   ├── utils/
│   │   │   ├── jwt.util.ts
│   │   │   ├── password.util.ts
│   │   │   ├── pagination.util.ts
│   │   │   └── apiResponse.util.ts
│   │   ├── types/
│   │   │   └── express.d.ts            # Extend Request with user
│   │   ├── app.ts                      # Express app setup
│   │   └── server.ts                   # Entry point
│   ├── tests/                        # Added in Phase 1.5 (post-MVP)
│   │   ├── auth.test.ts
│   │   ├── products.test.ts
│   │   └── setup.ts
│   ├── tsconfig.json
│   └── package.json
├── shared/                           # Shared types/schemas (optional monorepo)
│   └── schemas/
│       ├── product.schema.ts
│       └── auth.schema.ts
├── docker/                           # Added in Phase 1.5 (post-MVP)
│   ├── Dockerfile.client
│   ├── Dockerfile.server
│   └── docker-compose.yml
├── docs/
│   ├── API.md
│   └── ERD.png                       # Entity-relationship diagram
├── .env.example
├── .gitignore
├── .prettierrc
├── .eslintrc.cjs
├── package.json                      # Root workspace scripts
├── PROJECT_PLAN.md
├── FEATURES.md
├── TASKS.md
└── README.md
```

### 2.1 Architecture Pattern

- **Monorepo** with `client/` and `server/` as separate packages
- **Backend:** Feature-based modules (controller → service → Prisma)
- **Frontend:** Feature-based pages + shared component library
- **Shared validation:** Zod schemas duplicated or shared via `shared/` package

### 2.2 Folder Structure Standards

Every new file should follow these rules:

| Rule                                   | Example                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------ |
| One module per domain                  | `server/src/modules/products/` contains all product-related server code  |
| No business logic in controllers       | Controllers parse request and call service; services own logic           |
| UI primitives stay in `components/ui/` | shadcn components never modified with feature logic                      |
| Feature components co-locate by domain | `components/inventory/ProductForm.tsx`, not `components/ProductForm.tsx` |
| API clients mirror backend modules     | `client/src/api/products.api.ts` maps to `modules/products/`             |
| Types live in `types/`                 | Shared TypeScript interfaces, not inline in components                   |
| Comments explain non-obvious intent    | Stock transaction logic, RBAC edge cases — not `// increment counter`    |

> **Note:** `docker/` and `server/tests/` directories are created in **Phase 1.5**, not during initial MVP setup.

---

## 3. Database Schema

### 3.1 Entity-Relationship Overview

```
User ──────────< ActivityLog
  │
  ├── (creates) ──> Purchase ──< PurchaseItem >── Product
  │                      │
  │                      └── Supplier
  │
  └── (creates) ──> Sale ──< SaleItem >── Product

Product ──> Category
Product ──> Supplier (preferred/default supplier)
Product ──< InventoryTransaction (immutable stock ledger)
```

### 3.2 Prisma Schema (Conceptual)

#### User

| Field        | Type                   | Notes           |
| ------------ | ---------------------- | --------------- |
| id           | UUID                   | Primary key     |
| email        | String                 | Unique, indexed |
| passwordHash | String                 | bcrypt          |
| firstName    | String                 |                 |
| lastName     | String                 |                 |
| role         | Enum (ADMIN, EMPLOYEE) |                 |
| isActive     | Boolean                | Soft disable    |
| createdAt    | DateTime               |                 |
| updatedAt    | DateTime               |                 |

#### Category

| Field       | Type     | Notes  |
| ----------- | -------- | ------ |
| id          | UUID     | PK     |
| name        | String   | Unique |
| description | String?  |        |
| createdAt   | DateTime |        |

#### Supplier

| Field         | Type     | Notes |
| ------------- | -------- | ----- |
| id            | UUID     | PK    |
| name          | String   |       |
| contactPerson | String?  |       |
| email         | String?  |       |
| phone         | String?  |       |
| address       | String?  |       |
| isActive      | Boolean  |       |
| createdAt     | DateTime |       |
| updatedAt     | DateTime |       |

#### Product

| Field           | Type          | Notes                    |
| --------------- | ------------- | ------------------------ |
| id              | UUID          | PK                       |
| sku             | String        | Unique, indexed          |
| name            | String        | Indexed for search       |
| description     | String?       |                          |
| categoryId      | UUID          | FK → Category            |
| supplierId      | UUID?         | FK → Supplier (default)  |
| unitPrice       | Decimal(10,2) | Selling price            |
| costPrice       | Decimal(10,2) | Purchase cost            |
| quantity        | Int           | Current stock            |
| reorderLevel    | Int           | Low stock threshold      |
| reorderQuantity | Int?          | Suggested reorder amount |
| unit            | String        | e.g., "pcs", "kg", "box" |
| isActive        | Boolean       |                          |
| createdAt       | DateTime      |                          |
| updatedAt       | DateTime      |                          |

#### Purchase

| Field          | Type                                       | Notes                                 |
| -------------- | ------------------------------------------ | ------------------------------------- |
| id             | UUID                                       | PK                                    |
| purchaseNumber | String                                     | Unique, auto-generated (PO-2026-0001) |
| supplierId     | UUID                                       | FK → Supplier                         |
| userId         | UUID                                       | FK → User (created by)                |
| status         | Enum (DRAFT, ORDERED, RECEIVED, CANCELLED) |                                       |
| totalAmount    | Decimal(10,2)                              | Computed from items                   |
| notes          | String?                                    |                                       |
| orderedAt      | DateTime?                                  |                                       |
| receivedAt     | DateTime?                                  | Stock updated on RECEIVED             |
| createdAt      | DateTime                                   |                                       |
| updatedAt      | DateTime                                   |                                       |

#### PurchaseItem

| Field      | Type          | Notes                    |
| ---------- | ------------- | ------------------------ |
| id         | UUID          | PK                       |
| purchaseId | UUID          | FK → Purchase            |
| productId  | UUID          | FK → Product             |
| quantity   | Int           |                          |
| unitCost   | Decimal(10,2) | Cost at time of purchase |
| subtotal   | Decimal(10,2) | quantity × unitCost      |

#### Sale

| Field         | Type                               | Notes                       |
| ------------- | ---------------------------------- | --------------------------- |
| id            | UUID                               | PK                          |
| saleNumber    | String                             | Unique (INV-2026-0001)      |
| userId        | UUID                               | FK → User                   |
| customerName  | String?                            |                             |
| customerEmail | String?                            |                             |
| customerPhone | String?                            |                             |
| status        | Enum (DRAFT, COMPLETED, CANCELLED) |                             |
| totalAmount   | Decimal(10,2)                      |                             |
| notes         | String?                            |                             |
| completedAt   | DateTime?                          | Stock deducted on COMPLETED |
| createdAt     | DateTime                           |                             |
| updatedAt     | DateTime                           |                             |

#### SaleItem

| Field     | Type          | Notes                 |
| --------- | ------------- | --------------------- |
| id        | UUID          | PK                    |
| saleId    | UUID          | FK → Sale             |
| productId | UUID          | FK → Product          |
| quantity  | Int           |                       |
| unitPrice | Decimal(10,2) | Price at time of sale |
| subtotal  | Decimal(10,2) |                       |

#### InventoryTransaction

| Field           | Type                                                        | Notes                                   |
| --------------- | ----------------------------------------------------------- | --------------------------------------- |
| id              | UUID                                                        | PK                                      |
| productId       | UUID                                                        | FK → Product                            |
| transactionType | Enum (PURCHASE_RECEIPT, SALE_COMPLETION, MANUAL_ADJUSTMENT) | Why stock changed                       |
| quantityDelta   | Int                                                         | Signed stock movement                   |
| quantityBefore  | Int                                                         | Balance before the movement             |
| quantityAfter   | Int                                                         | Balance after the movement              |
| purchaseId      | UUID?                                                       | FK → Purchase for receipts              |
| saleId          | UUID?                                                       | FK → Sale for completed sales           |
| createdById     | UUID?                                                       | FK → User; actor for manual adjustments |
| reason          | String?                                                     | Required for manual adjustments         |
| createdAt       | DateTime                                                    | Indexed with product for stock history  |

#### ActivityLog

| Field      | Type     | Notes                                       |
| ---------- | -------- | ------------------------------------------- |
| id         | UUID     | PK                                          |
| userId     | UUID     | FK → User                                   |
| action     | Enum     | CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc. |
| entityType | String   | "Product", "Sale", "Purchase", etc.         |
| entityId   | UUID?    |                                             |
| metadata   | JSON?    | Before/after snapshots                      |
| ipAddress  | String?  |                                             |
| createdAt  | DateTime | Indexed                                     |

#### RefreshToken (optional, for token revocation)

| Field     | Type     | Notes     |
| --------- | -------- | --------- |
| id        | UUID     | PK        |
| userId    | UUID     | FK → User |
| token     | String   | Hashed    |
| expiresAt | DateTime |           |
| createdAt | DateTime |           |

### 3.3 Indexes

```sql
-- Performance-critical indexes
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_low_stock ON products(quantity, reorder_level);
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_inventory_transactions_product_created_at ON inventory_transactions(product_id, created_at);
```

### 3.4 Seed Data

- 1 Admin user (`admin@demo.com`)
- 2 Employee users
- 5 Categories (Electronics, Clothing, Food, Office, Other)
- 10 Suppliers
- 50 Products (mix of in-stock, low-stock, out-of-stock)
- 20 Purchases (various statuses)
- 30 Sales (last 90 days for chart data)
- 100 Activity log entries

---

## 4. User Roles and Permissions

### 4.1 Role Definitions

| Role         | Description                                                                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| **ADMIN**    | Full system access. Manages users, settings, and all inventory operations.                                            |
| **EMPLOYEE** | Day-to-day operations. Can manage inventory, sales, and purchases but cannot manage users or delete critical records. |

### 4.2 Permission Matrix

| Resource / Action         | Admin |     Employee     |
| ------------------------- | :---: | :--------------: |
| **Auth**                  |       |                  |
| Login / Logout            |  ✅   |        ✅        |
| Register (self)           |  ✅   |        ✅        |
| **Users**                 |       |                  |
| View all users            |  ✅   |        ❌        |
| Create user               |  ✅   |        ❌        |
| Update user / change role |  ✅   |        ❌        |
| Deactivate user           |  ✅   |        ❌        |
| **Dashboard**             |       |                  |
| View analytics            |  ✅   |        ✅        |
| **Products**              |       |                  |
| View products             |  ✅   |        ✅        |
| Create product            |  ✅   |        ✅        |
| Update product            |  ✅   |        ✅        |
| Delete product            |  ✅   |        ❌        |
| **Categories**            |       |                  |
| View categories           |  ✅   |        ✅        |
| Manage categories         |  ✅   |        ❌        |
| **Suppliers**             |       |                  |
| View suppliers            |  ✅   |        ✅        |
| Create supplier           |  ✅   |        ✅        |
| Update supplier           |  ✅   |        ✅        |
| Delete supplier           |  ✅   |        ❌        |
| **Purchases**             |       |                  |
| View purchases            |  ✅   |        ✅        |
| Create purchase           |  ✅   |        ✅        |
| Update purchase (draft)   |  ✅   |        ✅        |
| Mark as received          |  ✅   |        ✅        |
| Cancel purchase           |  ✅   |        ❌        |
| Delete purchase           |  ✅   |        ❌        |
| **Sales**                 |       |                  |
| View sales                |  ✅   |        ✅        |
| Create sale               |  ✅   |        ✅        |
| Complete sale             |  ✅   |        ✅        |
| Cancel sale               |  ✅   |        ❌        |
| Generate invoice          |  ✅   |        ✅        |
| **Activity Logs**         |       |                  |
| View all logs             |  ✅   | Own actions only |
| **Settings**              |       |                  |
| App settings              |  ✅   |        ❌        |
| Profile (own)             |  ✅   |        ✅        |

### 4.3 Implementation

- **Backend:** `rbac.middleware.ts` accepts allowed roles per route
- **Frontend:** `usePermissions()` hook + `<CanAccess role="ADMIN">` wrapper
- **JWT payload:** `{ userId, email, role }` — role checked on every protected route

---

## 5. UI Pages

### 5.1 Page Map

```
/                           → Redirect to /dashboard or /login
/login                      → Login page
/register                   → Registration page

/dashboard                  → KPI cards + charts + low stock alerts

/inventory
  /products                 → Product list (search, filter, paginate)
  /products/new             → Create product form
  /products/:id             → Product detail + edit
  /categories               → Category management (Admin only)

/suppliers
  /suppliers                → Supplier list
  /suppliers/new            → Create supplier
  /suppliers/:id            → Supplier detail + linked products

/purchases
  /purchases                → Purchase order list
  /purchases/new            → Create purchase order
  /purchases/:id            → Purchase detail + status actions

/sales
  /sales                    → Sales list
  /sales/new                → Create sale (POS-style form)
  /sales/:id                → Sale detail + invoice download

/activity                   → Activity log table (filterable)
/settings                   → Profile, theme, user management (Admin)
/*                          → 404 Not Found
```

### 5.2 Page Specifications

#### 5.2.1 Login / Register

- SaaS-quality split layout inspired by Clerk/Vercel (branding panel + form)
- Dark mode as default presentation; light mode fully supported
- Email + password with inline validation messages
- "Remember me" checkbox
- Link between login and register
- Error toast on failed auth
- Smooth mount transition on page load

#### 5.2.2 Dashboard

- **KPI Row:** Total Products, Total Stock Value, Low Stock Items, Monthly Sales
- **Charts:**
  - Line chart: Sales trend (last 30 days)
  - Bar chart: Top 5 selling products
  - Donut chart: Inventory by category
- **Low Stock Alert Table:** Products below reorder level with quick reorder link
- **Recent Activity:** Last 10 actions

#### 5.2.3 Products List

- Data table: SKU, Name, Category, Qty, Price, Status badge
- Search bar (debounced, searches name + SKU)
- Filters: Category, Stock status (All / Low / Out of stock), Active/Inactive
- Sort by: Name, Quantity, Price, Created date
- Bulk actions (Admin): Deactivate selected
- "Add Product" button → form page or slide-over drawer

#### 5.2.4 Product Detail

- View/edit product info
- Stock history chart (purchases in vs sales out)
- Linked supplier info
- Activity log for this product

#### 5.2.5 Suppliers

- Card or table view toggle
- Contact info, product count, last purchase date
- Detail page shows all products from supplier + purchase history

#### 5.2.6 Purchases

- Status badges: Draft, Ordered, Received, Cancelled
- Create flow: Select supplier → add line items → save as draft or submit
- "Mark as Received" updates product quantities atomically (transaction)

#### 5.2.7 Sales

- POS-style form: search product → add to cart → checkout
- Real-time total calculation
- Customer info (optional)
- Complete sale → deduct stock → generate invoice
- Invoice preview modal + PDF download

#### 5.2.8 Activity Log

- Filterable by: User, Action type, Entity type, Date range
- Expandable rows showing metadata diff

#### 5.2.9 Settings

- **Profile tab:** Name, email, change password
- **Appearance tab:** Light / Dark / System theme
- **Users tab (Admin):** User table, invite/create, role assignment

### 5.3 Design System

#### 5.3.1 Design Inspiration

The UI should feel like a modern SaaS product in the same league as:

| Reference            | What to borrow                                                         |
| -------------------- | ---------------------------------------------------------------------- |
| **Linear**           | Minimal chrome, precise spacing, subtle borders, focused content areas |
| **Vercel Dashboard** | Dark-first aesthetic, clean typography hierarchy, muted surfaces       |
| **Stripe Dashboard** | Professional data tables, clear status badges, confident whitespace    |
| **Clerk Dashboard**  | Polished auth pages, rounded cards, smooth component transitions       |

#### 5.3.2 Design Principles

- **Clean and minimal** — Remove visual noise; every element earns its place
- **Excellent spacing** — Generous padding inside cards; consistent gaps between sections
- **Rounded cards** — Soft corners (12px cards, 8px inputs) for a modern feel
- **Professional typography** — Clear hierarchy: page title → section heading → body → caption
- **Responsive** — Desktop-first layout that adapts cleanly to mobile via drawer nav
- **Dark mode from the beginning** — Design in dark mode first; light mode is the alternate theme
- **Smooth transitions** — Hover states, page mounts, sidebar collapse, modal open/close (150–250ms)
- **No beginner-style layouts** — No harsh blues, no cramped tables, no unstyled forms, no clip-art

#### 5.3.3 Color Tokens

| Token            | Light Mode              | Dark Mode (default)              |
| ---------------- | ----------------------- | -------------------------------- |
| Primary          | `#0070F3` (Vercel blue) | `#0070F3`                        |
| Background       | `#FAFAFA`               | `#000000` / `#09090B` (zinc-950) |
| Surface / Card   | `#FFFFFF`               | `#18181B` (zinc-900)             |
| Surface Elevated | `#F4F4F5` (zinc-100)    | `#27272A` (zinc-800)             |
| Border           | `#E4E4E7` (zinc-200)    | `#27272A` (zinc-800)             |
| Text Primary     | `#09090B` (zinc-950)    | `#FAFAFA` (zinc-50)              |
| Text Secondary   | `#71717A` (zinc-500)    | `#A1A1AA` (zinc-400)             |
| Success          | `#22C55E`               | `#4ADE80`                        |
| Warning          | `#F59E0B`               | `#FBBF24`                        |
| Danger           | `#EF4444`               | `#F87171`                        |

#### 5.3.4 Typography & Layout

- **Font:** Inter (primary) — clean, professional, used by Linear and Vercel
- **Monospace:** JetBrains Mono or Geist Mono — for SKUs, invoice numbers, code
- **Page title:** 24px / semibold
- **Section heading:** 16px / medium
- **Body:** 14px / regular
- **Caption / label:** 12px / medium, uppercase tracking for table headers
- **Border radius:** 12px (cards), 8px (inputs, buttons), 6px (badges)
- **Spacing scale:** Tailwind 4px base — prefer `p-6` cards, `gap-6` sections, `space-y-8` page sections
- **Icons:** Lucide React — 16px inline, 20px nav, consistent stroke width
- **Shadows:** Subtle in light mode (`shadow-sm`); border-based elevation in dark mode (no heavy shadows)
- **Animations:** `transition-colors duration-150`, `transition-all duration-200` on interactive elements

---

## 6. React Components

### 6.1 Layout Components

| Component    | Purpose                                                   |
| ------------ | --------------------------------------------------------- |
| `AppShell`   | Main layout wrapper with sidebar + header + content area  |
| `Sidebar`    | Navigation links with active state, collapsible on mobile |
| `Header`     | Breadcrumbs, search shortcut, theme toggle, user menu     |
| `PageHeader` | Page title, description, action buttons slot              |
| `MobileNav`  | Bottom nav or hamburger drawer for mobile                 |

### 6.2 UI Primitives (shadcn/ui)

Install via shadcn CLI: Button, Input, Label, Select, Textarea, Checkbox, Switch, Dialog, Sheet, DropdownMenu, Tabs, Badge, Card, Table, Toast, Skeleton, Avatar, Separator, Tooltip, Popover, Command (for combobox search).

### 6.3 Shared Components

| Component         | Props / Behavior                                    |
| ----------------- | --------------------------------------------------- |
| `DataTable`       | Generic table with sorting, selection, empty state  |
| `SearchInput`     | Debounced search with clear button                  |
| `Pagination`      | Page numbers + prev/next + page size selector       |
| `FilterBar`       | Composable filter chips + dropdowns                 |
| `StatCard`        | Icon, label, value, trend indicator (↑ 12%)         |
| `ConfirmDialog`   | Destructive action confirmation                     |
| `EmptyState`      | Illustration + message + CTA button                 |
| `LoadingSpinner`  | Centered spinner with optional text                 |
| `ErrorBoundary`   | Catch render errors, show fallback UI               |
| `StatusBadge`     | Colored badge for entity statuses                   |
| `StockBadge`      | Green/Yellow/Red based on quantity vs reorder level |
| `CurrencyDisplay` | Formatted currency with locale                      |
| `DateDisplay`     | Relative + absolute date formatting                 |

### 6.4 Feature Components

#### Auth

- `LoginForm`, `RegisterForm`, `ProtectedRoute`, `RoleGuard`

#### Dashboard

- `DashboardStats`, `SalesTrendChart`, `TopProductsChart`, `CategoryBreakdownChart`, `LowStockTable`, `RecentActivityFeed`

#### Inventory

- `ProductTable`, `ProductForm`, `ProductCard`, `CategorySelect`, `StockAdjustmentModal`

#### Suppliers

- `SupplierTable`, `SupplierForm`, `SupplierCard`

#### Purchases

- `PurchaseTable`, `PurchaseForm`, `PurchaseLineItems`, `PurchaseStatusActions`

#### Sales

- `SaleTable`, `SaleForm`, `SaleLineItems`, `ProductSearchCombobox`, `InvoicePreview`, `InvoiceDownloadButton`

#### Activity

- `ActivityLogTable`, `ActivityDetailDrawer`

### 6.5 Component Hierarchy Example (Sales Page)

```
SalesPage
├── PageHeader (title + "New Sale" button)
├── FilterBar (date range, status)
├── SaleTable
│   ├── StatusBadge
│   ├── CurrencyDisplay
│   └── Pagination
└── (routes to)
    SaleDetailPage
    ├── SaleLineItems
    ├── InvoicePreview
    └── InvoiceDownloadButton
```

---

## 7. Backend Architecture

### 7.1 Request Lifecycle

```
Client Request
    │
    ▼
CORS Middleware
    │
    ▼
Rate Limiter
    │
    ▼
Body Parser (JSON)
    │
    ▼
Logger Middleware
    │
    ▼
Route Handler
    │
    ├── auth.middleware (verify JWT)
    ├── rbac.middleware (check role)
    ├── validate.middleware (Zod schema)
    │
    ▼
Controller (parse request, call service, send response)
    │
    ▼
Service (business logic, transactions)
    │
    ▼
Prisma (database queries)
    │
    ▼
Response (standardized JSON envelope)
    │
    ▼
error.middleware (catch all errors)
```

### 7.2 Layer Responsibilities

| Layer             | Responsibility                                    |
| ----------------- | ------------------------------------------------- |
| **Routes**        | Define HTTP methods and paths, attach middleware  |
| **Controllers**   | Extract req params/body, call service, return res |
| **Services**      | Business logic, validation rules, transactions    |
| **Prisma**        | Data access only — no business logic              |
| **Middleware**    | Cross-cutting concerns (auth, logging, errors)    |
| **Schemas (Zod)** | Input validation shared between routes            |

### 7.3 Standard API Response Format

```json
// Success
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### 7.4 Key Business Rules

#### Stock Management

- **Purchase received:** Increment `product.quantity` by item quantity (within DB transaction)
- **Sale completed:** Decrement `product.quantity` (reject if insufficient stock)
- **Low stock:** `quantity <= reorderLevel` → flagged in dashboard query

#### Purchase Flow

```
DRAFT → ORDERED → RECEIVED
         ↓           ↓
     CANCELLED    (stock updated)
```

#### Sale Flow

```
DRAFT → COMPLETED (stock deducted, invoice generated)
  ↓
CANCELLED (only if DRAFT)
```

#### Activity Logging

- Every CREATE, UPDATE, DELETE on core entities logs to `ActivityLog`
- Login/logout events logged
- Metadata stores `{ before, after }` for updates

### 7.5 Error Handling

| HTTP Code | When                                         |
| --------- | -------------------------------------------- |
| 400       | Validation errors, bad request               |
| 401       | Missing or invalid token                     |
| 403       | Insufficient permissions                     |
| 404       | Resource not found                           |
| 409       | Conflict (duplicate SKU, insufficient stock) |
| 429       | Rate limit exceeded                          |
| 500       | Unexpected server error                      |

### 7.6 Security Measures

- Passwords hashed with bcrypt (12 rounds)
- JWT access token: 15 min expiry
- Refresh token: 7 days, stored in HTTP-only cookie
- Helmet.js for security headers
- express-rate-limit: 100 req/min per IP
- Input sanitization via Zod
- Prisma parameterized queries (SQL injection safe)
- CORS restricted to client origin

---

## 8. API Endpoints

Base URL: `/api/v1`

### 8.1 Authentication

| Method | Endpoint         | Auth           | Description              |
| ------ | ---------------- | -------------- | ------------------------ |
| POST   | `/auth/register` | Public         | Register new user        |
| POST   | `/auth/login`    | Public         | Login, return tokens     |
| POST   | `/auth/logout`   | User           | Invalidate refresh token |
| POST   | `/auth/refresh`  | Refresh cookie | Get new access token     |
| GET    | `/auth/me`       | User           | Get current user profile |
| PATCH  | `/auth/password` | User           | Change password          |

### 8.2 Users (Admin)

| Method | Endpoint     | Auth  | Description                |
| ------ | ------------ | ----- | -------------------------- |
| GET    | `/users`     | Admin | List all users (paginated) |
| POST   | `/users`     | Admin | Create user                |
| GET    | `/users/:id` | Admin | Get user by ID             |
| PATCH  | `/users/:id` | Admin | Update user                |
| DELETE | `/users/:id` | Admin | Deactivate user            |

### 8.3 Categories

| Method | Endpoint          | Auth  | Description     |
| ------ | ----------------- | ----- | --------------- |
| GET    | `/categories`     | User  | List categories |
| POST   | `/categories`     | Admin | Create category |
| PATCH  | `/categories/:id` | Admin | Update category |
| DELETE | `/categories/:id` | Admin | Delete category |

### 8.4 Products

| Method | Endpoint              | Auth  | Description                              |
| ------ | --------------------- | ----- | ---------------------------------------- |
| GET    | `/products`           | User  | List products (search, filter, paginate) |
| GET    | `/products/:id`       | User  | Get product detail                       |
| POST   | `/products`           | User  | Create product                           |
| PATCH  | `/products/:id`       | User  | Update product                           |
| DELETE | `/products/:id`       | Admin | Soft-delete product                      |
| GET    | `/products/low-stock` | User  | Products below reorder level             |
| PATCH  | `/products/:id/stock` | User  | Manual stock adjustment                  |

**Query params for GET `/products`:**
`?search=&categoryId=&status=low|out|all&sortBy=name&sortOrder=asc&page=1&limit=20`

### 8.5 Suppliers

| Method | Endpoint         | Auth  | Description             |
| ------ | ---------------- | ----- | ----------------------- |
| GET    | `/suppliers`     | User  | List suppliers          |
| GET    | `/suppliers/:id` | User  | Get supplier + products |
| POST   | `/suppliers`     | User  | Create supplier         |
| PATCH  | `/suppliers/:id` | User  | Update supplier         |
| DELETE | `/suppliers/:id` | Admin | Deactivate supplier     |

### 8.6 Purchases

| Method | Endpoint                | Auth  | Description                                |
| ------ | ----------------------- | ----- | ------------------------------------------ |
| GET    | `/purchases`            | User  | List purchases                             |
| GET    | `/purchases/:id`        | User  | Get purchase detail                        |
| POST   | `/purchases`            | User  | Create purchase (draft)                    |
| PATCH  | `/purchases/:id`        | User  | Update draft purchase                      |
| PATCH  | `/purchases/:id/status` | User  | Change status (ordered/received/cancelled) |
| DELETE | `/purchases/:id`        | Admin | Delete draft purchase                      |

### 8.7 Sales

| Method | Endpoint             | Auth | Description             |
| ------ | -------------------- | ---- | ----------------------- |
| GET    | `/sales`             | User | List sales              |
| GET    | `/sales/:id`         | User | Get sale detail         |
| POST   | `/sales`             | User | Create sale             |
| PATCH  | `/sales/:id/status`  | User | Complete or cancel sale |
| GET    | `/sales/:id/invoice` | User | Download invoice PDF    |

### 8.8 Dashboard

| Method | Endpoint                        | Auth | Description             |
| ------ | ------------------------------- | ---- | ----------------------- |
| GET    | `/dashboard/stats`              | User | KPI summary             |
| GET    | `/dashboard/sales-trend`        | User | Daily sales for chart   |
| GET    | `/dashboard/top-products`       | User | Best sellers            |
| GET    | `/dashboard/category-breakdown` | User | Stock value by category |

### 8.9 Activity Logs

| Method | Endpoint    | Auth | Description                                    |
| ------ | ----------- | ---- | ---------------------------------------------- |
| GET    | `/activity` | User | List activity logs (Admin: all, Employee: own) |

**Query params:** `?userId=&action=&entityType=&startDate=&endDate=&page=1&limit=20`

### 8.10 Health

| Method | Endpoint  | Auth   | Description              |
| ------ | --------- | ------ | ------------------------ |
| GET    | `/health` | Public | Server + DB health check |

---

## 9. Development Roadmap

> Full feature checklist with Required / Optional / Future labels: **[FEATURES.md](./FEATURES.md)**

### Phase 1: MVP — Complete Inventory System

Build the full application. No Docker. No automated tests. No AI.

#### Phase 1.0: Project Setup (Week 1)

- [ ] Initialize monorepo (client + server)
- [ ] Configure TypeScript, ESLint, Prettier, Husky
- [ ] Set up Tailwind + shadcn/ui with dark-mode-first design tokens
- [ ] Connect PostgreSQL (local install or Neon free tier — no Docker)
- [ ] Prisma schema + initial migration
- [ ] Seed script with demo data
- [ ] Environment variable validation
- [ ] Basic README

#### Phase 1.1: Authentication (Week 2)

- [ ] User model + registration/login API
- [ ] JWT access + refresh token flow
- [ ] Auth middleware + RBAC middleware
- [ ] Login/Register pages (SaaS-quality auth UI)
- [ ] Auth store + protected routes

#### Phase 1.2: Core Layout & Dashboard (Week 3)

- [ ] AppShell, Sidebar, Header components
- [ ] Dark mode as default + light mode toggle + persistence
- [ ] Dashboard API endpoints (stats, charts)
- [ ] Dashboard page with KPI cards and charts
- [ ] Low stock alerts widget
- [ ] Responsive sidebar (mobile drawer)
- [ ] Page transitions and micro-interactions

#### Phase 1.3: Inventory Management (Week 4)

- [ ] Categories CRUD (Admin)
- [ ] Products CRUD API + UI
- [ ] Product search, filter, pagination
- [ ] Product detail page
- [ ] Stock badge + low stock indicators
- [ ] Manual stock adjustment

#### Phase 1.4: Supplier Management (Week 5)

- [ ] Suppliers CRUD API + UI
- [ ] Supplier detail with linked products
- [ ] Supplier selection in product/purchase forms

#### Phase 1.5: Purchase Management (Week 6)

- [ ] Purchase CRUD API with line items
- [ ] Purchase status workflow
- [ ] Stock increment on "Received" (transaction)
- [ ] Purchase list + detail + create pages
- [ ] Auto-generated purchase numbers

#### Phase 1.6: Sales Management (Week 7)

- [ ] Sales CRUD API with line items
- [ ] Stock decrement on "Completed" (transaction)
- [ ] POS-style sale creation form
- [ ] Product search combobox
- [ ] Sale list + detail pages

#### Phase 1.7: Invoices & Activity Logs (Week 8)

- [ ] Invoice PDF generation
- [ ] Invoice preview + download
- [ ] Activity logging middleware/service
- [ ] Activity log page with filters

#### Phase 1.8: Settings & Admin (Week 9)

- [ ] User management (Admin)
- [ ] Profile settings + password change
- [ ] Role-based UI hiding (usePermissions)
- [ ] Employee activity log restriction

#### Phase 1.9: UI Polish (Week 10)

- [ ] Empty states, loading skeletons, error boundaries
- [ ] Toast notifications for all actions
- [ ] Form validation on all forms
- [ ] Accessibility audit (keyboard, contrast)
- [ ] Performance: lazy loading routes, query caching
- [ ] Final dark/light mode polish pass

#### Phase 1.10: Deployment & Documentation (Week 11)

- [ ] Deploy frontend (Vercel)
- [ ] Deploy backend (Railway/Render)
- [ ] Deploy PostgreSQL (Neon/Supabase)
- [ ] Production environment configuration
- [ ] Final README + demo credentials + screenshots

**MVP gate:** All Required features in [FEATURES.md § MVP](./FEATURES.md#mvp-features) complete and manually verified on live deployment.

---

### Phase 1.5: Advanced — Post-MVP Hardening

Implement after MVP is fully working. See [FEATURES.md § Advanced Features](./FEATURES.md#advanced-features).

- [ ] Automated testing setup (Vitest + Supertest + React Testing Library)
- [ ] Integration tests for auth, products, purchases, sales
- [ ] CI pipeline (GitHub Actions: lint, typecheck, build)
- [ ] Docker Compose for local PostgreSQL (optional)
- [ ] Docker production builds (optional)
- [ ] OpenAPI / Swagger documentation (optional)
- [ ] Optional advanced features (CSV export, password reset, etc.)

---

### Phase 2: AI Features

> **Do not start until MVP gate is passed.** See [FEATURES.md § AI Features](./FEATURES.md#ai-features).

- [ ] AI service abstraction layer (`AIService`)
- [ ] Chat assistant page
- [ ] Natural language query interface
- [ ] Inventory recommendation engine (optional)
- [ ] Automated sales summaries (optional)

---

### Phase 3: Future Enhancements

See [FEATURES.md § Future Enhancements](./FEATURES.md#future-enhancements). Not planned for initial portfolio release.

---

## 10. Git Commit Strategy

### 10.1 Branching Model (GitHub Flow)

```
main          ← Production-ready, always deployable
  │
  ├── feat/auth-login
  ├── feat/product-crud
  ├── feat/dashboard-analytics
  ├── fix/stock-deduction-bug
  └── chore/setup-eslint
```

- **`main`:** Protected branch, requires PR + CI pass
- **Feature branches:** `feat/<short-description>`
- **Bug fixes:** `fix/<short-description>`
- **Chores:** `chore/<short-description>`
- **Docs:** `docs/<short-description>`

### 10.2 Commit Message Convention (Conventional Commits)

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**

| Type       | Usage                       |
| ---------- | --------------------------- |
| `feat`     | New feature                 |
| `fix`      | Bug fix                     |
| `docs`     | Documentation only          |
| `style`    | Formatting, no code change  |
| `refactor` | Code change, no feature/fix |
| `test`     | Adding/updating tests       |
| `chore`    | Build, deps, config         |
| `perf`     | Performance improvement     |

**Examples:**

```
feat(auth): add JWT login and refresh token flow
feat(products): implement product CRUD with pagination
fix(sales): prevent sale when insufficient stock
refactor(dashboard): extract chart components
test(auth): add login integration tests
chore(deps): upgrade prisma to 5.x
docs(readme): add setup and deployment instructions
```

### 10.3 Pull Request Guidelines

- **Title:** Same format as commit messages
- **Description template:**
  ```markdown
  ## Summary

  - Bullet points of changes

  ## Test plan

  - [ ] Manual test steps
  - [ ] Automated tests pass

  ## Screenshots (if UI change)
  ```
- **Size:** Keep PRs small (< 400 lines changed when possible)
- **Review:** Self-review before requesting merge

### 10.4 Recommended Commit Sequence (First 20 Commits)

1. `chore: initialize monorepo with client and server packages`
2. `chore: configure eslint, prettier, and husky pre-commit hooks`
3. `feat(db): add prisma schema with all entities`
4. `feat(db): add seed script with demo data`
5. `feat(server): set up express app with middleware stack`
6. `feat(auth): implement register and login endpoints`
7. `feat(auth): add JWT middleware and refresh token flow`
8. `feat(client): scaffold react app with tailwind and shadcn/ui`
9. `feat(client): add dark-mode-first design tokens and theme setup`
10. `feat(client): add login and register pages`
11. `feat(client): implement auth store and protected routes`
12. `feat(client): build app shell with sidebar and header`
13. `feat(dashboard): add dashboard API endpoints`
14. `feat(dashboard): build dashboard page with charts`
15. `feat(products): implement product CRUD API`
16. `feat(products): build product list and form pages`
17. `feat(suppliers): implement supplier CRUD API and UI`
18. `feat(purchases): implement purchase management with stock updates`
19. `feat(sales): implement sales management with invoice generation`
20. `chore: deploy mvp to vercel and railway`

---

## 11. Deployment Strategy

### 11.1 Architecture (Production)

```
                    ┌─────────────┐
                    │   Vercel    │
                    │  (Frontend) │
                    └──────┬──────┘
                           │ HTTPS
                    ┌──────▼──────┐
                    │ Railway /   │
                    │ Render      │
                    │ (Backend)   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Neon /      │
                    │ Supabase    │
                    │ (PostgreSQL)│
                    └─────────────┘
```

### 11.2 Development Database (MVP)

During MVP development, use one of:

| Option                 | Setup                               | Notes                                     |
| ---------------------- | ----------------------------------- | ----------------------------------------- |
| **Local PostgreSQL**   | Install via Homebrew / Postgres.app | Fastest for daily dev; no Docker needed   |
| **Neon free tier**     | Create project at neon.tech         | Cloud DB from day one; same as production |
| **Supabase free tier** | Create project at supabase.com      | Includes PostgreSQL + optional extras     |

> **Docker is deferred** until Phase 1.5. Do not block MVP development on container setup.

### 11.3 Recommended Services (Free Tier Friendly)

| Service      | Provider                  | Free Tier       | Purpose                  |
| ------------ | ------------------------- | --------------- | ------------------------ |
| Frontend     | **Vercel**                | Unlimited hobby | React static/SSR hosting |
| Backend      | **Railway** or **Render** | 500 hrs/mo      | Node.js API              |
| Database     | **Neon** or **Supabase**  | 0.5 GB storage  | PostgreSQL               |
| File Storage | **Cloudinary** (future)   | 25 GB           | Product images           |

### 11.4 Environment Variables

#### Server (`.env`)

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/sims
JWT_ACCESS_SECRET=<random-64-char-string>
JWT_REFRESH_SECRET=<random-64-char-string>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=https://sims.vercel.app
```

#### Client (`.env`)

```env
VITE_API_URL=https://sims-api.railway.app/api/v1
```

### 11.5 Docker Setup (Phase 1.5 — Post-MVP)

Docker is **not used during MVP development**. When ready (Phase 1.5), add:

**docker-compose.yml (Development):**

```yaml
services:
  postgres:
    image: postgres:16
    ports: ['5432:5432']
    environment:
      POSTGRES_USER: sims
      POSTGRES_PASSWORD: sims
      POSTGRES_DB: sims
    volumes:
      - pgdata:/var/lib/postgresql/data

  server:
    build: ./docker/Dockerfile.server
    ports: ['5000:5000']
    depends_on: [postgres]
    env_file: ./server/.env

volumes:
  pgdata:
```

### 11.6 CI/CD Pipeline (Phase 1.5 — Post-MVP)

Automated CI is deferred until after MVP. When ready:

**On Pull Request (`ci.yml`):**

1. Install dependencies
2. Run ESLint
3. Run TypeScript type check
4. Run tests (Vitest + Supertest) — added in Phase 1.5
5. Build client and server

**On Merge to Main (`deploy.yml`):**

1. Run CI checks
2. Deploy server to Railway (auto-deploy via GitHub integration)
3. Deploy client to Vercel (auto-deploy via GitHub integration)
4. Run Prisma migrations on production DB

**MVP deployment:** Manual deploy to Vercel + Railway via GitHub integration (no CI required).

### 11.7 Database Migrations (Production)

```bash
# Run migrations before deploying new server version
npx prisma migrate deploy
```

- Migrations run as part of deploy script
- Never use `prisma db push` in production
- Always test migrations on staging first

### 11.8 Domain & SSL

- Frontend: `sims.vercel.app` (or custom domain)
- Backend: `sims-api.railway.app`
- SSL handled automatically by Vercel and Railway

---

## 12. Suggested Project Timeline

### 12.1 Overview (11 Weeks — MVP Only)

Assumes ~15–20 hours/week. Covers Phase 1 (MVP) only. Phase 1.5 (tests, Docker) and Phase 2 (AI) are additional.

| Week      | Phase              | Deliverable                                | Hours        |
| --------- | ------------------ | ------------------------------------------ | ------------ |
| 1         | Setup              | Monorepo, DB (local/Neon), seed data       | 15           |
| 2         | Auth               | Login/register, JWT, protected routes      | 18           |
| 3         | Layout + Dashboard | App shell, dark-first UI, dashboard charts | 20           |
| 4         | Inventory          | Products + categories CRUD                 | 18           |
| 5         | Suppliers          | Supplier management                        | 12           |
| 6         | Purchases          | Purchase orders + stock increment          | 18           |
| 7         | Sales              | Sales + stock decrement                    | 18           |
| 8         | Invoices + Logs    | PDF invoices, activity logging             | 15           |
| 9         | Admin + Settings   | User management, permissions UI            | 12           |
| 10        | UI Polish          | Empty states, skeletons, accessibility     | 18           |
| 11        | Deploy + Docs      | Production deployment, README, demo        | 12           |
| **Total** |                    | **MVP Complete**                           | **~176 hrs** |

| Post-MVP   | Phase                         | Est. Hours |
| ---------- | ----------------------------- | ---------- |
| +1–2 weeks | Phase 1.5 — Tests, CI, Docker | ~20 hrs    |
| +2–3 weeks | Phase 2 — AI features         | ~30 hrs    |

### 12.2 Milestones

| Milestone            | Target Week | Demo-able State                                           |
| -------------------- | ----------- | --------------------------------------------------------- |
| **M1: Foundation**   | Week 2      | Login works, empty dashboard behind auth                  |
| **M2: Core UI**      | Week 4      | Dashboard + full product management                       |
| **M3: Operations**   | Week 7      | Purchases and sales with stock updates                    |
| **M4: Complete MVP** | Week 10     | All Required features polished; dark/light modes complete |
| **M5: Live Demo**    | Week 11     | Deployed app with demo data on portfolio                  |
| **M6: Hardened**     | Week 12–13  | Automated tests + CI (Phase 1.5)                          |
| **M7: AI Enabled**   | Week 14–16  | AI assistant live (Phase 2 — only after M5)               |

### 12.3 Weekly Breakdown (Detailed)

#### Week 1 — Project Setup

- Day 1–2: Initialize repos, install dependencies, configure tooling
- Day 3–4: Prisma schema, migrations, seed script
- Day 5–7: Express boilerplate, health check, connect PostgreSQL (local or Neon)

#### Week 2 — Authentication

- Day 1–3: Auth API (register, login, refresh, middleware)
- Day 4–5: Login/Register UI pages (SaaS-quality design)
- Day 6–7: Auth state management, protected routes

#### Week 3 — Layout & Dashboard

- Day 1–2: AppShell, Sidebar, Header, mobile responsive
- Day 3: Dark-mode-first theme + light mode toggle
- Day 4–5: Dashboard API (stats, chart data)
- Day 6–7: Dashboard UI with Recharts + transitions

#### Week 4 — Inventory

- Day 1–2: Categories API + admin UI
- Day 3–5: Products CRUD API
- Day 6–7: Products list, form, detail pages

#### Week 5 — Suppliers

- Day 1–3: Supplier CRUD API + UI
- Day 4–5: Supplier detail page, link to products
- Day 6–7: Buffer / catch-up

#### Week 6 — Purchases

- Day 1–3: Purchase API with line items and status workflow
- Day 4–5: Purchase UI (list, create, detail)
- Day 6–7: Stock increment logic + manual verification

#### Week 7 — Sales

- Day 1–3: Sales API with line items and stock deduction
- Day 4–5: POS-style sale creation UI
- Day 6–7: Sale list and detail pages

#### Week 8 — Invoices & Activity

- Day 1–3: PDF invoice generation
- Day 4–5: Activity logging service + middleware
- Day 6–7: Activity log page

#### Week 9 — Admin & Settings

- Day 1–3: User management (Admin)
- Day 4–5: Settings page (profile, theme)
- Day 6–7: Permission-based UI visibility

#### Week 10 — UI Polish

- Day 1–2: Loading states, empty states, error handling
- Day 3–4: Accessibility audit, animation polish, dark/light pass
- Day 5–7: Performance, lazy routes, final bug fixes

#### Week 11 — Deployment

- Day 1–2: Deploy to Vercel + Railway + Neon; configure env vars
- Day 3–4: Run production migrations; verify all flows on live URL
- Day 5–7: README, screenshots, demo video prep for portfolio

### 12.4 Risk Mitigation

| Risk                   | Mitigation                                                         |
| ---------------------- | ------------------------------------------------------------------ |
| Scope creep            | Stick to Required MVP features in FEATURES.md; defer AI to Phase 2 |
| UI looks amateur       | Follow §5.3 design system; reference Linear/Vercel/Stripe/Clerk    |
| Database complexity    | Use Prisma migrations; test with seed data early                   |
| Time constraints       | Prioritize core flows (auth → products → sales)                    |
| Deployment issues      | Deploy by Week 11; use Vercel + Railway GitHub integrations        |
| Premature optimization | No Docker, no tests, no AI until MVP gate is passed                |
| UI inconsistency       | Use shadcn/ui components; define design tokens in Week 1           |

### 12.5 Portfolio Presentation Tips

- **Live demo URL** in README and resume — this is the #1 portfolio asset
- **Demo credentials:** `admin@demo.com` / `employee@demo.com`
- **Architecture diagram** in README showing clean module structure
- **Screenshots** of dashboard (dark mode), sales flow, mobile responsive view
- **2-minute demo video** (Loom/YouTube) showing key flows
- **Highlight on resume:** Full-stack TypeScript, RBAC, Prisma transactions, PDF generation, SaaS UI
- **GitHub README badges:** Live demo link, tech stack icons, screenshot hero image
- **Code quality signal:** Clean folder structure, consistent commits, no `any` types

---

## Appendix A: AI Architecture (Phase 2 Preview)

> **Do not implement until MVP is complete.** See [FEATURES.md § AI Features](./FEATURES.md#ai-features) for gate criteria.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  AI Chat UI  │────▶│  AI Service  │────▶│  LLM Provider│
│  (React)     │     │  (Abstract)  │     │  (OpenAI/etc)│
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────▼───────┐
                     │  Tool Calls   │
                     │  (Query DB,   │
                     │   Get Stats)  │
                     └──────────────┘
```

The `AIService` will expose methods like:

- `chat(message, context)` → conversational response
- `getRecommendations()` → reorder suggestions
- `generateSummary(period)` → sales report
- `naturalLanguageQuery(query)` → structured data response

This keeps the AI layer decoupled from core business logic.

---

## Appendix B: Key Dependencies

### Client

```json
{
  "react": "^18.3.0",
  "react-router-dom": "^6.26.0",
  "@tanstack/react-query": "^5.56.0",
  "zustand": "^4.5.0",
  "react-hook-form": "^7.53.0",
  "zod": "^3.23.0",
  "axios": "^1.7.0",
  "recharts": "^2.12.0",
  "lucide-react": "^0.441.0",
  "tailwindcss": "^3.4.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```

### Server

```json
{
  "express": "^4.21.0",
  "@prisma/client": "^5.20.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "zod": "^3.23.0",
  "helmet": "^7.1.0",
  "cors": "^2.8.5",
  "express-rate-limit": "^7.4.0",
  "cookie-parser": "^1.4.6",
  "pdfkit": "^0.15.0",
  "winston": "^3.14.0"
}
```

---

_This plan is a living document. Feature scope is defined in [FEATURES.md](./FEATURES.md). Task breakdown is in [TASKS.md](./TASKS.md)._
