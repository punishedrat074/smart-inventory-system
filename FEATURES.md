# Smart Inventory Management System — Feature Specification

> **Purpose:** Single source of truth for what we build, when we build it, and how important each feature is.  
> **Related docs:** [PROJECT_PLAN.md](./PROJECT_PLAN.md) · [TASKS.md](./TASKS.md)

---

## Priority Labels

| Label | Meaning |
|-------|---------|
| **Required** | Must ship in MVP. The application is incomplete without it. |
| **Optional** | Enhances the product but can be deferred within MVP if time is tight. |
| **Future** | Post-MVP. Do not implement until the core system is fully working. |

---

## MVP Features

Core inventory management system — **Phase 1**. No AI. No Docker. No automated tests until MVP is complete.

### Authentication & Access

| Feature | Priority | Description |
|---------|----------|-------------|
| User registration | **Required** | New users can create an account with email and password |
| User login / logout | **Required** | Secure session via JWT access + refresh tokens |
| Password change | **Required** | Authenticated users can update their password |
| JWT refresh flow | **Required** | Silent token refresh without re-login |
| Role-based access control (Admin & Employee) | **Required** | Backend middleware + frontend permission guards |
| Protected routes | **Required** | Unauthenticated users redirected to login |
| Profile management | **Required** | Update name and view account info in Settings |

### Dashboard & Analytics

| Feature | Priority | Description |
|---------|----------|-------------|
| KPI summary cards | **Required** | Total products, stock value, low stock count, monthly sales |
| Sales trend chart | **Required** | Line chart — last 30 days |
| Top products chart | **Required** | Bar chart — top 5 best sellers |
| Category breakdown chart | **Required** | Donut chart — inventory value by category |
| Low stock alerts widget | **Required** | Table of products at or below reorder level |
| Recent activity feed | **Optional** | Last 10 actions on dashboard (full log on Activity page) |

### Inventory Management

| Feature | Priority | Description |
|---------|----------|-------------|
| Product CRUD | **Required** | Create, read, update products |
| Product soft delete | **Required** | Admin can deactivate products |
| Category management | **Required** | Admin CRUD for product categories |
| SKU management | **Required** | Unique SKU per product |
| Stock quantity tracking | **Required** | Real-time quantity on each product |
| Reorder level threshold | **Required** | Configurable low-stock threshold per product |
| Manual stock adjustment | **Required** | Adjust quantity with reason (Admin/Employee) |
| Product search | **Required** | Search by name and SKU |
| Product filtering | **Required** | Filter by category, stock status, active/inactive |
| Product sorting & pagination | **Required** | Sortable columns with paginated results |
| Product detail page | **Required** | View/edit single product with supplier link |
| Stock status badges | **Required** | Visual indicators: in stock / low / out of stock |

### Supplier Management

| Feature | Priority | Description |
|---------|----------|-------------|
| Supplier CRUD | **Required** | Create, read, update suppliers |
| Supplier soft deactivate | **Required** | Admin can deactivate suppliers |
| Supplier detail page | **Required** | Contact info, linked products, purchase history |
| Supplier search & pagination | **Required** | List with search and pagination |
| Default supplier on product | **Optional** | Link a preferred supplier to each product |

### Purchase Management

| Feature | Priority | Description |
|---------|----------|-------------|
| Purchase order CRUD | **Required** | Create and manage purchase orders |
| Purchase line items | **Required** | Multiple products per purchase order |
| Purchase status workflow | **Required** | Draft → Ordered → Received → Cancelled |
| Auto-generated PO numbers | **Required** | Format: `PO-YYYY-NNNN` |
| Stock increment on receive | **Required** | Atomic stock update when marked Received |
| Purchase list & detail pages | **Required** | Full UI for viewing and managing POs |
| Purchase notes | **Optional** | Free-text notes on purchase orders |

### Sales Management

