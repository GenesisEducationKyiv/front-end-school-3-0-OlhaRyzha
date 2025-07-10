import { isString } from './isString';

export function isBlobUrl(value: unknown): value is string {
  return isString(value) && value.startsWith('blob:');
}
