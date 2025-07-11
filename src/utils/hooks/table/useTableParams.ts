import { useEffect } from 'react';
import { useAppSelector } from '@/store';
import { selectTableParams } from '@/store/slices/table/tableSlice';
import { setQueryParamsToUrl } from '@/utils/table/queryParams';

export function useSyncTableParamsToUrl() {
  const params = useAppSelector(selectTableParams);

  useEffect(() => {
    setQueryParamsToUrl(params);
  }, [params]);
}
