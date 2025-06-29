import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon } from 'lucide-react';

interface WaveformPlayButtonProps {
  isPlaying?: boolean;
  onClick: () => void;
  className?: string;
  iconClassName?: string;
}

const WaveformPlayButton = ({
  isPlaying,
  onClick,
  className = '',
  iconClassName = 'waveform-icon',
}: WaveformPlayButtonProps) => (
  <motion.button
    type='button'
    onClick={onClick}
    className={className}
    whileTap={{ scale: 0.9 }}
    animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
    transition={{ duration: 0.5 }}>
    {isPlaying ? (
      <PauseIcon className={iconClassName} />
    ) : (
      <PlayIcon className={iconClassName} />
    )}
  </motion.button>
);

export default WaveformPlayButton;
