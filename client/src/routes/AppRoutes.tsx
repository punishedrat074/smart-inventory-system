import {
  AlertCircle,
  FolderTree,
  LogOut,
  Package,
  Plus,
  Receipt,
  RefreshCw,
  Settings,
  ShoppingBag,
  Truck,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import type { ColumnDef } from '@/components/shared/DataTable';
import { DataTable } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDebounce } from '@/hooks/useDebounce';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicRoute } from '@/routes/PublicRoute';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils';

// ─── Sample Product Type for Task 31 Verification ────────────────────────────
interface DemoProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

const SAMPLE_PRODUCTS: DemoProduct[] = [
  {
    id: '1',
    sku: 'SKU-1001',
    name: 'Wireless Ergonomic Mouse',
    category: 'Electronics',
    stock: 142,
    price: 49.99,
    status: 'IN_STOCK',
  },
  {
    id: '2',
    sku: 'SKU-1002',
    name: 'Mechanical RGB Keyboard',
    category: 'Electronics',
    stock: 8,
    price: 129.99,
    status: 'LOW_STOCK',
  },
  {
    id: '3',
    sku: 'SKU-1003',
    name: 'Standing Desk Anti-Fatigue Mat',
    category: 'Furniture',
    stock: 0,
    price: 34.5,
    status: 'OUT_OF_STOCK',
  },
  {
    id: '4',
    sku: 'SKU-1004',
    name: 'USB-C Dual 4K Docking Station',
    category: 'Electronics',
    stock: 65,
    price: 189.0,
    status: 'IN_STOCK',
  },
  {
    id: '5',
    sku: 'SKU-1005',
    name: 'Noise-Canceling Wireless Headset',
    category: 'Audio',
    stock: 12,
    price: 199.99,
    status: 'IN_STOCK',
  },
  {
    id: '6',
    sku: 'SKU-1006',
    name: 'Ultra-Wide 34" Curved Monitor',
    category: 'Electronics',
    stock: 4,
    price: 549.99,
    status: 'LOW_STOCK',
  },
  {
    id: '7',
    sku: 'SKU-1007',
    name: 'Aluminium Laptop Stand Holder',
    category: 'Accessories',
    stock: 89,
    price: 29.99,
    status: 'IN_STOCK',
  },
  {
    id: '8',
    sku: 'SKU-1008',
    name: 'Heavy-Duty Storage Shelving Unit',
    category: 'Furniture',
    stock: 0,
    price: 119.0,
    status: 'OUT_OF_STOCK',
  },
  {
    id: '9',
    sku: 'SKU-1009',
    name: 'Thermal Barcode Label Printer',
    category: 'Hardware',
    stock: 19,
    price: 249.5,
    status: 'IN_STOCK',
  },
  {
    id: '10',
    sku: 'SKU-1010',
    name: 'Handheld Bluetooth Barcode Scanner',
    category: 'Hardware',
    stock: 5,
    price: 79.99,
    status: 'LOW_STOCK',
  },
];

