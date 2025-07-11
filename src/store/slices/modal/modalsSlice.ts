import { RootState } from '@/store/rootReducer';
import { Track } from '@/types/shared/track';
import { ValueSetter } from '@/types/base';
import { createSlice } from '@reduxjs/toolkit';

export type ModalAction = 'edit' | 'upload' | 'delete';

export interface ModalsState {
  selectedTrack: ValueSetter<Track>;
  modalAction: ValueSetter<ModalAction>;
}

const initialState: ModalsState = {
  selectedTrack: null,
  modalAction: null,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal(state, action) {
      state.selectedTrack = action.payload.selectedTrack;
      state.modalAction = action.payload.modalAction;
    },
    closeModal(state) {
      state.selectedTrack = null;
      state.modalAction = null;
    },
  },
});

export const { openModal, closeModal } = modalsSlice.actions;

export const selectModalTrack = (state: RootState) =>
  state.modals.selectedTrack;
export const selectModalAction = (state: RootState) => state.modals.modalAction;

export default modalsSlice.reducer;
