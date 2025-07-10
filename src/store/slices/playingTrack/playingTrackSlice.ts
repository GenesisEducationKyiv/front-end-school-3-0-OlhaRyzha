import { createSlice } from '@reduxjs/toolkit';
import { ValueSetter } from '@/types/base';
import { RootState } from '@/store';

export interface PlayingTrackIdState {
  playingTrackId: ValueSetter<string>;
}

const initialState: PlayingTrackIdState = {
  playingTrackId: null,
};

const playingTrackSlice = createSlice({
  name: 'playingTrack',
  initialState,
  reducers: {
    setPlayingTrackId(state, action) {
      state.playingTrackId = action.payload;
    },
  },
});

export const { setPlayingTrackId } = playingTrackSlice.actions;
export const selectPlayingTrackId = (state: RootState) =>
  state.playingTrack.playingTrackId;
export default playingTrackSlice.reducer;
