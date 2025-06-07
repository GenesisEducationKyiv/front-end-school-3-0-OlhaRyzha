import { Action, combineReducers, Reducer } from 'redux';
import table, { TableState } from './slices/table/tableSlice';

export type RootState = {
  table: TableState;
};

export interface AsyncReducers {
  [key: string]: Reducer<RootState, Action>;
}

const staticReducers = {
  table,
};

const rootReducer = (asyncReducers?: AsyncReducers) => {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
};

export default rootReducer;
