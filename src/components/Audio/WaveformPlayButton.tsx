import { cn } from '@/lib/utils';
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
  <button
    type='button'
    onClick={onClick}
    className={cn(
      'waveform-play-btn',
      'active:scale-90 transition-transform duration-150',
      'animate-in fade-in zoom-in',
      className
    )}
    style={{ animationDuration: '0.7s' }}>
    {isPlaying ? (
      <PauseIcon className={iconClassName} />
    ) : (
      <PlayIcon className={iconClassName} />
    )}
  </button>
);

export default WaveformPlayButton;
