import { lazy, Suspense } from 'react';
import { Loader } from '@/components/shared';
import { getTrackAudioUrl } from '@/utils/getTrackAudioUrl';
import {
  selectPlayingTrackId,
  selectSetPlayingTrackId,
  usePlayingTrackStore,
} from '@/store/zustand/usePlayingTrackStore';

const Waveform = lazy(() => import('@/components/Audio/AudioWaveform'));

interface TrackWaveformProps {
  id: string;
  previewUrl?: string | null;
  audioFile?: string | null;
  onPlayPauseExternal?: (id: string, isPlaying: boolean) => void;
}

export function TrackWaveform({
  id,
  previewUrl,
  audioFile,
  onPlayPauseExternal,
}: TrackWaveformProps) {
  const url = previewUrl ?? (audioFile ? getTrackAudioUrl(audioFile) : null);

  const playingTrackId = usePlayingTrackStore(selectPlayingTrackId);
  const setPlayingTrackId = usePlayingTrackStore(selectSetPlayingTrackId);

  const isPlaying = playingTrackId === id;

  const handlePlayPause = () => {
    setPlayingTrackId(isPlaying ? null : id);
    if (onPlayPauseExternal) onPlayPauseExternal(id, !isPlaying);
  };

  if (!url) return null;

  return (
    <Suspense fallback={<Loader loading />}>
      <Waveform
        key={id}
        id={id}
        url={url}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
      />
    </Suspense>
  );
}

export default TrackWaveform;
