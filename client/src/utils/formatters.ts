/**
 * formatters.ts — Application-wide formatting utilities
 *
 * All functions are pure (no side effects) and rely on the native `Intl` API
 * for locale-awareness and zero-bundle-cost formatting. No external dependencies.
 *
 * Usage:
 *   import { formatCurrency, formatDate, formatNumber } from '@/utils';
 */

// ─── Currency ────────────────────────────────────────────────────────────────

/**
 * Format a number as a USD currency string.
 *
 * @example
 *   formatCurrency(1234.5)   // → "$1,234.50"
 *   formatCurrency(0)        // → "$0.00"
 *   formatCurrency(99999.99) // → "$99,999.99"
 */
export function formatCurrency(
  value: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// ─── Numbers ─────────────────────────────────────────────────────────────────

/**
 * Format a number with thousands separators.
 *
 * @example
 *   formatNumber(1234567) // → "1,234,567"
 *   formatNumber(99.5)    // → "99.5"
 */
export function formatNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format a number as a compact abbreviation.
 *
 * @example
 *   formatCompactNumber(1500)      // → "1.5K"
 *   formatCompactNumber(2000000)   // → "2M"
 */
export function formatCompactNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format a number as a percentage string.
 *
 * @example
 *   formatPercent(0.1234) // → "12.34%"
 *   formatPercent(1)      // → "100%"
 */
export function formatPercent(
  value: number,
  fractionDigits = 1,
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

// ─── Dates ───────────────────────────────────────────────────────────────────

/**
 * Format an ISO date string or Date object as a short human-readable date.
 *
 * @example
 *   formatDate('2024-01-15')            // → "Jan 15, 2024"
 *   formatDate(new Date('2024-06-01'))  // → "Jun 1, 2024"
 */
export function formatDate(value: string | Date, locale = 'en-US'): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a date as a long readable date with time.
 *
 * @example
 *   formatDateTime('2024-01-15T10:30:00Z') // → "Jan 15, 2024, 10:30 AM"
 */
export function formatDateTime(value: string | Date, locale = 'en-US'): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format a date as a relative human-readable string ("3 days ago", "in 2 hours").
 * Falls back to `formatDate` for dates older than 30 days.
 *
 * @example
 *   formatRelativeDate(new Date(Date.now() - 60_000))         // → "1 minute ago"
 *   formatRelativeDate(new Date(Date.now() - 3_600_000))      // → "1 hour ago"
 *   formatRelativeDate(new Date(Date.now() - 86_400_000 * 5)) // → "5 days ago"
 */
export function formatRelativeDate(
  value: string | Date,
  locale = 'en-US',
): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(date.getTime())) return '—';

  const diffMs = date.getTime() - Date.now();
  const diffSeconds = Math.round(diffMs / 1_000);
  const diffMinutes = Math.round(diffMs / 60_000);
  const diffHours = Math.round(diffMs / 3_600_000);
  const diffDays = Math.round(diffMs / 86_400_000);

  // Fall back to absolute date for distant dates (>30 days)
  if (Math.abs(diffDays) > 30) return formatDate(date, locale);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffSeconds) < 60) return rtf.format(diffSeconds, 'second');
  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, 'minute');
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
  return rtf.format(diffDays, 'day');
}
