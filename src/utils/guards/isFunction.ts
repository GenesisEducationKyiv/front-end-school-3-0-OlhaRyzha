export function isFunction<T extends (...args: any[]) => unknown>(
  value: unknown
): value is T {
  return typeof value === 'function';
}
