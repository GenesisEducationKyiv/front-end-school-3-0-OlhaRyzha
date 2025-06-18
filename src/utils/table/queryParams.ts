import { pipe, O } from '@mobily/ts-belt';
import type { Order, QueryParams, Sort } from '@/types/shared/track';
import { META, PARAMS } from '@/constants/table.constants';
import { getTrimmedValue } from '../getTrimmedValue';
import { GenresType } from '@/types/shared/genre';
import { ArtistsType } from '@/types/shared/artists';

const VALID_SORTS = ['title', 'artist', 'album', 'createdAt', ''] as const;
const VALID_ORDERS = ['asc', 'desc', ''] as const;

type ParamConfig = {
  key: keyof QueryParams;
  map?: (value: string) => string | number;
  validate?: (
    value: string | number,
    allGenres: GenresType,
    allArtists: ArtistsType
  ) => boolean;
  def: string | number;
};

const PARAMS_CONFIG: ParamConfig[] = [
  {
    key: PARAMS.PAGE,
    def: META.page,
    map: Number,
  },
  {
    key: PARAMS.LIMIT,
    def: META.limit,
    map: Number,
  },
  {
    key: PARAMS.SEARCH,
    map: getTrimmedValue,
    def: '',
  },
  {
    key: PARAMS.SORT,
    def: META.sort,
    validate: (value) => VALID_SORTS.includes(value as Sort),
  },
  {
    key: PARAMS.ORDER,
    def: META.order,
    validate: (value) => VALID_ORDERS.includes(value as Order),
  },
  {
    key: PARAMS.GENRE,
    map: getTrimmedValue,
    def: '',
    validate: (value, allGenres) =>
      !value ||
      (Array.isArray(allGenres) && allGenres.includes(value as string)),
  },
  {
    key: PARAMS.ARTIST,
    map: getTrimmedValue,
    def: '',
    validate: (value, _allGenres, allArtists) =>
      !value ||
      (Array.isArray(allArtists) && allArtists.includes(value as string)),
  },
] as const;

export function getQueryParamsFromUrl(
  search: string,
  allGenres: GenresType,
  allArtists: ArtistsType
): QueryParams {
  const params = new URLSearchParams(search);

  return PARAMS_CONFIG.reduce<QueryParams>(
    (acc, { key, map, def, validate }) => {
      let value = pipe(
        O.fromNullable(params.get(key)),
        map ? O.map(map) : O.map((x) => x),
        O.getWithDefault(def)
      );

      if (validate && !validate(value, allGenres, allArtists)) {
        value = def;
      }

      return { ...acc, [key]: value };
    },
    {}
  );
}

export function setQueryParamsToUrl(params: QueryParams): void {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      urlParams.set(key, String(value));
    }
  });

  window.history.replaceState(null, '', `?${urlParams.toString()}`);
}
