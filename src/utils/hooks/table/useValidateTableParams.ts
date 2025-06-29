import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectTableParams,
  setTableParams,
} from '@/store/slices/table/tableSlice';
import { GenresType } from '@/types/shared/genre';
import { ArtistsType } from '@/types/shared/artists';
import { isNonEmptyArray } from '@/utils/guards/isNonEmptyArray';
import { FilterKey } from '@/types/shared/filters';

type FieldValidation = {
  key: FilterKey;
  list: GenresType | ArtistsType;
};

export function useValidateTableParams(
  allGenres: GenresType,
  allArtists: ArtistsType
) {
  const dispatch = useAppDispatch();
  const params = useAppSelector(selectTableParams);

  useEffect(() => {
    const validations: FieldValidation[] = [
      { key: 'genre', list: allGenres },
      { key: 'artist', list: allArtists },
    ];

    if (!isNonEmptyArray(allGenres) && !isNonEmptyArray(allArtists)) return;

    let nextParams = { ...params };
    let changed = false;

    validations.forEach(({ key, list }) => {
      const value = params[key];
      if (value && (!Array.isArray(list) || !list.includes(value))) {
        nextParams[key] = '';
        changed = true;
      }
    });

    if (changed) {
      dispatch(setTableParams(nextParams));
    }
  }, [params, allGenres, allArtists, dispatch]);
}
