import { PlayingTrackIdState } from '@/types/zustand/playingTrackId';
import { create } from 'zustand';

export const usePlayingTrackStore = create<PlayingTrackIdState>((set) => ({
  playingTrackId: null,
  setPlayingTrackId: (playingTrackId) => set({ playingTrackId }),
}));
