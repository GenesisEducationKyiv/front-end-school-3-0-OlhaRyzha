import { isArray } from './isArray';

export function isNonEmptyArray(value: unknown): value is (string | number)[] {
  return isArray(value) && value.length > 0;
}
