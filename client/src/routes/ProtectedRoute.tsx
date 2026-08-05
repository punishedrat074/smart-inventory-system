import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types/auth.types';

interface ProtectedRouteProps {
  requiredRoles?: UserRole[];
  children?: ReactNode;
}

/**
 * ProtectedRoute.tsx — Route guard for authenticated & authorized access
 *
 * Responsibilities:
 *   1. Displays a loading state while restoring session from HttpOnly cookie (isInitializing)
 *   2. Redirects unauthenticated users to /login, preserving original location in state
 *   3. Enforces Role-Based Access Control (RBAC) if requiredRoles is specified
 *   4. Renders child routes via <Outlet /> or direct children on authorization success
 */
export const ProtectedRoute = ({
  requiredRoles,
  children,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isInitializing, user } = useAuthStore();
  const location = useLocation();

  // 1. Session restoration in progress — prevent flash of unauthenticated state
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">
            Verifying authentication session...
          </span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated — redirect to login and preserve target location for return
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated but unauthorized role (RBAC check)
  if (
    requiredRoles &&
    requiredRoles.length > 0 &&
    !requiredRoles.includes(user.role)
  ) {
    toast.error('Access denied. You do not have permission to view this page.');
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Authenticated and Authorized — render protected routes
  return children ? <>{children}</> : <Outlet />;
};
