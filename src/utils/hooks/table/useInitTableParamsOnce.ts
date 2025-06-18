import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectAllArtists,
  setTableParams,
} from '@/store/slices/table/tableSlice';
import { GENRES_QUERY_KEY } from '@/constants/queryKeys.constants';
import { queryClient } from '@/services';
import { getQueryParamsFromUrl } from '@/utils/table/queryParams';
import { GenresType } from '@/types/shared/genre';

export function useInitTableParamsOnce() {
  const initialized = useRef(false);
  const { search } = useLocation();
  const dispatch = useAppDispatch();
  const allArtists = useAppSelector(selectAllArtists);
  const allGenres =
    queryClient.getQueryData<GenresType>(GENRES_QUERY_KEY) ?? [];

  useEffect(() => {
    if (!initialized.current && allGenres?.length && allArtists?.length) {
      const parsed = getQueryParamsFromUrl(search, allGenres, allArtists);
      dispatch(setTableParams(parsed));
      initialized.current = true;
    }
  }, [search, allArtists, allGenres, dispatch]);
}
