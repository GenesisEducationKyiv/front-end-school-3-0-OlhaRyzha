import { useState, useMemo } from 'react';
import { useActiveTrack } from '@/utils/hooks/audio/useActiveTrack';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, Shuffle } from 'lucide-react';
import { useGetTracks } from '@/utils/hooks/tanStackQuery/useTracksQuery';
import { Loader } from '../shared';
import Waveform from './AudioWaveform';
import { getTrackAudioUrl } from '@/utils/getTrackAudioUrl';

function ActiveTrack() {
  const { data: tracksData, isLoading } = useGetTracks({ page: 1, limit: 100 });
  const [index, setIndex] = useState(0);
  const [randomEnabled, setRandomEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const localTracks = tracksData?.data ?? [];
  const randomTrack = useActiveTrack(
    randomEnabled ? import.meta.env.VITE_WS_URL : null
  );

  const currentTrack = useMemo(
    () => (randomEnabled ? randomTrack : localTracks[index]),
    [randomEnabled, randomTrack, localTracks, index]
  );

  const next = () => setIndex((i) => (i + 1) % localTracks.length);
  const prev = () =>
    setIndex((i) => (i - 1 + localTracks.length) % localTracks.length);
  const toggleRandom = () => setRandomEnabled((prev) => !prev);

  const togglePlayPause = () => {
    if (!isPlaying && randomEnabled) {
      setRandomEnabled(false);
    }
    setIsPlaying((p) => !p);
  };

  return (
    <div className='relative w-full bg-white shadow-md rounded-xl px-6 py-3 flex items-center justify-between gap-10'>
      <div className='flex flex-col gap-1'>
        <span className='text-sm text-muted-foreground'>🎵 Now playing:</span>
        <div className='text-base font-medium truncate'>
          {currentTrack?.title ? (
            `${currentTrack.title} — ${currentTrack.artist}`
          ) : (
            <Loader loading={isLoading} />
          )}
        </div>
      </div>

      {currentTrack?.audioFile && (
        <div className='flex-1'>
          <Waveform
            key={currentTrack?.id ?? 'waveform'}
            id={currentTrack?.id ?? 'waveform'}
            url={getTrackAudioUrl(currentTrack?.audioFile)}
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
          />
        </div>
      )}

      <div className='flex gap-2'>
        <Button
          size='icon'
          variant='outline'
          onClick={prev}
          disabled={randomEnabled}>
          <SkipBack size={20} />
        </Button>
        <Button
          size='icon'
          variant={randomEnabled ? 'default' : 'outline'}
          onClick={toggleRandom}>
          <Shuffle size={20} />
        </Button>
        <Button
          size='icon'
          variant='outline'
          onClick={next}
          disabled={randomEnabled}>
          <SkipForward size={20} />
        </Button>
      </div>
    </div>
  );
}
export default ActiveTrack;
