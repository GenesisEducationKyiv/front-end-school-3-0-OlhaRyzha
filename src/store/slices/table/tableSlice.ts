import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/rootReducer';
import type { QueryParams } from '@/types/shared/track';
import type { SortingState } from '@tanstack/react-table';
import { META } from '@/constants/table.constants';
import { getSortParamsFromSortingState } from '@/utils/getSortParamsFromSortingState';
import { ArtistsType } from '@/types/shared/artists';
import { getQueryParamsFromUrl } from '@/utils/table/queryParams';

export const DEFAULT_SORTING: SortingState = [{ id: 'createdAt', desc: true }];
export const DEFAULT_PARAMS = {
  page: META.page,
  limit: META.limit,
  sort: META.sort,
  order: META.order,
  search: '',
  genre: '',
  artist: '',
};
export const DEFAULT_META = {
  total: META.total,
  totalPages: META.page,
  currentPage: META.page,
  limit: META.limit,
};

const initialParamsFromUrl = (() => {
  if (typeof window !== 'undefined') {
    const allArtists = window.__PRELOADED_STATE__?.table?.allArtists ?? [
      'Lady Gaga',
    ];
    const allGenresRaw = window.__QUERY_CLIENT__?.['GENRES_QUERY_KEY'];
    const allGenres = Array.isArray(allGenresRaw) ? allGenresRaw : [];
    return getQueryParamsFromUrl(window.location.search, allGenres, allArtists);
  }
  return DEFAULT_PARAMS;
})();

export interface TableMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
export interface TableState {
  selectMode: boolean;
  params: QueryParams;
  sorting: SortingState;
  meta: TableMeta;
  allArtists: ArtistsType;
}

export const initialState: TableState = {
  selectMode: true,
  params: initialParamsFromUrl,
  sorting: DEFAULT_SORTING,
  meta: DEFAULT_META,
  allArtists: ['Lady Gaga'],
};

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setSelectMode: (state, action: PayloadAction<boolean>) => {
      state.selectMode = action.payload;
    },
    setTableParams: (state, action: PayloadAction<Partial<QueryParams>>) => {
      state.params = { ...state.params, ...action.payload };
    },
    setSorting: (state, action: PayloadAction<SortingState>) => {
      state.sorting = action.payload;
    },
    setMeta: (state, action: PayloadAction<TableMeta>) => {
      state.meta = action.payload;
    },
    setAllArtists: (state, action: PayloadAction<ArtistsType>) => {
      state.allArtists = action.payload;
    },
    updateSorting: (state, action: PayloadAction<SortingState>) => {
      const nextSorting = action.payload;
      state.sorting = nextSorting;
      const sortParams = getSortParamsFromSortingState(nextSorting);
      state.params = {
        ...state.params,
        ...sortParams,
        page: META.page,
      };
    },
    updatePage: (state, action: PayloadAction<number | string>) => {
      state.params = { ...state.params, page: action.payload };
    },
    updateLimit: (state, action: PayloadAction<number>) => {
      state.params = {
        ...state.params,
        limit: action.payload,
        page: META.page,
      };
    },
    updateSearch: (state, action: PayloadAction<string>) => {
      state.params = {
        ...state.params,
        search: action.payload,
        page: META.page,
      };
    },
  },
});

export const {
  setSelectMode,
  setTableParams,
  setSorting,
  setMeta,
  updatePage,
  updateLimit,
  updateSorting,
  updateSearch,
  setAllArtists,
} = tableSlice.actions;

export const selectSelectMode = (state: RootState) => state.table.selectMode;
export const selectTableParams = (state: RootState) => state.table.params;
export const selectSorting = (state: RootState) => state.table.sorting;
export const selectMeta = (state: RootState) => state.table.meta;
export const selectAllArtists = (state: RootState) => state.table.allArtists;

export default tableSlice.reducer;
