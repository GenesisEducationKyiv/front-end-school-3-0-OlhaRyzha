import { IdType } from '@/types/ids';

export function hasId<T extends { id: IdType }>(data: unknown): data is T {
  return typeof data === 'object' && data !== null && 'id' in data;
}
