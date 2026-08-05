import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { apiGet } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authStore';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: string;
  database: string;
  version?: string;
  name?: string;
}

/**
 * App.tsx — Task 25 verification component
 *
 * Demonstrates:
 *   1. Initial session restoration (`initAuth()`)
 *   2. Demo user login via `authStore.login()`
 *   3. Authenticated user profile state (`user`, `isAuthenticated`, `role`)
 *   4. Session logout via `authStore.logout()` (clears state & query cache)
 *   5. Integration with TanStack Query and Sonner toasts
 */
function App() {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitializing,
    login,
    logout,
    initAuth,
  } = useAuthStore();

  // Initialize session on mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Server health query
  const { data: healthData } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiGet<HealthResponse>('/api/v1/health'),
  });

  const handleDemoLogin = async (email: string, roleName: string) => {
    try {
      const loggedUser = await login({ email, password: 'password123' });
      toast.success(`Logged in as ${loggedUser.firstName} (${roleName})`);
    } catch (err) {
      toast.error((err as { message: string })?.message || 'Login failed');
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Task 25 — Auth Store & Auth API
          </div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Smart Inventory Management System
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Zustand auth store, in-memory tokens, and session persistence
            active.
          </p>
        </div>

        {/* Session Status & User Profile Card */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Authentication Session
            </CardTitle>
            {isInitializing ? (
              <Badge variant="outline" className="animate-pulse">
                Initializing...
              </Badge>
            ) : isAuthenticated ? (
              <Badge className="bg-success/15 text-success border-success/30">
                Authenticated
              </Badge>
            ) : (
              <Badge variant="secondary">Unauthenticated</Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isInitializing ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : isAuthenticated && user ? (
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-card border border-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      {user.firstName} {user.lastName}
                    </span>
                    <Badge variant="outline" className="text-xs font-mono">
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {user.email}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 font-mono pt-1">
                    ID: {user.id}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging out...' : 'Sign Out'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Test session store actions using seeded demo accounts:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDemoLogin('admin@demo.com', 'Admin')}
                    disabled={isLoading}
                  >
                    Demo Admin
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleDemoLogin('employee1@demo.com', 'Employee')
                    }
                    disabled={isLoading}
                  >
                    Demo Employee
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Server & System Status Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              API Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Server Health:</span>
              <span className="font-mono text-xs text-success">
                {healthData?.data.status || 'Checking...'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Uptime:</span>
              <span className="font-mono text-xs text-foreground">
                {healthData?.data.uptime || 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground/60 text-center">
          Next: Login & Register Pages (Task 26) · React Router (Task 27)
        </p>
      </div>
    </div>
  );
}

export default App;
