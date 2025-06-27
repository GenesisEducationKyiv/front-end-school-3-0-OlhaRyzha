import { PlayingTrackIdState } from '@/types/zustand/playingTrackId';
import { create } from 'zustand';

export const usePlayingTrackStore = create<PlayingTrackIdState>((set) => ({
  playingTrackId: null,
  setPlayingTrackId: (playingTrackId) => set({ playingTrackId }),
}));

export const selectPlayingTrackId = (s: PlayingTrackIdState) =>
  s.playingTrackId;
export const selectSetPlayingTrackId = (s: PlayingTrackIdState) =>
  s.setPlayingTrackId;
