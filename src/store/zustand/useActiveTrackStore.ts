import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  ActiveTrackActions,
  ActiveTrackState,
} from '@/types/zustand/activeTrack';
import { isFunction } from 'formik';

export const useActiveTrackStore = create<
  ActiveTrackState & ActiveTrackActions
>()(
  devtools((set) => ({
    index: 0,
    random: false,
    playing: false,

    toggleRandom: () => set((state) => ({ random: !state.random })),
    setIndex: (idxOrFn) =>
      set((state) => ({
        index: isFunction(idxOrFn) ? idxOrFn(state.index) : idxOrFn,
      })),
    setPlaying: (v) => set({ playing: v }),
  }))
);

export const selectIndex = (s: ActiveTrackState) => s.index;
export const selectRandom = (s: ActiveTrackState) => s.random;

export const selectToggleRandom = (s: ActiveTrackActions) => s.toggleRandom;
export const selectSetIndex = (s: ActiveTrackActions) => s.setIndex;
export const selectSetPlaying = (s: ActiveTrackActions) => s.setPlaying;
