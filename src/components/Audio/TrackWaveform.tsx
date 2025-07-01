import { lazy, Suspense } from 'react';
import { Loader } from '@/components/shared';
import { getTrackAudioUrl } from '@/utils/getTrackAudioUrl';
import { useAudioUrl } from '@/utils/hooks/audio/useAudioUrl';
import { usePlayingTrackStore } from '@/store/zustand/usePlayingTrackStore';
import { ValueSetter } from '@/types/zustand/base';

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
  const src = previewUrl ?? (audioFile ? getTrackAudioUrl(audioFile) : null);
  const { url, loading, error } = useAudioUrl(id, src);
  const { playingTrackId, setPlayingTrackId } = usePlayingTrackStore();
  const isPlaying = playingTrackId === id;

  const handlePlayPause = () => {
    setPlayingTrackId(isPlaying ? null : id);
    onPlayPauseExternal?.(id, !isPlaying);
  };

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
