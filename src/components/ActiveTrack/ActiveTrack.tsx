import { useActiveTrackController } from '@/utils/hooks/audio/useActiveTrackController';
import TrackInfo from './TrackInfo';
import Controls from './Controls';
import { TrackWaveform } from '../Audio';
import { Skeleton } from '../ui/skeleton';

export default function ActiveTrack() {
  const { current, isLoading, random, next, prev } = useActiveTrackController();

  return (
    <div className='fixed bottom-0 left-0 z-40 w-full h-20 bg-background dark:bg-card rounded-xl px-6 py-3 flex items-center justify-between gap-10 border-t-2 border-gray-300 dark:border-border'>
      <TrackInfo
        title={current?.title}
        artist={current?.artist}
        loading={isLoading}
      />

      {isLoading ? (
        <Skeleton className='h-12 w-full rounded-md' />
      ) : (
        current?.audioFile && (
          <div className='flex-1'>
            <TrackWaveform
              id={`player-${current.id}`}
              audioFile={current.audioFile}
            />
          </div>
        )
      )}

      <Controls
        onPrev={prev}
        onNext={next}
        shuffleOn={random}
      />
    </div>
  );
}
