import { audioUploadMessages } from '@/constants/message.constant';
import {
  useAudioBlobStore,
  selectBlobById,
  selectSetBlob,
  selectRemoveBlob,
} from '@/store/zustand/useAudioBlobStore';
import { ValueSetter } from '@/types/zustand/base';
import { fetchAudioBlobResult } from '@/utils/fetchAudioBlob';
import { useState, useEffect, useRef } from 'react';

export function useAudioUrl(id: string, src?: ValueSetter<string>) {
  const blobUrl = useAudioBlobStore(selectBlobById(id));
  const setBlob = useAudioBlobStore(selectSetBlob);
  const removeBlob = useAudioBlobStore(selectRemoveBlob);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ValueSetter<string>>(null);

  const createdByThisHook = useRef(false);

  useEffect(() => {
    if (!src) {
      setError(null);
      setLoading(false);
      return;
    }

    if (blobUrl) {
      setError(null);
      setLoading(false);
      createdByThisHook.current = false;
      return;
    }

    let ignore = false;
    setLoading(true);
    setError(null);

    fetchAudioBlobResult(src)
      .then((result) => {
        if (ignore) return;
        if (result.isErr()) {
          setError(result.error);
        } else {
          const url = URL.createObjectURL(result.value);
          setBlob(id, url);
          createdByThisHook.current = true;
        }
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message || audioUploadMessages.audioLoadError);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
      if (createdByThisHook.current && blobUrl) {
        removeBlob(id);
      }
    };
  }, [id, src, setBlob, removeBlob, blobUrl]);

  return { url: blobUrl ?? null, loading, error };
}
