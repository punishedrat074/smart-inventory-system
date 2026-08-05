import { Loader2, Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

/**
 * SearchInput.tsx — Reusable search input component
 *
 * Provides a text input with search icon, clear button, and optional loading spinner.
 */
export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search records...',
  isLoading = false,
  className,
}: SearchInputProps) => {
  return (
    <div
      className={cn('relative flex items-center w-full max-w-sm', className)}
    >
      {/* Search Icon or Loading Spinner */}
      <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </div>

      {/* Input Element */}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9 h-9 text-sm"
        aria-label="Search"
      />

      {/* Clear Button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
