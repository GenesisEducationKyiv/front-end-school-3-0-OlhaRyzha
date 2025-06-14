import { ArtistsType } from './../../../types/shared/artists';
import { GenresType } from '@/types/shared/genre';
import { useEffect } from 'react';
import type { QueryParams } from '@/types/shared/track';
import { useLocation } from 'react-router-dom';
import {
  getQueryParamsFromUrl,
  setQueryParamsToUrl,
} from '@/utils/table/queryParams';
import { queryClient } from '@/services';
import {
  ARTISTS_QUERY_KEY,
  GENRES_QUERY_KEY,
} from '@/constants/queryKeys.constants';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectTableParams,
  setTableParams,
} from '@/store/slices/table/tableSlice';

export function useTableParams() {
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const params = useAppSelector(selectTableParams);

  const allGenres =
    queryClient.getQueryData<GenresType>(GENRES_QUERY_KEY) ?? [];

  const allArtists =
    queryClient.getQueryData<ArtistsType>(ARTISTS_QUERY_KEY) ?? [];

  const initialParams: QueryParams = getQueryParamsFromUrl(
    search,
    allGenres,
    allArtists
  );

  useEffect(() => {
    dispatch(setTableParams(initialParams));
  }, []);

  useEffect(() => {
    setQueryParamsToUrl(params);
  }, [params]);

  return {};
}
