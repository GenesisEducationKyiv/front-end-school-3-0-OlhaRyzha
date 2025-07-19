import { META } from '@/constants/table.constants';
import { FilterKey } from '@/types/shared/filters';
import { SetParamsType } from '@/types/shared/table';

export function getFilterChangeHandler<T extends FilterKey>(
  key: T,
  allValue: string,
  setParams: SetParamsType
) {
  return (v: string) =>
    setParams((p) => ({
      ...p,
      [key]: v === allValue ? null : v,
      page: META.page,
    }));
}
