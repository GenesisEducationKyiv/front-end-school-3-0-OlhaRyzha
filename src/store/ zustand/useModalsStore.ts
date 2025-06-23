import { ModalsState } from '@/types/zustand/modal';
import { create } from 'zustand';

export const useModalsStore = create<ModalsState>((set) => ({
  trackForEdit: {
    value: null,
    setValue: (track) =>
      set((s) => ({
        trackForEdit: { ...s.trackForEdit, value: track },
      })),
  },
  trackForUpload: {
    value: null,
    setValue: (track) =>
      set((s) => ({
        trackForUpload: { ...s.trackForUpload, value: track },
      })),
  },
  trackForDelete: {
    value: null,
    setValue: (track) =>
      set((s) => ({
        trackForDelete: { ...s.trackForDelete, value: track },
      })),
  },
}));

export const selectTrackForEdit = (s: ModalsState) => s.trackForEdit.value;
export const selectSetTrackForEdit = (s: ModalsState) =>
  s.trackForEdit.setValue;

export const selectTrackForUpload = (s: ModalsState) => s.trackForUpload.value;
export const selectSetTrackForUpload = (s: ModalsState) =>
  s.trackForUpload.setValue;

export const selectTrackForDelete = (s: ModalsState) => s.trackForDelete.value;
export const selectSetTrackForDelete = (s: ModalsState) =>
  s.trackForDelete.setValue;
