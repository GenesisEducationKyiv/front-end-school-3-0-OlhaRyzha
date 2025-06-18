import type { QueryParams } from '@/types/shared/track';
import type { SortingState } from '@tanstack/react-table';

export const getSortParamsFromSortingState = (
  sorting: SortingState
): Pick<QueryParams, 'sort' | 'order'> => {
  if (!sorting.length) return { sort: undefined, order: undefined };
  const { id, desc } = sorting[0];
  return {
    sort: id as QueryParams['sort'],
    order: desc ? 'desc' : 'asc',
  };
};
