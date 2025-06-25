import { create } from 'zustand';
import { ModalsState } from '@/types/zustand/modal';

export const useModalsStore = create<ModalsState>((set) => ({
  selectedTrack: null,
  modalAction: null,

  openModal: (track, action) =>
    set({ selectedTrack: track, modalAction: action }),

  closeModal: () => set({ selectedTrack: null, modalAction: null }),
}));

export const selectSelectedTrack = (s: ModalsState) => s.selectedTrack;
export const selectModalAction = (s: ModalsState) => s.modalAction;

export const selectOpenModal = (s: ModalsState) => s.openModal;
export const selectCloseModal = (s: ModalsState) => s.closeModal;
