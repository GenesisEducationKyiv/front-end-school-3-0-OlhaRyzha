import { useQuery } from '@tanstack/react-query';
import { fetchAudioBlob } from '../fetchAudioBlob';

export const useCachedAudioBlob = (audioUrl?: string) => {
  return useQuery({
    queryKey: ['audio-blob', audioUrl],
    queryFn: () => fetchAudioBlob(audioUrl),
    staleTime: Infinity,
    enabled: !!audioUrl,
  });
};
