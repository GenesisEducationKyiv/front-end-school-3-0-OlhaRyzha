import { FC } from 'react';
import { Loader } from '../shared';

const TrackInfo: FC<{
  title?: string;
  artist?: string;
  loading: boolean;
}> = ({ title, artist, loading }) => (
  <div className='flex flex-col gap-1'>
    <span className='text-sm text-muted-foreground'>🎵 Now playing:</span>
    <div className='text-base font-medium truncate'>
      {title ? `${title} — ${artist}` : <Loader loading={loading} />}
    </div>
  </div>
);
export default TrackInfo;
