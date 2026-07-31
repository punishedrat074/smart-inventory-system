CREATE TYPE "user_roles" AS ENUM ('ADMIN', 'EMPLOYEE');
CREATE TYPE "purchase_statuses" AS ENUM ('DRAFT', 'ORDERED', 'RECEIVED', 'CANCELLED');
CREATE TYPE "sale_statuses" AS ENUM ('DRAFT', 'COMPLETED', 'CANCELLED');
CREATE TYPE "inventory_transaction_types" AS ENUM ('PURCHASE_RECEIPT', 'SALE_COMPLETION', 'MANUAL_ADJUSTMENT');
CREATE TYPE "activity_actions" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'STOCK_ADJUSTMENT');

CREATE TABLE "users" (
  "id" UUID NOT NULL, "email" VARCHAR(255) NOT NULL, "password_hash" VARCHAR(255) NOT NULL,
  "first_name" VARCHAR(100) NOT NULL, "last_name" VARCHAR(100) NOT NULL,
  "role" "user_roles" NOT NULL DEFAULT 'EMPLOYEE', "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "categories" (
  "id" UUID NOT NULL, "name" VARCHAR(120) NOT NULL, "description" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "suppliers" (
  "id" UUID NOT NULL, "name" VARCHAR(160) NOT NULL, "contact_person" VARCHAR(160), "email" VARCHAR(255),
  "phone" VARCHAR(50), "address" TEXT, "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "products" (
  "id" UUID NOT NULL, "sku" VARCHAR(100) NOT NULL, "name" VARCHAR(200) NOT NULL, "description" TEXT,
  "category_id" UUID NOT NULL, "supplier_id" UUID, "unit_price" DECIMAL(12,2) NOT NULL,
  "cost_price" DECIMAL(12,2) NOT NULL, "quantity" INTEGER NOT NULL DEFAULT 0,
  "reorder_level" INTEGER NOT NULL DEFAULT 0, "reorder_quantity" INTEGER, "unit" VARCHAR(32) NOT NULL DEFAULT 'pcs',
  "is_active" BOOLEAN NOT NULL DEFAULT true, "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL, CONSTRAINT "products_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "products_non_negative_values" CHECK ("unit_price" >= 0 AND "cost_price" >= 0 AND "quantity" >= 0 AND "reorder_level" >= 0 AND ("reorder_quantity" IS NULL OR "reorder_quantity" >= 0))
);
CREATE TABLE "purchases" (
  "id" UUID NOT NULL, "purchase_number" VARCHAR(50) NOT NULL, "supplier_id" UUID NOT NULL, "created_by_id" UUID NOT NULL,
  "status" "purchase_statuses" NOT NULL DEFAULT 'DRAFT', "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0, "notes" TEXT,
  "ordered_at" TIMESTAMPTZ(6), "received_at" TIMESTAMPTZ(6), "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL, CONSTRAINT "purchases_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "purchases_non_negative_total" CHECK ("total_amount" >= 0)
);
CREATE TABLE "purchase_items" (
  "id" UUID NOT NULL, "purchase_id" UUID NOT NULL, "product_id" UUID NOT NULL, "quantity" INTEGER NOT NULL,
  "unit_cost" DECIMAL(12,2) NOT NULL, "subtotal" DECIMAL(12,2) NOT NULL,
  CONSTRAINT "purchase_items_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "purchase_items_valid_values" CHECK ("quantity" > 0 AND "unit_cost" >= 0 AND "subtotal" >= 0)
);
CREATE TABLE "sales" (
  "id" UUID NOT NULL, "sale_number" VARCHAR(50) NOT NULL, "created_by_id" UUID NOT NULL,
  "customer_name" VARCHAR(160), "customer_email" VARCHAR(255), "customer_phone" VARCHAR(50),
  "status" "sale_statuses" NOT NULL DEFAULT 'DRAFT', "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0, "notes" TEXT,
  "completed_at" TIMESTAMPTZ(6), "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL, CONSTRAINT "sales_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "sales_non_negative_total" CHECK ("total_amount" >= 0)
);
CREATE TABLE "sale_items" (
  "id" UUID NOT NULL, "sale_id" UUID NOT NULL, "product_id" UUID NOT NULL, "quantity" INTEGER NOT NULL,
  "unit_price" DECIMAL(12,2) NOT NULL, "subtotal" DECIMAL(12,2) NOT NULL,
  CONSTRAINT "sale_items_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "sale_items_valid_values" CHECK ("quantity" > 0 AND "unit_price" >= 0 AND "subtotal" >= 0)
);
CREATE TABLE "inventory_transactions" (
  "id" UUID NOT NULL, "product_id" UUID NOT NULL, "transaction_type" "inventory_transaction_types" NOT NULL,
  "quantity_delta" INTEGER NOT NULL, "quantity_before" INTEGER NOT NULL, "quantity_after" INTEGER NOT NULL,
  "purchase_id" UUID, "sale_id" UUID, "created_by_id" UUID, "reason" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "inventory_transactions_balance" CHECK ("quantity_before" >= 0 AND "quantity_after" >= 0 AND "quantity_after" = "quantity_before" + "quantity_delta"),
  CONSTRAINT "inventory_transactions_source" CHECK (("transaction_type" = 'PURCHASE_RECEIPT' AND "purchase_id" IS NOT NULL AND "sale_id" IS NULL AND "quantity_delta" > 0) OR ("transaction_type" = 'SALE_COMPLETION' AND "sale_id" IS NOT NULL AND "purchase_id" IS NULL AND "quantity_delta" < 0) OR ("transaction_type" = 'MANUAL_ADJUSTMENT' AND "purchase_id" IS NULL AND "sale_id" IS NULL AND "reason" IS NOT NULL AND "quantity_delta" <> 0))
);
CREATE TABLE "activity_logs" (
  "id" UUID NOT NULL, "user_id" UUID, "action" "activity_actions" NOT NULL, "entity_type" VARCHAR(100) NOT NULL,
  "entity_id" UUID, "metadata" JSONB, "ip_address" INET,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "refresh_tokens" (
  "id" UUID NOT NULL, "user_id" UUID NOT NULL, "token_hash" VARCHAR(255) NOT NULL,
  "expires_at" TIMESTAMPTZ(6) NOT NULL, "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_is_active_idx" ON "users"("is_active");
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
CREATE INDEX "suppliers_name_idx" ON "suppliers"("name");
CREATE INDEX "suppliers_is_active_idx" ON "suppliers"("is_active");
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");
CREATE INDEX "products_name_idx" ON "products"("name");
CREATE INDEX "products_category_id_idx" ON "products"("category_id");
CREATE INDEX "products_supplier_id_idx" ON "products"("supplier_id");
CREATE INDEX "products_is_active_idx" ON "products"("is_active");
CREATE INDEX "products_quantity_reorder_level_idx" ON "products"("quantity", "reorder_level");
CREATE UNIQUE INDEX "purchases_purchase_number_key" ON "purchases"("purchase_number");
CREATE INDEX "purchases_supplier_id_idx" ON "purchases"("supplier_id");
CREATE INDEX "purchases_created_by_id_idx" ON "purchases"("created_by_id");
CREATE INDEX "purchases_status_created_at_idx" ON "purchases"("status", "created_at");
CREATE UNIQUE INDEX "purchase_items_purchase_id_product_id_key" ON "purchase_items"("purchase_id", "product_id");
CREATE INDEX "purchase_items_product_id_idx" ON "purchase_items"("product_id");
CREATE UNIQUE INDEX "sales_sale_number_key" ON "sales"("sale_number");
CREATE INDEX "sales_created_by_id_idx" ON "sales"("created_by_id");
CREATE INDEX "sales_status_created_at_idx" ON "sales"("status", "created_at");
CREATE INDEX "sales_completed_at_idx" ON "sales"("completed_at");
CREATE UNIQUE INDEX "sale_items_sale_id_product_id_key" ON "sale_items"("sale_id", "product_id");
CREATE INDEX "sale_items_product_id_idx" ON "sale_items"("product_id");
CREATE INDEX "inventory_transactions_product_id_created_at_idx" ON "inventory_transactions"("product_id", "created_at");
CREATE INDEX "inventory_transactions_purchase_id_idx" ON "inventory_transactions"("purchase_id");
CREATE INDEX "inventory_transactions_sale_id_idx" ON "inventory_transactions"("sale_id");
CREATE INDEX "inventory_transactions_created_by_id_created_at_idx" ON "inventory_transactions"("created_by_id", "created_at");
CREATE INDEX "activity_logs_user_id_created_at_idx" ON "activity_logs"("user_id", "created_at");
CREATE INDEX "activity_logs_entity_type_entity_id_idx" ON "activity_logs"("entity_type", "entity_id");
CREATE INDEX "activity_logs_action_created_at_idx" ON "activity_logs"("action", "created_at");
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");
CREATE INDEX "refresh_tokens_user_id_expires_at_idx" ON "refresh_tokens"("user_id", "expires_at");
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sales" ADD CONSTRAINT "sales_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
