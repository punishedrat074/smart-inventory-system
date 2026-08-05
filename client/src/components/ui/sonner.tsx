import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from 'lucide-react';
import { Toaster as Sonner } from 'sonner';

/**
 * Toaster — Global toast notification container.
 *
 * Wraps the sonner `Toaster` with project design tokens.
 * This is not a Next.js project so we skip next-themes; instead we
 * read the current theme from the <html> class list directly.
 *
 * Usage: Mount <Toaster /> once in main.tsx (done in Task 28/AppShell).
 * Trigger toasts anywhere: import { toast } from 'sonner'
 */

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  // Detect theme from the html element class (set by our ThemeStore in Task 24).
  // Falls back to 'dark' since dark is the project default.
  const isDark =
    document.documentElement.classList.contains('dark') ||
    !document.documentElement.classList.contains('light');
  const theme = isDark ? 'dark' : 'light';

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