// ─── Task 31 Interactive Showcase View ───────────────────────────────────────
const InventoryDemoView = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  // Filter and sort items based on debounced search query
  const filteredProducts = useMemo(() => {
    let result = [...SAMPLE_PRODUCTS];

    if (debouncedSearch) {
      const q = debouncedSearch.trim().toLowerCase();
      if (q) {
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q),
        );
      }
    }

    if (sortBy && sortOrder) {
      result.sort((a, b) => {
        let aVal = (a as unknown as Record<string, unknown>)[sortBy];
        let bVal = (b as unknown as Record<string, unknown>)[sortBy];

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal! < bVal!) return sortOrder === 'asc' ? -1 : 1;
        if (aVal! > bVal!) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [debouncedSearch, sortBy, sortOrder]);

  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * limit,
    page * limit,
  );

  // 3-State Column Header Sort Handler: Unsorted -> Ascending -> Descending -> Unsorted
  const handleSort = (key: string) => {
    if (sortBy === key) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        // Third click clears sorting back to default natural order
        setSortBy(undefined);
        setSortOrder(undefined);
      }
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const toggleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1200);
  };

  // Table Column Definitions
  const columns: ColumnDef<DemoProduct>[] = [
    {
      key: 'sku',
      header: 'SKU Code',
      sortable: true,
      accessor: (row) => (
        <span className="font-mono text-xs text-primary">{row.sku}</span>
      ),
    },
    {
      key: 'name',
      header: 'Product Name',
      sortable: true,
      accessor: (row) => <span className="font-semibold">{row.name}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      accessor: (row) => (
        <Badge variant="outline" className="font-mono text-[11px]">
          {row.category}
        </Badge>
      ),
    },
    {
      key: 'stock',
      header: 'Stock Level',
      sortable: true,
      align: 'right',
      accessor: (row) => (
        <span
          className={cn(
            'font-mono font-bold',
            row.stock === 0
              ? 'text-destructive'
              : row.stock < 10
                ? 'text-warning'
                : 'text-foreground',
          )}
        >
          {row.stock} units
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Unit Price',
      sortable: true,
      align: 'right',
      accessor: (row) => (
        <span className="font-mono">${row.price.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      accessor: (row) => {
        if (row.status === 'IN_STOCK') {
          return (
            <Badge className="bg-success/15 text-success border-success/30">
              In Stock
            </Badge>
          );
        }
        if (row.status === 'LOW_STOCK') {
          return (
            <Badge className="bg-warning/15 text-warning border-warning/30">
              Low Stock
            </Badge>
          );
        }
        return <Badge variant="destructive">Out of Stock</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Inventory Catalog"
        description="Task 31 Verification Showcase: DataTable, Pagination, and SearchInput."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={toggleLoading}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Simulate Loading
            </Button>
            <Button
              size="sm"
              onClick={() =>
                toast.success('Add Item modal will open in Phase 5!')
              }
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Product
            </Button>
          </div>
        }
      />

      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by name, SKU, or category..."
          isLoading={search !== debouncedSearch}
        />
        <div className="text-xs text-muted-foreground font-mono">
          Debounced Query:{' '}
          <span className="text-primary font-semibold">
            "{debouncedSearch}"
          </span>
        </div>
      </div>

      {/* Reusable Data Table */}
      <DataTable
        columns={columns}
        data={paginatedProducts}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onRowClick={(row) =>
          toast.info(`Clicked product: ${row.name} (${row.sku})`)
        }
        emptyMessage="No inventory items match your search criteria"
      />

      {/* Reusable Pagination */}
      <Pagination
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
};

// ─── Placeholder Dashboard View ───────────────────────────────────────────────
const DashboardPlaceholder = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out successfully');
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Dashboard Overview"
        description="Welcome to Smart Inventory Management System."
        actions={
          <Button size="sm" onClick={() => navigate('/inventory')}>
            <Package className="mr-2 h-4 w-4" />
            View Inventory
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,248</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across 12 categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">14</div>
            <p className="text-xs text-muted-foreground mt-1">
              Items below minimum threshold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Active User Role
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-lg font-semibold text-foreground">
              {user?.firstName}
            </span>
            <Badge className="bg-success/15 text-success border-success/30 font-mono">
              {user?.role}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Layout Verification & Active Navigation Test
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Click any sidebar link to verify active route highlighting, page
            header updates, and responsive drawer behavior.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/inventory')}
            >
              <Package className="mr-1.5 h-3.5 w-3.5" /> Inventory (Task 31
              Showcase)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/suppliers')}
            >
              <Truck className="mr-1.5 h-3.5 w-3.5" /> Suppliers
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/users')}
            >
              <Users className="mr-1.5 h-3.5 w-3.5" /> Users (Admin)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/settings')}
            >
              <Settings className="mr-1.5 h-3.5 w-3.5" /> Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Placeholder Generic View Generator ───────────────────────────────────────
const GenericPlaceholder = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Package;
}) => (
  <div className="space-y-6 font-sans">
    <PageHeader title={title} description={description} />
    <Card className="p-8 text-center">
      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title} View</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
        This feature module will be fully implemented in subsequent development
        phases as specified in TASKS.md.
      </p>
    </Card>
  </div>
);

// NotFoundPage is now a dedicated component at src/pages/NotFoundPage.tsx

// ─── Centralized App Routing Tree ─────────────────────────────────────────────
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes (Redirects to /dashboard if logged in) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes inside AppShell Layout Container */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPlaceholder />} />
          <Route path="/inventory" element={<InventoryDemoView />} />
          <Route
            path="/categories"
            element={
              <GenericPlaceholder
                title="Categories"
                description="Organize inventory items into product category hierarchies."
                icon={FolderTree}
              />
            }
          />
          <Route
            path="/suppliers"
            element={
              <GenericPlaceholder
                title="Suppliers"
                description="Manage vendor details, contacts, and performance metrics."
                icon={Truck}
              />
            }
          />
          <Route
            path="/purchases"
            element={
              <GenericPlaceholder
                title="Purchase Orders"
                description="Track incoming stock orders and supplier invoices."
                icon={ShoppingBag}
              />
            }
          />
          <Route
            path="/sales"
            element={
              <GenericPlaceholder
                title="Sales & Invoices"
                description="Record outbound customer orders and generate invoices."
                icon={Receipt}
              />
            }
          />
          <Route
            path="/activity"
            element={
              <GenericPlaceholder
                title="Activity Log"
                description="Audit trail of stock movements, user logins, and system events."
                icon={AlertCircle}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <GenericPlaceholder
                title="System Settings"
                description="Configure application preferences, alerts, and profile defaults."
                icon={Settings}
              />
            }
          />

          {/* Admin-Only Protected Route (RBAC verification) */}
          <Route element={<ProtectedRoute requiredRoles={['ADMIN']} />}>
            <Route
              path="/users"
              element={
                <GenericPlaceholder
                  title="User Management"
                  description="Admin control panel to manage user accounts and role assignments."
                  icon={Users}
                />
              }
            />
          </Route>
        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
