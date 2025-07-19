import { Action, combineReducers, Reducer } from 'redux';
import table, { TableState } from './slices/table/tableSlice';
import activeTrack, {
  ActiveTrackState,
} from './slices/activeTrack/activeTrackSlice';
import audioUpload, { AudioUploadState } from './slices/audio/audioUploadSlice';
import modals, { ModalsState } from './slices/modal/modalsSlice';
import playingTrack, {
  PlayingTrackIdState,
} from './slices/playingTrack/playingTrackSlice';

export type RootState = {
  table: TableState;
  activeTrack: ActiveTrackState;
  audioUpload: AudioUploadState;
  modals: ModalsState;
  playingTrack: PlayingTrackIdState;
};

export interface AsyncReducers {
  [key: string]: Reducer<RootState, Action>;
}

const staticReducers = {
  table,
  activeTrack,
  audioUpload,
  modals,
  playingTrack,
};

const rootReducer = (asyncReducers?: AsyncReducers) => {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
};

export default rootReducer;
