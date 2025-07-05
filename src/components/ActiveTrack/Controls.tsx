import { FC } from 'react';
import { Button } from '../ui/button';
import { Shuffle, SkipBack, SkipForward } from 'lucide-react';

interface ControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onShuffle: () => void;
  shuffleOn: boolean;
}

const Controls: FC<ControlsProps> = ({
  onPrev,
  onNext,
  onShuffle,
  shuffleOn,
}) => (
  <div className='flex gap-2'>
    <Button
      size='icon'
      variant='outline'
      onClick={onPrev}
      disabled={shuffleOn}>
      <SkipBack size={20} />
    </Button>
    <Button
      size='icon'
      variant={shuffleOn ? 'default' : 'outline'}
      onClick={onShuffle}>
      <Shuffle size={20} />
    </Button>
    <Button
      size='icon'
      variant='outline'
      onClick={onNext}
      disabled={shuffleOn}>
      <SkipForward size={20} />
    </Button>
  </div>
);
export default Controls;
