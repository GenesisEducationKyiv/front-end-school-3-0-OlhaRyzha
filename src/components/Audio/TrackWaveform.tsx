import { lazy, Suspense, useCallback } from 'react';
import { Loader } from '@/components/shared';
import { useAudioUrl } from '@/utils/hooks/audio/useAudioUrl';
import { useAppDispatch, useAppSelector } from '@/store';
import { ValueSetter } from '@/types/base';
import {
  selectPlayingTrackId,
  setPlayingTrackId,
} from '@/store/slices/playingTrack/playingTrackSlice';

const Waveform = lazy(() => import('@/components/Audio/AudioWaveform'));

interface TrackWaveformProps {
  id: string;
  previewUrl?: ValueSetter<string>;
  audioFile?: ValueSetter<string>;
  onPlayPauseExternal?: (id: string, isPlaying: boolean) => void;
}

function TrackWaveform({
  id,
  previewUrl,
  audioFile,
  onPlayPauseExternal,
}: TrackWaveformProps) {
  const src = previewUrl || audioFile || null;
  const { url, loading, error } = useAudioUrl(id, src);
  const dispatch = useAppDispatch();
  const playingTrackId = useAppSelector(selectPlayingTrackId);
  const isPlaying = playingTrackId === id;

  const handlePlayPause = useCallback(() => {
    const next = isPlaying ? null : id;
    dispatch(setPlayingTrackId(next));
    onPlayPauseExternal?.(id, !isPlaying);
  }, [dispatch, id, isPlaying, onPlayPauseExternal]);

  if (!url && !loading && !error) return null;

  return (
    <Suspense fallback={<Loader loading />}>
      <Waveform
        key={id}
        id={id}
        url={url}
        isPlaying={isPlaying}
        error={error}
        onPlayPause={handlePlayPause}
      />
    </Suspense>
  );
}

export default TrackWaveform;
