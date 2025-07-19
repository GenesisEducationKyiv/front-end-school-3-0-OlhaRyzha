import { IdType } from './../../../types/ids';
import { useAudioBlob } from '@/utils/hooks/tanStackQuery/useAudioBlobQuery';
import { audioUploadMessages } from '@/constants/message.constant';
import { ValueSetter } from '@/types/base';
import { useObjectUrl } from './useObjectUrl';
import { isBlobUrl } from '@/utils/guards/isBlobUrl';

export function useAudioUrl(id: IdType, src?: ValueSetter<string>) {
  const isBlob = isBlobUrl(src);
  const localUrl = isBlob ? src : null;
  const {
    data: blob,
    isLoading,
    isError,
    error,
  } = useAudioBlob(id, !isBlob ? src : undefined);

  const objectUrl = useObjectUrl(blob ?? null);
  const url = localUrl ?? objectUrl;

  const loadError = isError
    ? (error?.message ?? audioUploadMessages.audioLoadError)
    : null;

  return { url, loading: isLoading, error: loadError };
}
