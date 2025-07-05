import { TableState } from '@/store/slices/table/tableSlice';
import { Page } from '@playwright/test';
import { Store } from '@reduxjs/toolkit';

declare global {
  interface Window {
    __PRELOADED_STATE__?: {
      table?: Partial<TableState>;
    };
    __QUERY_CLIENT__?: {
      [key: string]: unknown;
    };
  }
}
declare global {
  interface Window {
    __REDUX_STORE__?: Store;
  }
}

export type GetTrackNames = (page: Page) => Promise<string[]>;
export type WaitForLoaderToDisappear = (page: Page) => Promise<void>;

export interface FilterAction {
  filterType: string;
  selectValue: string;
  resetValue: string;
}

export interface FilterSelection {
  filterType: string;
  value: string;
}
