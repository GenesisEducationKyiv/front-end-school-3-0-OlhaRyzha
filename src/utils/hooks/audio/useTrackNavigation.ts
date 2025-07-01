import { useActiveTrackStore } from '@/store/zustand/useActiveTrackStore';
import { Track } from '@/types/shared/track';

export function useTrackNavigation(tracks: Track[]) {
  const { index, setIndex, setPlaying } = useActiveTrackStore();

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
  return { index, next, prev };
}
