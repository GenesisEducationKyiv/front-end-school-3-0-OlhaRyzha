import fileBroken from '@/assets/transparent-file-broken-sign-computer.webp';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WaveformErrorTooltipProps {
  error: string;
  imgSrc?: string;
  className?: string;
  alt?: string;
}

const WaveformErrorTooltip = ({
  error,
  imgSrc,
  className = 'waveform-broken-img',
  alt = 'Error',
}: WaveformErrorTooltipProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <img
          src={imgSrc || fileBroken}
          alt={alt}
          className={className}
          loading='lazy'
        />
      </TooltipTrigger>
      <TooltipContent>{error}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default WaveformErrorTooltip;
