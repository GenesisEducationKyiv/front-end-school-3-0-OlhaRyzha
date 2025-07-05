import { useMemo } from 'react';
import { useGetAllTracks } from '@/utils/hooks/tanStackQuery/useTracksQuery';
import { useActiveTrackStore } from '@/store/zustand/useActiveTrackStore';
import { useTrackNavigation } from './useTrackNavigation';
import { useRandomTrackWS } from './useRandomTrackWS';

export function useActiveTrackController() {
  const { data: tracks = [], isLoading } = useGetAllTracks();

  const { random, toggleRandom } = useActiveTrackStore();
  const { index, next, prev } = useTrackNavigation(tracks);
  const randomTrack = useRandomTrackWS(random);

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
    toggleRandom,
    random,
  };
}
