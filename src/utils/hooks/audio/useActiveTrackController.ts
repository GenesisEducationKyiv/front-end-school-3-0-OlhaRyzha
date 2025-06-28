import { useMemo } from 'react';
import { useAllGetTracks } from '@/utils/hooks/tanStackQuery/useTracksQuery';
import { useActiveTrack } from '@/utils/hooks/audio/useActiveTrack';
import {
  selectIndex,
  selectRandom,
  selectSetIndex,
  selectSetPlaying,
  selectToggleRandom,
  useActiveTrackStore,
} from '@/store/zustand/useActiveTrackStore';

const WS_URL = import.meta.env.VITE_WS_URL;

export function useActiveTrackController() {
  const { data, isLoading } = useAllGetTracks();
  const tracks = data || [];

  const index = useActiveTrackStore(selectIndex);
  const toggleRandom = useActiveTrackStore(selectToggleRandom);
  const random = useActiveTrackStore(selectRandom);
  const setIndex = useActiveTrackStore(selectSetIndex);
  const setPlaying = useActiveTrackStore(selectSetPlaying);

  const next = () => {
    setIndex((i) => (tracks.length ? (i + 1) % tracks.length : 0));
    setPlaying(false);
  };
  const prev = () => {
    setIndex((i) =>
      tracks.length ? (i - 1 + tracks.length) % tracks.length : 0
    );
    setPlaying(false);
  };

  const randomTrack = useActiveTrack(random ? WS_URL : null);

  const current = useMemo(
    () => (random ? randomTrack : tracks[index]),
    [random, randomTrack, tracks, index]
  );

  return {
    current,
    isLoading,
    next,
    prev,
    toggleRandom,
    random,
  };
}
