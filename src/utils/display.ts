import { mapEnum } from './enum-mapper';

export function display(v: unknown, fallback = '—'): string {
  if (v == null) return fallback;

  // Check if it's an enum we can map
  const mapped = mapEnum(v);
  if (mapped !== String(v)) return mapped;

  const s = String(v).trim();
  if (!s || s === 'N/A' || s === 'n/a') return fallback;
  return s;
}
