import { format, parseISO, isValid } from 'date-fns';

function toDate(value: unknown): Date | null {
  if (!value) return null;
  const d = typeof value === 'string' ? parseISO(value) : new Date(value as any);
  return isValid(d) ? d : null;
}

export function formatDate(value: unknown): string {
  const d = toDate(value);
  return d ? format(d, 'MMM d, yyyy') : '—';
}

export function formatDateTime(value: unknown): string {
  const d = toDate(value);
  return d ? format(d, 'MMM d, yyyy · HH:mm') : '—';
}
