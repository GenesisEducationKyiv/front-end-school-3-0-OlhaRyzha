import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectActiveTrackIndex,
  setIndex,
  setPlaying,
} from '@/store/slices/activeTrack/activeTrackSlice';
import { Track } from '@/types/shared/track';

export function useTrackNavigation(tracks: Track[]) {
  const dispatch = useAppDispatch();
  const index = useAppSelector(selectActiveTrackIndex);
  const length = tracks.length;

  const goTo = useCallback(
    (offset: number) => {
      const newIndex = length ? (index + offset + length) % length : 0;
      dispatch(setIndex(newIndex));
      dispatch(setPlaying(false));
    },
    [dispatch, index, length]
  );

  const next = useCallback(() => goTo(1), [goTo]);
  const prev = useCallback(() => goTo(-1), [goTo]);

  return { index, next, prev };
}
