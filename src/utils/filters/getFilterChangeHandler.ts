import { FilterKey } from '@/types/shared/filters';
import { QueryParams } from '@/types/shared/track';

export function getFilterChangeHandler<T extends FilterKey>(
  key: T,
  allValue: string,
  setParams: (updater: (p: QueryParams) => QueryParams) => void
) {
  return (v: string) =>
    setParams((p) => ({
      ...p,
      [key]: v === allValue ? null : v,
      page: 1,
    }));
}
