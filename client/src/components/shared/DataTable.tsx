import { ArrowDown, ArrowUp, ArrowUpDown, Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils';

export interface ColumnDef<TData> {
  key: string;
  header: string;
  accessor?: (row: TData) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (columnKey: string) => void;
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
  className?: string;
}

/**
 * DataTable.tsx — Generic reusable table component
 *
 * Renders type-safe table columns, clickable sort headers, skeleton loading states,
 * custom cell accessors, and empty state fallbacks.
 */
export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  emptyMessage = 'No records found',
  className,
}: DataTableProps<TData>) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-sans border-collapse">
          {/* Table Header */}
          <thead className="bg-secondary/40 border-b border-border text-xs uppercase font-mono tracking-wider text-muted-foreground select-none">
            <tr>
              {columns.map((col) => {
                const isSorted = sortBy === col.key;
                const alignmentClass =
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                      ? 'text-right'
                      : 'text-left';

                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      'px-4 py-3.5 font-semibold text-foreground/80 transition-colors',
                      alignmentClass,
                      col.sortable && onSort
                        ? 'cursor-pointer hover:bg-accent/60 hover:text-foreground'
                        : '',
                      col.className,
                    )}
                    onClick={() => col.sortable && onSort && onSort(col.key)}
                    aria-sort={
                      isSorted
                        ? sortOrder === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : undefined
                    }
                  >
                    <div
                      className={cn(
                        'flex items-center gap-1.5',
                        col.align === 'center'
                          ? 'justify-center'
                          : col.align === 'right'
                            ? 'justify-end'
                            : 'justify-start',
                      )}
                    >
                      <span>{col.header}</span>
                      {col.sortable && onSort && (
                        <span className="text-muted-foreground">
                          {isSorted ? (
                            sortOrder === 'asc' ? (
                              <ArrowUp className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400 font-bold" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400 font-bold" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              // Loading Skeleton State (5 rows)
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={`skeleton-row-${rowIndex}`} className="bg-card">
                  {columns.map((col) => (
                    <td key={`skeleton-col-${col.key}`} className="px-4 py-4">
                      <Skeleton className="h-4 w-full max-w-[120px] rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty Data Fallback State
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center bg-card"
                >
                  <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                    <div className="h-10 w-10 rounded-full bg-secondary/80 flex items-center justify-center">
                      <Inbox className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {emptyMessage}
                    </p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Try adjusting your search query or filters to find what
                      you are looking for.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    'bg-card transition-colors duration-150 animate-in fade-in-50 slide-in-from-top-1 duration-200',
                    onRowClick
                      ? 'cursor-pointer hover:bg-accent/40'
                      : 'hover:bg-accent/20',
                  )}
                >
                  {columns.map((col) => {
                    const alignmentClass =
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                          ? 'text-right'
                          : 'text-left';

                    const cellContent = col.accessor
                      ? col.accessor(row)
                      : (row as Record<string, unknown>)[col.key] != null
                        ? String((row as Record<string, unknown>)[col.key])
                        : '-';

                    return (
                      <td
                        key={`cell-${col.key}`}
                        className={cn(
                          'px-4 py-3.5 text-sm text-foreground/90 font-medium whitespace-nowrap',
                          alignmentClass,
                          col.className,
                        )}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
