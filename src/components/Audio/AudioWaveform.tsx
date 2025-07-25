import { useWaveform } from '@/utils/hooks/audio/useWaveform';
import { ValueSetter } from '@/types/base';
import AnimatedWaveformContainer from './AnimatedWaveformContainer';
import WaveformPlayButton from './WaveformPlayButton';
import WaveformErrorTooltip from './WaveformErrorTooltip';
import { Skeleton } from 'tracks-manager-ui';

interface WaveformProps {
  url: ValueSetter<string>;
  id: string;
  isPlaying?: boolean;
  onPlayPause: (id: string) => void;
  error?: ValueSetter<string>;
}

const Waveform = ({
  url,
  id,
  isPlaying,
  onPlayPause,
  error,
}: WaveformProps) => {
  const {
    waveformRef,
    error: waveformError,
    isLoading,
    isVisible,
  } = useWaveform({
    url,
    isPlaying,
  });

  const displayError = error || waveformError;
  const handlePlayPause = () => onPlayPause(id);

  return (
    <div
      className='relative waveform-container'
      data-testid={`audio-progress-${id}`}>
      {displayError ? (
        <WaveformErrorTooltip error={displayError} />
      ) : isLoading ? (
        <Skeleton className='w-10 h-10 rounded-full shadow-md' />
      ) : (
        <WaveformPlayButton
          isPlaying={isPlaying}
          onClick={handlePlayPause}
        />
      )}

      {!displayError && (
        <AnimatedWaveformContainer
          ref={waveformRef}
          isVisible={isVisible}
          className='waveform-progress mt-2'
        />
      )}
    </div>
  );
};

export default Waveform;
