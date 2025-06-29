import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon } from 'lucide-react';
import fileBroken from '@/assets/png-transparent-file-broken-sign-computer.webp';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { useWaveform } from '@/utils/hooks/audio/useWaveform';
import { ValueSetter } from '@/types/zustand/base';

interface WaveformProps {
  url: ValueSetter<string>;
  id: string;
  isPlaying?: boolean;
  onPlayPause: (id: string) => void;
  loading?: boolean;
  error?: ValueSetter<string>;
}

const Waveform = ({
  url,
  id,
  isPlaying,
  onPlayPause,
  loading,
  error,
}: WaveformProps) => {
  const {
    waveformRef,
    error: waveformError,
    isLoading,
  } = useWaveform({ url, isPlaying });

  const displayError = error || waveformError;

  const handlePlayPause = () => onPlayPause(id);

  return (
    <div
      className='relative waveform-container'
      data-testid={`audio-progress-${id}`}>
      {displayError ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <img
                src={fileBroken}
                alt={displayError}
                className='waveform-broken-img'
              />
            </TooltipTrigger>
            <TooltipContent>{displayError}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : loading || isLoading ? (
        <Skeleton className='h-10 w-full rounded-md' />
      ) : (
        <motion.button
          type='button'
          onClick={handlePlayPause}
          className='waveform-play-btn'
          whileTap={{ scale: 0.9 }}
          animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5 }}>
          {isPlaying ? (
            <PauseIcon className='waveform-icon' />
          ) : (
            <PlayIcon className='waveform-icon' />
          )}
        </motion.button>
      )}

      {!displayError && (
        <div
          ref={waveformRef}
          className='waveform-progress mt-2'
        />
      )}
    </div>
  );
};

export default Waveform;
