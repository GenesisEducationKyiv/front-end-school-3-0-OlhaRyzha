import { FC, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QueryParams } from '@/types/shared/track';
import { ALL_ARTISTS, ALL_GENRES } from '@/constants/labels.constant';
import { getFilterChangeHandler } from '@/utils/table/filters/getFilterChangeHandler';
import { getFiltersConfig } from '@/configs/tableConfig';
import { queryClient } from '@/services';
import { GENRES_QUERY_KEY } from '@/constants/queryKeys.constants';
import { GenresType } from '@/types/shared/genre';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectAllArtists,
  selectTableParams,
  setTableParams,
} from '@/store/slices/table/tableSlice';

const FiltersBar = () => {
  const dispatch = useAppDispatch();
  const params = useAppSelector(selectTableParams);
  const availableArtists = useAppSelector(selectAllArtists);
  const availableGenres =
    queryClient.getQueryData<GenresType>(GENRES_QUERY_KEY) ?? [];

  const handleParamsUpdate = useCallback(
    (updater: (p: QueryParams) => QueryParams) =>
      dispatch(setTableParams(updater(params))),
    [dispatch, params]
  );

  const onArtistChange = getFilterChangeHandler(
    'artist',
    ALL_ARTISTS,
    handleParamsUpdate
  );
  const onGenreChange = getFilterChangeHandler(
    'genre',
    ALL_GENRES,
    handleParamsUpdate
  );
  const FILTERS_LIST = getFiltersConfig(
    params,
    availableArtists,
    availableGenres,
    onArtistChange,
    onGenreChange
  );

  return (
    <div className='flex gap-4'>
      {FILTERS_LIST.map((filter) => (
        <Select
          key={filter.testid}
          value={filter.value}
          onValueChange={filter.onChange}
          data-testid={filter.testid}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              className='capitalize'
              value={filter.selectedItem}>
              {filter.selectedItem}
            </SelectItem>
            {filter.availableOptions?.map((option) => (
              <SelectItem
                key={option}
                value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
};
export default FiltersBar;
