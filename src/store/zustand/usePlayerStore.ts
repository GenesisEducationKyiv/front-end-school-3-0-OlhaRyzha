import { create } from 'zustand';
import { PlayerState } from '@/types/zustand/player';

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  play: (track) => {
    set({ currentTrack: track, isPlaying: true });
  },
  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },
  stop: () => {
    set({ currentTrack: null, isPlaying: false });
  },
}));
