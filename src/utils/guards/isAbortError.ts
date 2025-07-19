import { isObject } from './isObject';

export function isAbortError(e: unknown): e is DOMException {
  return isObject(e) && 'name' in e && e.name === 'AbortError';
}
