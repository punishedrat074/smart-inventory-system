import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';

interface PublicRouteProps {
  children?: ReactNode;
}

/**
 * PublicRoute.tsx — Route guard for unauthenticated public pages (/login, /register)
 *
 * Responsibilities:
 *   1. Displays loading state while restoring session on app startup (isInitializing)
 *   2. Redirects already-authenticated users to /dashboard (or their intended destination)
 *   3. Renders public auth forms for unauthenticated guests
 */
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isInitializing } = useAuthStore();
  const location = useLocation();

  // 1. Session restoration in progress
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading session...</span>
        </div>
      </div>
    );
  }

  // 2. Already authenticated — redirect away from login/register
  if (isAuthenticated) {
    const fromLocation = (location.state as { from?: { pathname: string } })
      ?.from?.pathname;
    const redirectTo = fromLocation || '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  // 3. Unauthenticated guest — render public route content
  return children ? <>{children}</> : <Outlet />;
};
