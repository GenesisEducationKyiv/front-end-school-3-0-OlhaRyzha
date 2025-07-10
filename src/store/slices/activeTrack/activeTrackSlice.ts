import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../rootReducer';

export interface ActiveTrackState {
  index: number;
  random: boolean;
  playing: boolean;
}

const initialState: ActiveTrackState = {
  index: 0,
  random: false,
  playing: false,
};

const activeTrackSlice = createSlice({
  name: 'activeTrack',
  initialState,
  reducers: {
    toggleRandom(state) {
      state.random = !state.random;
    },
    setIndex(state, action) {
      state.index = action.payload;
    },
    setPlaying(state, action) {
      state.playing = action.payload;
    },
  },
});

export const { toggleRandom, setIndex, setPlaying } = activeTrackSlice.actions;

export const selectActiveTrackIndex = (state: RootState) =>
  state.activeTrack.index;
export const selectRandom = (state: RootState) => state.activeTrack.random;
export const selectPlaying = (state: RootState) => state.activeTrack.playing;

export default activeTrackSlice.reducer;
