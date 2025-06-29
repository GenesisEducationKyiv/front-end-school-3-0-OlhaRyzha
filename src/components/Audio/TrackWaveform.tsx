import { lazy, Suspense } from 'react';
import { Loader } from '@/components/shared';
import { getTrackAudioUrl } from '@/utils/getTrackAudioUrl';

const Waveform = lazy(() => import('@/components/Audio/AudioWaveform'));

interface TrackWaveformProps {
  id: string;
  previewUrl?: string | null;
  audioFile?: string | null;
  isPlaying: boolean;
  onPlayPause: (id: string) => void;
}

export function TrackWaveform({
  id,
  previewUrl,
  audioFile,
  isPlaying,
  onPlayPause,
}: TrackWaveformProps) {
  const url = previewUrl ?? (audioFile ? getTrackAudioUrl(audioFile) : null);
  if (!url) return null;

  return (
    <Suspense fallback={<Loader loading />}>
      <Waveform
        key={id}
        id={id}
        url={url}
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
      />
    </Suspense>
  );
}
export default TrackWaveform;
