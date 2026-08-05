import {
  AlertCircle,
  LayoutDashboard,
  LogOut,
  Package,
  Shield,
  Users,
} from 'lucide-react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicRoute } from '@/routes/PublicRoute';
import { useAuthStore } from '@/store/authStore';

// ─── Placeholder Dashboard View (Until Task 28-30 AppShell & Dashboard) ──────
const DashboardPlaceholder = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out successfully');
  };

  return (
    <div className="min-h-screen bg-background p-6 font-sans flex flex-col items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Task 27 — React Router & Protected Routes Active
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Protected Dashboard View
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            React Router v6 routing, ProtectedRoute, and RBAC guards are
            operational.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Active User Session
            </CardTitle>
            <Badge className="bg-success/15 text-success border-success/30">
              {user?.role}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3.5 rounded-lg bg-card border border-border space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">User:</span>
                <span className="font-semibold text-foreground">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-mono text-xs text-foreground">
                  {user?.email}
                </span>
              </div>
            </div>

            {/* Test Navigation Buttons */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Route Navigation Verification:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/inventory')}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Inventory
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/users')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Users (Admin)
                </Button>
              </div>
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ─── Placeholder Admin Users View (Tests RBAC Guard) ─────────────────────────
const UsersPlaceholder = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6 font-sans flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Shield className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Admin User Management
        </h2>
        <p className="text-sm text-muted-foreground">
          You are viewing this route because your role is{' '}
          <Badge variant="outline">ADMIN</Badge>.
        </p>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

// ─── Placeholder Inventory View ──────────────────────────────────────────────
const InventoryPlaceholder = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6 font-sans flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Package className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Inventory Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Stock item tables and category management will be built in Phase 5
          (Tasks 33-36).
        </p>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

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

      {/* Protected Routes (Requires Authentication) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
        <Route path="/inventory" element={<InventoryPlaceholder />} />

        {/* Admin-Only Protected Route (RBAC verification) */}
        <Route element={<ProtectedRoute requiredRoles={['ADMIN']} />}>
          <Route path="/users" element={<UsersPlaceholder />} />
        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
