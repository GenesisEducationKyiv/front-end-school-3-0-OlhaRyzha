import { Action, combineReducers, Reducer } from 'redux';
import cache, { CacheState } from './slices/cacheParams/cacheSlice';
import table, { TableState } from './slices/table/tableSlice';

export type RootState = {
  cache: CacheState;
  table: TableState;
};

export interface AsyncReducers {
  [key: string]: Reducer<RootState, Action>;
}

const staticReducers = {
  cache,
  table,
};

const rootReducer = (asyncReducers?: AsyncReducers) => {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
};

export default rootReducer;
