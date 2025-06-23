import { NullableSetter } from '@/types/zustand/base';
import { create } from 'zustand';

export const usePlayingTrackStore = create<NullableSetter<string>>((set) => ({
  value: null,
  setValue: (id) => set({ value: id }),
}));

export const selectPlayingTrackId = (s: NullableSetter<string>) => s.value;
export const selectSetPlayingTrackId = (s: NullableSetter<string>) =>
  s.setValue;
