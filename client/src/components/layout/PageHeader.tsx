import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * PageHeader.tsx — Reusable header component for workspace page views
 *
 * Renders consistent page heading typography, optional description,
 * and an actions slot for primary action buttons (e.g., "Add Item", "Export CSV").
 */
export const PageHeader = ({
  title,
  description,
  actions,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40 mb-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
};
