/**
 * Parses a date string (YYYY-MM-DD) as a local date to avoid timezone shift.
 * Without this, "2026-02-24" is interpreted as UTC midnight, which in UTC-3 becomes Feb 23.
 */
export function parseLocalDate(dateStr: string): Date {
  // If it's just a date (YYYY-MM-DD), parse as local by adding noon time
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr + "T12:00:00");
  }
  return new Date(dateStr);
}
