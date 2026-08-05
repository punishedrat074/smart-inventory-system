import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiGet } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: string;
  database: string;
  version?: string;
  name?: string;
}

/**
 * App.tsx — Task 24 verification component
 *
 * Confirms that:
 *   1. TanStack Query (QueryClientProvider) fetches data and manages cache
 *   2. ReactQueryDevtools triggers in development (floating icon bottom-right)
 *   3. Global Toast notifications render via Sonner Toaster
 *   4. Interoperability with Task 23's apiGet client function works cleanly
 */
function App() {
  // Verify TanStack Query fetching against server health endpoint
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiGet<HealthResponse>('/api/v1/health'),
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Task 24 — TanStack Query & Toasts
          </div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Smart Inventory Management System
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            TanStack Query provider and global toast notification system are
            active.
          </p>
        </div>

        {/* Global Toast Test Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Global Toast Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success('Operation completed successfully!')}
            >
              Success
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.error('Failed to update inventory record')}
            >
              Error
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info('System update scheduled at midnight')}
            >
              Info
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.warning('Low stock warning: SKU-1049')}
            >
              Warning
            </Button>
          </CardContent>
        </Card>

        {/* TanStack Query API Health Fetch Test Section */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              TanStack Query Status
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                refetch();
                toast.info('Refetching health status...');
              }}
              disabled={isFetching}
            >
              {isFetching ? 'Refreshing...' : 'Refetch'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : isError ? (
              <div className="p-3 rounded bg-destructive/10 text-destructive text-sm border border-destructive/20">
                <p className="font-semibold">Query Failed</p>
                <p className="text-xs mt-1">
                  {(error as Error)?.message || 'Server connection failed'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Server API:</span>
                  <Badge
                    variant="outline"
                    className="text-success border-success/30"
                  >
                    {data?.data.name || 'Connected'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-mono text-xs text-foreground">
                    v{data?.data.version || '1.0.0'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span className="font-mono text-xs text-foreground">
                    {data?.data.uptime || 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground/60 text-center">
          Next: Auth Store & Auth API (Task 25) · Login/Register Pages (Task 26)
        </p>
      </div>
    </div>
  );
}

export default App;
