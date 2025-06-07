import { useEffect, useState, useCallback } from 'react';
import type { QueryParams } from '@/types/shared/track';
import { META } from '@/constants/table.constants';
import {
  isFunction,
  type OnChangeFn,
  type SortingState,
} from '@tanstack/react-table';
import { isSortingState } from '@/utils/guards/isSortingState';
import { useLocation } from 'react-router-dom';
import {
  getQueryParamsFromUrl,
  setQueryParamsToUrl,
} from '@/utils/table/queryParams';

export function useTableParams() {
  const { search } = useLocation();
  const initialParams: QueryParams = getQueryParamsFromUrl(search);

  const [params, setParams] = useState<QueryParams>(initialParams);
  const [sortingState, setSortingState] = useState<SortingState>([]);

  useEffect(() => {
    setQueryParamsToUrl(params);
  }, [params]);

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSortingState((prev) => {
      const next = isFunction(updater) ? updater(prev) : updater;
      if (isSortingState(next)) {
        setParams((paramsPrev) =>
          next?.length
            ? {
                ...paramsPrev,
                sort: next[0].id as QueryParams['sort'],
                order: next[0].desc ? 'desc' : 'asc',
                page: META.page,
              }
            : { ...paramsPrev, sort: undefined, order: undefined, page: 1 }
        );
        return next;
      }
      return prev;
    });
  };

  const handlePageChange = useCallback((page: number | string) => {
    setParams((p) => ({ ...p, page }));
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setParams((prev) => ({
      ...prev,
      limit: newLimit,
      page: META.page,
    }));
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setParams((p) => ({ ...p, search, page: META.page }));
  }, []);

  return {
    params,
    setParams,
    sorting: sortingState,
    handleSortingChange,
    handlePageChange,
    handleLimitChange,
    search: params.search ?? '',
    setSearch: handleSearchChange,
  };
}
