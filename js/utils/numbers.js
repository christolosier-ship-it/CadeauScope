export function parseOptionalNumber(value, { min = -Infinity, positive = false } = {}) {
  if (value === '' || value == null) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return NaN;
  if (positive ? n <= 0 : n < min) return NaN;
  return n;
}
export function isValidOptionalNumber(value, options = {}) { return !Number.isNaN(parseOptionalNumber(value, options)); }
export function cleanOptionalNumber(value, options = {}) { const n = parseOptionalNumber(value, options); return Number.isNaN(n) ? null : n; }
