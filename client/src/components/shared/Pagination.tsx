import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

/**
 * Pagination.tsx — Reusable pagination control component
 *
 * Renders item range text summary, page size selector dropdown, and first/prev/next/last page buttons.
 */
export const Pagination = ({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
}: PaginationProps) => {
  // Calculate item range string (e.g. "Showing 1 to 10 of 48 items")
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1 text-sm font-sans border-t border-border/40 select-none',
        className,
      )}
    >
      {/* Item Summary Text */}
      <div className="text-xs text-muted-foreground font-mono">
        Showing{' '}
        <span className="font-semibold text-foreground">{startItem}</span> to{' '}
        <span className="font-semibold text-foreground">{endItem}</span> of{' '}
        <span className="font-semibold text-foreground">{total}</span> items
      </div>

      {/* Controls Container */}
      <div className="flex items-center gap-6">
        {/* Page Size Selector */}
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              Rows per page:
            </span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-8 rounded-md border border-input bg-card text-foreground px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              aria-label="Select rows per page"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Current Page Indicator */}
        <div className="text-xs text-muted-foreground font-mono">
          Page <span className="font-semibold text-foreground">{page}</span> of{' '}
          <span className="font-semibold text-foreground">
            {totalPages || 1}
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          {/* First Page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious}
            aria-label="Go to first page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous Page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page - 1)}
            disabled={!canGoPrevious}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Next Page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page + 1)}
            disabled={!canGoNext}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last Page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext}
            aria-label="Go to last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
