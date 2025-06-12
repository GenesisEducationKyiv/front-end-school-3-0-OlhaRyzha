import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/rootReducer';
import type { QueryParams } from '@/types/shared/track';
import type { SortingState } from '@tanstack/react-table';
import { META } from '@/constants/table.constants';

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
}

export const initialState: TableState = {
  selectMode: true,
  params: {},
  sorting: [],
  meta: {
    total: META.total,
    totalPages: META.page,
    currentPage: META.page,
    limit: META.limit,
  },
};

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setSelectMode: (state, action: PayloadAction<boolean>) => {
      state.selectMode = action.payload;
    },
    setTableParams: (state, action: PayloadAction<QueryParams>) => {
      state.params = action.payload;
    },
    setSorting: (state, action: PayloadAction<SortingState>) => {
      state.sorting = action.payload;
    },
    setMeta: (state, action: PayloadAction<TableMeta>) => {
      state.meta = action.payload;
    },
    updateSorting: (state, action: PayloadAction<SortingState>) => {
      const nextSorting = action.payload;
      state.sorting = nextSorting;
      if (nextSorting?.length) {
        state.params = {
          ...state.params,
          sort: nextSorting[0].id as QueryParams['sort'],
          order: nextSorting[0].desc ? 'desc' : 'asc',
          page: META.page,
        };
      } else {
        state.params = {
          ...state.params,
          sort: undefined,
          order: undefined,
          page: META.page,
        };
      }
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
} = tableSlice.actions;

export const selectSelectMode = (state: RootState) => state.table.selectMode;
export const selectTableParams = (state: RootState) => state.table.params;
export const selectSorting = (state: RootState) => state.table.sorting;
export const selectMeta = (state: RootState) => state.table.meta;

export default tableSlice.reducer;
