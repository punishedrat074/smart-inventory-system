import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * App.tsx — Task 22 verification component
 *
 * Renders a representative set of shadcn/ui primitives to confirm that:
 *   - Components import correctly from '@/components/ui/'
 *   - CSS variables from Task 21 are being consumed by all variants
 *   - cn() utility resolves class conflicts correctly
 *   - The Inter font and border radius tokens apply consistently
 *
 * This component is replaced in Task 28 (AppShell) with the real layout.
 */
function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Task 22 — shadcn/ui configured
          </div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Smart Inventory Management System
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            shadcn/ui primitives are rendering with your design tokens.
          </p>
        </div>

        {/* Button variants */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Button Variants
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </CardContent>
        </Card>

        {/* Badge variants */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Badge Variants
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            {/* Status badges use our custom CSS variable colours */}
            <Badge className="bg-success/15 text-success border-success/20 hover:bg-success/25">
              Active
            </Badge>
            <Badge className="bg-warning/15 text-warning border-warning/20 hover:bg-warning/25">
              Low Stock
            </Badge>
          </CardContent>
        </Card>

        {/* Form input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Form Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email-demo">Email address</Label>
              <Input
                id="email-demo"
                type="email"
                placeholder="admin@demo.com"
              />
            </div>
            <Button className="w-full">Sign In</Button>
          </CardContent>
        </Card>

        {/* Skeleton loading state */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Skeleton (Loading State)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground/60 text-center">
          Next: Axios API client (Task 23) · Zustand stores (Task 24)
        </p>
      </div>
    </div>
  );
}

export default App;
