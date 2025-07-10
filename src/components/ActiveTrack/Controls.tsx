import { FC } from 'react';
import { Button } from '../ui/button';
import { Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { toggleRandom } from '@/store/slices/activeTrack/activeTrackSlice';

interface ControlsProps {
  onPrev: () => void;
  onNext: () => void;
  shuffleOn: boolean;
}

const Controls: FC<ControlsProps> = ({ onPrev, onNext, shuffleOn }) => {
  const dispatch = useAppDispatch();
  return (
    <div className='flex gap-4 mr-10'>
      <Button
        size='icon'
        variant='outline'
        className='h-12 w-12 disabled:opacity-100'
        onClick={onPrev}
        disabled={shuffleOn}
        aria-label='Previous track'
        title='Previous track'
        data-testid='prev-button'>
        <SkipBack size={20} />
      </Button>
      <Button
        size='icon'
        variant={shuffleOn ? 'default' : 'outline'}
        className='h-12 w-12 disabled:opacity-100'
        aria-pressed={shuffleOn}
        aria-label={shuffleOn ? 'Disable shuffle' : 'Enable shuffle'}
        title={shuffleOn ? 'Disable shuffle' : 'Enable shuffle'}
        data-testid='shuffle-button'>
        <Shuffle size={20} />
      </Button>
      <Button
        size='icon'
        variant='outline'
        className='h-12 w-12 disabled:opacity-100'
        onClick={onNext}
        disabled={shuffleOn}
        aria-label='Next track'
        title='Next track'
        data-testid='next-button'>
        <SkipForward size={20} />
      </Button>
    </div>
  );
};
export default Controls;
