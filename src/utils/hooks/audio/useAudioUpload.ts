import { useRef, ChangeEvent, useEffect, useState } from 'react';
import { validateAudioFile } from '@/utils/audioUpload';
import { validationMessages } from '@/constants/message.constant';
import { Track } from '@/types/shared/track';
import {
  useDeleteTrackAudio,
  useUploadTrackAudio,
} from '../tanStackQuery/useTracksQuery';
import { invariant } from '@/utils/invariant';
import { useObjectUrl } from './useObjectUrl';
import { R } from '@mobily/ts-belt';
import { ValueSetter } from '@/types/base';

interface UseAudioUploadProps {
  track: Track;
  onOpenChange: (open: boolean) => void;
  onUploaded?: () => void;
}

export function useAudioUpload({
  track,
  onOpenChange,
  onUploaded,
}: UseAudioUploadProps) {
  const [file, setFile] = useState<ValueSetter<File>>(null);
  const [error, setError] = useState<ValueSetter<string>>(null);
  const url = useObjectUrl(file);

  const { mutateAsync: upload, isPending } = useUploadTrackAudio();
  const { mutateAsync: remove } = useDeleteTrackAudio();

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFile(null);
    setError(null);
  }, [track.id]);

  const handleChoose = () => {
    fileRef.current?.click();
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (!selected) return;

    const result = await validateAudioFile(selected);
    R.match(
      () => {
        setError(null);
        setFile(selected);
      },
      (msg: string) => {
        setError(msg);
        setFile(null);
      }
    )(result);
  };

  const clear = () => {
    setFile(null);
    setError(null);
  };

  const handleSave = async () => {
    invariant(file, validationMessages.requiredFile);
    try {
      await upload({ id: track.id, file });
      onOpenChange(false);
      onUploaded?.();
    } catch (error) {
      console.error(validationMessages.errorUploading, error);
    }
  };

  const handleRemove = async () => {
    await remove({ id: track.id });
    onOpenChange(false);
  };

  return {
    fileRef,
    selectedFile: file,
    selectedUrl: url,
    error,
    handleChoose,
    handleChange,
    handleSave,
    handleRemove,
    loading: isPending,
    clear,
  };
}
