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
