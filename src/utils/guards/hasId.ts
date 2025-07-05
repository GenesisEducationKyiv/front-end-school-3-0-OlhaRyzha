import { IdType } from '@/types/ids';
import { isObject } from './isObject';
import { isArray } from './isArray';

export function hasId<T extends { id?: IdType }>(data: unknown): data is T {
  return isObject(data) && !isArray(data) && 'id' in data;
}
