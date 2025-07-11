import { RootState } from '@/store/rootReducer';
import { ValueSetter } from '@/types/base';
import { createSlice } from '@reduxjs/toolkit';

export interface AudioUploadState {
  file: ValueSetter<File>;
  url: ValueSetter<string>;
  error: ValueSetter<string>;
}

const initialState: AudioUploadState = {
  file: null,
  url: null,
  error: null,
};

const audioUploadSlice = createSlice({
  name: 'audioUpload',
  initialState,
  reducers: {
    setFile(state, action) {
      state.file = action.payload;
    },
    setUrl(state, action) {
      state.url = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    reset(state) {
      state.file = null;
      state.url = null;
      state.error = null;
    },
  },
});

export const { setFile, setUrl, setError, reset } = audioUploadSlice.actions;

export const selectAudioUploadFile = (state: RootState) =>
  state.audioUpload.file;
export const selectAudioUploadUrl = (state: RootState) => state.audioUpload.url;
export const selectAudioUploadError = (state: RootState) =>
  state.audioUpload.error;

export default audioUploadSlice.reducer;
