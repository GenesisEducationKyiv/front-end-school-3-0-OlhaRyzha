import { IdType } from '@/types/ids';
import { isObject } from './isObject';

export function hasId<T extends { id: IdType }>(data: unknown): data is T {
  return isObject(data) && 'id' in data;
}
