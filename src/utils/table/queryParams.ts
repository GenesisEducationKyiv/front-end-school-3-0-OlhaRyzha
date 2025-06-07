import { pipe, O } from '@mobily/ts-belt';
import type { QueryParams } from '@/types/shared/track';
import { META, PARAMS } from '@/constants/table.constants';
import { getTrimmedValue } from '../getTrimmedValue';

type ParamConfig = {
  key: keyof QueryParams;
  map?: (value: string) => string;
  def: string | number;
};

const PARAMS_CONFIG: ParamConfig[] = [
  { key: PARAMS.PAGE, def: META.page },
  { key: PARAMS.LIMIT, def: META.limit },
  { key: PARAMS.SEARCH, map: getTrimmedValue, def: '' },
  { key: PARAMS.SORT, def: META.sort },
  { key: PARAMS.ORDER, def: META.order },
  { key: PARAMS.GENRE, map: getTrimmedValue, def: '' },
  { key: PARAMS.ARTIST, map: getTrimmedValue, def: '' },
] as const;

export function getQueryParamsFromUrl(search: string): QueryParams {
  const params = new URLSearchParams(search);

  return PARAMS_CONFIG.reduce<QueryParams>((acc, { key, map, def }) => {
    const value = pipe(
      O.fromNullable(params.get(key)),
      map ? O.map(map) : O.map((x) => x),
      O.getWithDefault(def)
    );

    return { ...acc, [key]: value };
  }, {});
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