| Feature | Priority | Description |
|---------|----------|-------------|
| Sale CRUD | **Required** | Create and manage sales |
| Sale line items | **Required** | Multiple products per sale |
| POS-style sale form | **Required** | Search product → add to cart → checkout |
| Sale status workflow | **Required** | Draft → Completed → Cancelled |
| Auto-generated sale/invoice numbers | **Required** | Format: `INV-YYYY-NNNN` |
| Stock decrement on complete | **Required** | Atomic stock deduction; reject if insufficient |
| Insufficient stock validation | **Required** | Block sale completion when stock is too low |
| Customer info (optional fields) | **Optional** | Name, email, phone on sale record |
| Sale list & detail pages | **Required** | Full UI for viewing and managing sales |

### Invoices

| Feature | Priority | Description |
|---------|----------|-------------|
| Invoice PDF generation | **Required** | Download PDF for completed sales |
| Invoice preview | **Optional** | In-app preview before download |

### Activity Logs

| Feature | Priority | Description |
|---------|----------|-------------|
| Audit logging (CREATE/UPDATE/DELETE) | **Required** | Log changes on products, purchases, sales |
| Login/logout logging | **Required** | Auth events recorded |
| Activity log page | **Required** | Filterable table with pagination |
| Admin sees all logs | **Required** | Full visibility for Admin role |
| Employee sees own logs | **Required** | Scoped visibility for Employee role |
| Metadata diff on updates | **Optional** | Before/after snapshot in log detail |

### UI / UX (MVP)

| Feature | Priority | Description |
|---------|----------|-------------|
| Modern SaaS design system | **Required** | Linear / Vercel / Stripe / Clerk aesthetic |
| Dark mode (default-ready) | **Required** | Built from day one, not bolted on later |
| Light mode | **Required** | Full light theme with matching polish |
| Responsive layout (desktop + mobile) | **Required** | Collapsible sidebar, mobile drawer nav |
| Loading skeletons | **Required** | Skeleton states on all data-fetching views |
| Empty states | **Required** | Illustrated empty states with CTAs |
| Toast notifications | **Required** | Success/error feedback on all mutations |
| Form validation | **Required** | React Hook Form + Zod on all forms |
| Smooth transitions & animations | **Required** | Page transitions, hover states, micro-interactions |
| Error boundary | **Required** | Graceful fallback on render errors |
| 404 page | **Required** | Styled not-found page |

### Admin & Settings

| Feature | Priority | Description |
|---------|----------|-------------|
| User management (Admin) | **Required** | Create, update, deactivate users; assign roles |
| Settings page (tabbed) | **Required** | Profile, appearance, users (Admin) |
| Permission-based UI hiding | **Required** | Hide/disable actions user cannot perform |

### Backend & Infrastructure (MVP)

| Feature | Priority | Description |
|---------|----------|-------------|
| REST API (`/api/v1`) | **Required** | Versioned REST endpoints |
| PostgreSQL + Prisma ORM | **Required** | Local or cloud PostgreSQL (no Docker in MVP) |
| Environment variable validation | **Required** | Zod-validated config at startup |
| Standardized API responses | **Required** | Consistent success/error envelope |
| Global error handling | **Required** | Centralized error middleware |
| Request logging | **Required** | Structured logs for all requests |
| Health check endpoint | **Required** | `GET /health` with DB connectivity check |
| Database seed script | **Required** | Demo data for portfolio demo |
| CORS, Helmet, rate limiting | **Required** | Security middleware stack |

### Deployment (MVP)

| Feature | Priority | Description |
|---------|----------|-------------|
| Production deployment | **Required** | Live demo URL for portfolio |
| README with setup instructions | **Required** | Local dev setup in under 15 minutes |
| Demo credentials documented | **Required** | `admin@demo.com` / `employee@demo.com` |
| API documentation | **Optional** | Swagger/OpenAPI spec |

---

## Advanced Features

Post-MVP polish and production hardening — implement **after MVP is fully working**, before AI.

