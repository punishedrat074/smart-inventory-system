import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { useAuthStore } from '@/store/authStore';

/**
 * App.tsx — Task 26 verification component
 *
 * Renders the Authentication UI (LoginPage and RegisterPage) with split-panel
 * layout, Zod form validation, and active session status.
 */
function App() {
  const [activeView, setActiveView] = useState<'login' | 'register'>('login');
  const { user, isAuthenticated, isInitializing, logout } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().initAuth();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out successfully');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 font-sans text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Restoring session...</span>
        </div>
      </div>
    );
  }

  // If user is authenticated, render authenticated session state
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Task 26 — Auth Pages Complete
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Authenticated Session Active
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              You are logged in via `authStore`. Task 27 (React Router) will
              wire up full page routing next.
            </p>
          </div>

          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                User Profile
              </CardTitle>
              <Badge className="bg-success/15 text-success border-success/30">
                {user.role}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3.5 rounded-lg bg-card border border-border space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Full Name:</span>
                  <span className="font-semibold text-foreground">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-mono text-xs text-foreground">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {user.id}
                  </span>
                </div>
              </div>

              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                Sign Out & Return to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render Login or Register Page inside AuthLayout
  if (activeView === 'login') {
    return <LoginPage onNavigateToRegister={() => setActiveView('register')} />;
  }

  return <RegisterPage onNavigateToLogin={() => setActiveView('login')} />;
}

export default App;
