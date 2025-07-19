import { AUDIO_BLOB_KEY } from '@/constants/queryKeys.constants';
import { TrackService } from '@/services';
import { ValueSetter } from '@/types/base';
import { IdType } from '@/types/ids';

import { useQuery } from '@tanstack/react-query';

export const useAudioBlob = (id: IdType, url?: ValueSetter<string>) => {
  return useQuery<Blob>({
    queryKey: [AUDIO_BLOB_KEY, id, url],
    queryFn: () => TrackService.fetchAudioBlob(id, url!),
    enabled: !!url,
    retry: false,
  });
};
