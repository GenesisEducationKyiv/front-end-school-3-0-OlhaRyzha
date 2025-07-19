import { useMemo } from 'react';
import { useGetAllTracks } from '@/utils/hooks/tanStackQuery/useTracksQuery';
import { useTrackNavigation } from './useTrackNavigation';
import { useAppSelector } from '@/store';
import { selectRandom } from '@/store/slices/activeTrack/activeTrackSlice';
import { useActiveTrack } from './useActiveTrack';

const WS_URL = import.meta.env.VITE_WS_URL;

export function useActiveTrackController() {
  const random = useAppSelector(selectRandom);

  const { data: tracks = [], isLoading } = useGetAllTracks();

  const { index, next, prev } = useTrackNavigation(tracks);
  const randomTrack = useActiveTrack(random ? WS_URL : null);

  const current = useMemo(
    () => (random ? randomTrack : tracks[index]),
    [random, randomTrack, tracks, index]
  );
  const isCurrentTrackLoading = random && !current;

  return {
    current,
    isLoading: isCurrentTrackLoading || isLoading,
    next,
    prev,
    random,
  };
}
