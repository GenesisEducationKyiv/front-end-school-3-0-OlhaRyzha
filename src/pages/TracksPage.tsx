import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { lazy, useState } from 'react';
import { TRACKS_LIST_KEY } from '@/constants/table.constants';
import { BTNS_LABELS } from '@/constants/labels.constant';
import { Eye, EyeClosed } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

const ActiveTrack = lazy(() =>
  import('@/components/ActiveTrack').then((m) => ({ default: m.ActiveTrack }))
);
const TrackTable = lazy(() =>
  import('@/components/TrackTable').then((m) => ({ default: m.TrackTable }))
);
const CreateTrackModal = lazy(() =>
  import('@/components/Modal').then((m) => ({ default: m.CreateTrackModal }))
);

function TracksPage() {
  const [open, setOpen] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);

  return (
    <main className='flex flex-col min-h-screen'>
      <div className='relative sticky top-0 z-40 bg-white border-b'>
        {isPlayerVisible && <ActiveTrack />}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => setIsPlayerVisible((prev) => !prev)}
                className='absolute top-[0.3px] right-2'>
                {isPlayerVisible ? <EyeClosed size={20} /> : <Eye size={20} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side='left'>
              {isPlayerVisible ? 'Hide player' : 'Show player'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <section className='p-6 flex-1 overflow-y-auto'>
        <h1
          data-testid='tracks-header'
          className='text-2xl font-bold mb-4 capitalize'>
          {TRACKS_LIST_KEY}
        </h1>

        <Dialog
          open={open}
          onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type='button'
              data-testid='create-track-button'
              className='mb-4'>
              {BTNS_LABELS.CREATE_TRACK}
            </Button>
          </DialogTrigger>
          <CreateTrackModal onClose={() => setOpen(false)} />
        </Dialog>

        <TrackTable />
      </section>
    </main>
  );
}

export default TracksPage;
