import {
  AlertCircle,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  Truck,
  Users,
} from 'lucide-react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicRoute } from '@/routes/PublicRoute';
import { useAuthStore } from '@/store/authStore';

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
              <Package className="mr-1.5 h-3.5 w-3.5" /> Inventory
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

// ─── Catch-All 404 Not Found View ─────────────────────────────────────────────
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6 font-sans flex flex-col items-center justify-center text-center">
      <div className="space-y-4 max-w-sm">
        <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          404
        </h1>
        <h2 className="text-lg font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button onClick={() => navigate('/dashboard')} className="w-full">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

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
          <Route
            path="/inventory"
            element={
              <GenericPlaceholder
                title="Inventory Items"
                description="Manage product catalog, SKU tracking, and stock levels."
                icon={Package}
              />
            }
          />
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
