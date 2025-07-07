import { lazy, useState, useCallback, Suspense } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TRACKS_LIST_KEY } from '@/constants/table.constants';
import { BTNS_LABELS } from '@/constants/labels.constant';
import { Eye, EyeClosed } from '@/components/icons';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Loader } from '@/components/shared';

const ActiveTrack = lazy(() =>
  import('@/components/ActiveTrack').then((m) => ({ default: m.ActiveTrack }))
);
const TrackTable = lazy(() =>
  import('@/components/TrackTable').then((m) => ({ default: m.TrackTable }))
);
const CreateTrackModal = lazy(() =>
  import('@/components/Modal').then((m) => ({
    default: m.CreateTrackModal,
  }))
);

function TracksPage() {
  const [open, setOpen] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);

  const handleTogglePlayer = useCallback(
    () => setIsPlayerVisible((prev) => !prev),
    []
  );

  const handleDialogOpenChange = useCallback(
    (open: boolean) => setOpen(open),
    []
  );

  return (
    <main className='flex flex-col min-h-screen'>
      <div className='sticky z-40 bg-white border-b'>
        <Suspense fallback={<Loader loading />}>
          {isPlayerVisible && <ActiveTrack />}
        </Suspense>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='icon'
                variant='ghost'
                onClick={handleTogglePlayer}
                aria-label={isPlayerVisible ? 'Hide player' : 'Show player'}
                data-testid='toggle-player-button'
                className='absolute top-4 right-2 h-12 w-12'>
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
          onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button
              type='button'
              data-testid='create-track-button'
              className='mb-4'>
              {BTNS_LABELS.CREATE_TRACK}
            </Button>
          </DialogTrigger>
          <Suspense fallback={<Loader loading />}>
            <CreateTrackModal onClose={() => setOpen(false)} />
          </Suspense>
        </Dialog>
        <Suspense fallback={<Loader loading />}>
          <TrackTable />
        </Suspense>
      </section>
    </main>
  );
}

export default TracksPage;
