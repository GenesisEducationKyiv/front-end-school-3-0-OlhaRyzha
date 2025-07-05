import { useRef, ChangeEvent, useEffect } from 'react';
import { validateAudioFile } from '@/utils/audioUpload';
import { validationMessages } from '@/constants/message.constant';
import { Track } from '@/types/shared/track';
import {
  useDeleteTrackAudio,
  useUploadTrackAudio,
} from '../tanStackQuery/useTracksQuery';
import { invariant } from '@/utils/invariant';
import { useAudioUploadStore } from '@/store/zustand/useAudioUploadStore';
import { useLocalAudioUrl } from '@/utils/hooks/audio/useLocalAudioUrl';
import {
  selectRemoveBlob,
  useAudioBlobStore,
} from '@/store/zustand/useAudioBlobStore';

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
  const { mutateAsync: upload, isPending } = useUploadTrackAudio();
  const { mutateAsync: remove } = useDeleteTrackAudio();

  const fileRef = useRef<HTMLInputElement>(null);
  const { file, setFile, error, setError } = useAudioUploadStore();

  const removeBlob = useAudioBlobStore(selectRemoveBlob);

  const url = useLocalAudioUrl(file);

  useEffect(() => {
    setFile(null);
    setError(null);
  }, [track.id]);

  const handleChoose = () => fileRef.current?.click();

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const validationResult = await validateAudioFile(file);
    validationResult.match(
      () => {
        setError(null);
        setFile(file);
      },
      (errorMsg) => {
        setError(errorMsg);
        setFile(null);
      }
    );
  };

  const clear = () => {
    setFile(null);
    setError(null);
  };

  const handleSave = async () => {
    invariant(file, validationMessages.requiredFile);
    try {
      await upload({ id: track.id, file: file });
      onOpenChange(false);
      onUploaded?.();
    } catch (error) {
      console.error(validationMessages.errorUploading, error);
    }
  };

  const handleRemove = async () => {
    await remove({ id: track.id });
    removeBlob(track.id);
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
