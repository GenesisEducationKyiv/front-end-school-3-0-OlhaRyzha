import { useActiveTrackController } from '@/utils/hooks/audio/useActiveTrackController';
import TrackInfo from './TrackInfo';
import Controls from './Controls';
import { TrackWaveform } from '../Audio';

export default function ActiveTrack() {
  const { current, isLoading, random, next, prev, toggleRandom } =
    useActiveTrackController();

  return (
    <div className='relative w-full bg-white shadow-md rounded-xl px-6 py-3 flex items-center justify-between gap-10'>
      <TrackInfo
        title={current?.title}
        artist={current?.artist}
        loading={isLoading}
      />

      {current?.audioFile && (
        <div className='flex-1'>
          <TrackWaveform
            id={current.id}
            audioFile={current.audioFile}
          />
        </div>
      )}

      <Controls
        onPrev={prev}
        onNext={next}
        onShuffle={toggleRandom}
        shuffleOn={random}
      />
    </div>
  );
}
