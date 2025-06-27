export function isFunction<T extends (...args: any[]) => any>(
  value: unknown
): value is T {
  return typeof value === 'function';
}
