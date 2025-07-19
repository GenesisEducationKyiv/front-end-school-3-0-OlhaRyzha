import { FC } from 'react';
import { Loader } from '../shared';
import { Skeleton } from 'tracks-manager-ui';

const TrackInfo: FC<{
  title?: string;
  artist?: string;
  loading: boolean;
}> = ({ title, artist, loading }) => (
  <div className='flex flex-col gap-1 min-w-3/6 w-3/6 flex-wrap'>
    <span className='text-sm text-muted-foreground'>🎵 Now playing:</span>
    {loading ? (
      <Skeleton className='w-full h-6' />
    ) : (
      <div className='text-base w-full h-6 font-medium truncate text-balance'>
        {title ? `${title} — ${artist}` : <Loader loading={loading} />}
      </div>
    )}
  </div>
);
export default TrackInfo;