| Feature | Priority | Description |
|---------|----------|-------------|
| Automated testing (Vitest + Supertest) | **Required** | Unit and integration tests for critical flows |
| CI pipeline (lint + typecheck + build) | **Required** | GitHub Actions on pull requests |
| Docker Compose (local dev) | **Optional** | Containerized PostgreSQL and app services |
| Docker production builds | **Optional** | Dockerfile for client and server |
| Password reset via email | **Optional** | Forgot-password flow with email token |
| Bulk product actions | **Optional** | Bulk deactivate, bulk category assign (Admin) |
| Product image upload | **Optional** | Cloudinary or S3 integration |
| Export to CSV | **Optional** | Export products, sales, purchases as CSV |
| Advanced dashboard date filters | **Optional** | Custom date range for charts |
| Stock history chart on product detail | **Optional** | Purchases in vs sales out over time |
| Keyboard shortcuts | **Optional** | Quick navigation (e.g., `/` for search) |
| OpenAPI / Swagger UI | **Optional** | Interactive API docs at `/api/docs` |
| E2E tests (Playwright) | **Future** | Browser-level test suite |
| Multi-warehouse / multi-location | **Future** | Stock per location |
| Email notifications (low stock) | **Future** | Alert admins when stock drops below threshold |
| Audit log export | **Future** | Download activity logs as CSV/JSON |

---

## AI Features

**Phase 2 only.** Do not implement any AI functionality until the complete inventory management system (MVP + Advanced, if chosen) is fully working and deployed.

> **Gate criteria before starting AI:** All Required MVP features complete · App deployed with live demo · Core flows manually verified (auth, products, purchases, sales, invoices, activity logs).

| Feature | Priority | Description |
|---------|----------|-------------|
| AI service abstraction layer | **Required** | Provider-agnostic `AIService` interface (OpenAI, Anthropic, etc.) |
| AI inventory assistant (chat) | **Required** | Conversational chatbot for inventory questions |
| Natural language queries | **Required** | "Show me low stock items in Electronics" → structured results |
| Inventory reorder recommendations | **Optional** | Suggest reorder quantities based on sales velocity |
| Automated sales summaries | **Optional** | AI-generated weekly/monthly report narratives |
| Smart search (semantic) | **Optional** | Natural language product/supplier search |
| Anomaly detection alerts | **Future** | Flag unusual stock movements or sales patterns |
| Demand forecasting | **Future** | Predict future stock needs from historical data |
| AI-powered invoice insights | **Future** | Summarize outstanding sales and payment trends |

---

## Future Enhancements

Long-term product vision — not planned for initial portfolio release.

| Feature | Priority | Description |
|---------|----------|-------------|
| Multi-tenant / organization support | **Future** | Separate inventories per business/tenant |
| Team permissions (granular RBAC) | **Future** | Custom roles beyond Admin/Employee |
| Barcode / QR scanning | **Future** | Mobile scan to lookup or adjust stock |
| Mobile app (React Native) | **Future** | Native mobile client |
| Real-time updates (WebSockets) | **Future** | Live stock changes across sessions |
| Integration APIs (webhooks) | **Future** | Notify external systems on stock events |
| Accounting integration | **Future** | QuickBooks, Xero export/sync |
| Purchase order email to supplier | **Future** | Send PO PDF directly to supplier |
| Recurring purchase orders | **Future** | Scheduled automatic PO generation |
| Inventory valuation methods | **Future** | FIFO, LIFO, weighted average costing |
| Custom report builder | **Future** | User-defined reports and dashboards |
| White-label / custom branding | **Future** | Business logo and color theming |
| Offline mode (PWA) | **Future** | Work without connectivity, sync later |
| Internationalization (i18n) | **Future** | Multi-language UI support |

---

## Feature Phase Map

```
Phase 1 — MVP (build now)
├── All "MVP Features" marked Required
└── Optional MVP items as time allows

Phase 1.5 — Advanced (after MVP complete)
├── Automated testing
├── CI pipeline
├── Docker (optional)
└── Optional advanced features

Phase 2 — AI (strict gate: MVP must be 100% working)
├── AI service layer
├── Chat assistant
├── NL queries
└── Optional AI features

Phase 3 — Future Enhancements
└── Multi-tenant, mobile, integrations, etc.
```

---

## Out of Scope (Explicitly Excluded from MVP)

- Docker / containerization
- Automated test suites
- Any AI or LLM integration
- Email sending (password reset, notifications)
- Product image uploads
- Multi-tenant architecture
- Mobile native apps
- Payment processing

---

*Last updated: July 24, 2026*
