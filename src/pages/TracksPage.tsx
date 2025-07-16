import { lazy, useState, Suspense } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
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
import { Button } from 'tracks-manager-ui';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/utils/hooks/theme/useTheme';
import { Button } from 'tracks-manager-ui';

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
  const { theme, toggleTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);

  const handleTogglePlayer = () => setIsPlayerVisible((prev) => !prev);

  const handleDialogOpenChange = (open: boolean) => setOpen(open);

  return (
    <main className='flex flex-col min-h-screen'>
      <section className='p-6 flex-1 overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h1
            data-testid='tracks-header'
            className='text-2xl font-bold capitalize'>
            {TRACKS_LIST_KEY}
          </h1>
          <div className='flex justify-center items-center gap-2'>
            {isPlayerVisible && (
              <Suspense fallback={<Loader loading />}>
                <ActiveTrack />
              </Suspense>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={handleTogglePlayer}
                    aria-label={isPlayerVisible ? 'Hide player' : 'Show player'}
                    data-testid='toggle-player-button'
                    className='h-12 w-12'>
                    {isPlayerVisible ? (
                      <EyeClosed size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </Button>
                </TooltipTrigger>

                <TooltipContent side='left'>
                  {isPlayerVisible ? 'Hide player' : 'Show player'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </div>

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
