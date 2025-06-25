import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon } from 'lucide-react';
import fileBroken from '@/assets/png-transparent-file-broken-sign-computer.png';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useWaveform } from '@/utils/hooks/audio/useWaveform';

interface WaveformProps {
  url: string | null;
  id: string;
  isPlaying?: boolean;
  onPlayPause: (id: string) => void;
}

const Waveform = ({ url, id, isPlaying, onPlayPause }: WaveformProps) => {
  const { waveformRef, error, isLoading } = useWaveform({ url, isPlaying });

  const handlePlayPause = () => onPlayPause(id);

  return (
    <div
      className='waveform-container'
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
      ) : (
        !isLoading && (
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
        )
      )}

      {!error && (
        <div
          ref={waveformRef}
          className='waveform-progress'
        />
      )}
    </div>
  );
};

export default Waveform;
