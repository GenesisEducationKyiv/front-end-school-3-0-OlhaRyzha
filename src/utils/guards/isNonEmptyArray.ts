export function isNonEmptyArray(value: unknown): value is (string | number)[] {
  return Array.isArray(value) && value.length > 0;
}
