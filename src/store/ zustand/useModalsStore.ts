import { create } from 'zustand';
import { ModalsState } from '@/types/zustand/modal';

export const useModalsStore = create<ModalsState>((set) => ({
  selectedTrack: null,
  modalAction: null,

  openModal: (track, action) =>
    set({ selectedTrack: track, modalAction: action }),

  closeModal: () => set({ selectedTrack: null, modalAction: null }),
}));

export const useModalsState = () => {
  return useModalsStore((state) => ({
    selectedTrack: state.selectedTrack,
    modalAction: state.modalAction,
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));
};
