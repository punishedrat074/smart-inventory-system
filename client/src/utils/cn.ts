import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn — Class Name Utility
 *
 * Combines conditional class names and resolves Tailwind conflicts.
 *
 * Wraps two libraries:
 *   - clsx: conditional class name joiner (handles arrays, objects, booleans)
 *   - tailwind-merge: resolves conflicting Tailwind utilities (e.g. `p-2 p-4` → `p-4`)
 *
 * Usage:
 *   cn('px-4 py-2', isActive && 'bg-primary', className)
 *   cn('text-sm', { 'font-bold': isBold }, 'text-muted-foreground')
 *
 * @param inputs - Any number of class values (strings, arrays, objects)
 * @returns A deduplicated, conflict-resolved class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
