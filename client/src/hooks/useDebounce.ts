import { useEffect, useState } from 'react';

/**
 * useDebounce.ts — Custom React hook for debouncing values
 *
 * Delays updating the returned value until specified milliseconds have elapsed
 * since the last time the input value changed.
 *
 * @param value The value to debounce (e.g. search query input string)
 * @param delay Milliseconds to delay before updating (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
