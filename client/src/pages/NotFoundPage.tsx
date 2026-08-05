import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

/**
 * NotFoundPage.tsx — Catch-all 404 page
 *
 * Renders outside the AppShell so that unknown routes don't show the sidebar.
 * Provides two recovery actions:
 *   1. Return to Dashboard (primary) — always reliable
 *   2. Go Back (secondary) — uses browser history
 *
 * Fully theme-aware via CSS variables (bg-background, text-foreground).
 * Accessible: uses semantic <main> and a single <h1>.
 *
 * Layout: the decorative "404" is absolutely positioned in the background
 * of the content card — it never overlaps the icon or text.
 */
export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center font-sans">
      {/* Relative container: decorative number sits behind the content */}
      <div className="relative flex flex-col items-center max-w-sm w-full">
        {/* Decorative 404 — absolutely positioned, sits flush at top */}
        <p
          aria-hidden="true"
          className="absolute -top-16 left-1/2 -translate-x-1/2 text-[160px] font-extrabold leading-none text-foreground/5 select-none pointer-events-none whitespace-nowrap"
        >
          404
        </p>

        {/* Foreground content — sits on top of the decorative number */}
        <div className="relative z-10 pt-28 space-y-4 w-full">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20 mx-auto">
            <LayoutDashboard className="h-6 w-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Page Not Found
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Double-check the URL or navigate back to safety.
          </p>

          {/* Recovery Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button className="flex-1" onClick={() => navigate('/dashboard')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};
