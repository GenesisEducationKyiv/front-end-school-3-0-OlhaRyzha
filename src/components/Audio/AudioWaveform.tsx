import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon } from 'lucide-react';
import fileBroken from '@/assets/png-transparent-file-broken-sign-computer.png';
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
  const { waveformRef } = useWaveform({ url, isPlaying });

  const handlePlayPause = () => onPlayPause(id);

  return (
    <div
      className='relative waveform-container'
      data-testid={`audio-progress-${id}`}>
      {error ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <img
                src={fileBroken}
                alt={error}
                className='waveform-broken-img'
              />
            </TooltipTrigger>
            <TooltipContent>{error}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : loading ? (
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

      {!error && (
        <div
          ref={waveformRef}
          className='waveform-progress mt-2'
        />
      )}
    </div>
  );
};

export default Waveform;
