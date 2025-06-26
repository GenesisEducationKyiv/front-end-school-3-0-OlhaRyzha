import { useEffect, useRef, ChangeEvent } from 'react';
import { validateAudioFile } from '@/utils/audioUpload';
import { validationMessages } from '@/constants/message.constant';
import { Track } from '@/types/shared/track';
import {
  useDeleteTrackAudio,
  useUploadTrackAudio,
} from '../tanStackQuery/useTracksQuery';
import { invariant } from '@/utils/invariant';
import { useAudioUploadStore } from '@/store/zustand/useAudioUploadStore';
import { usePlayingTrackStore } from '@/store/zustand/usePlayingTrackStore';

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
  const { mutate: remove } = useDeleteTrackAudio();

  const fileRef = useRef<HTMLInputElement>(null);
  const { file, setFile, url, setUrl, error, setError } = useAudioUploadStore();

  const { playingTrackId, setPlayingTrackId } = usePlayingTrackStore();

  useEffect(() => {
    setFile(null);
    setUrl(null);
    setError(null);
  }, [track.id]);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handlePlayPause = (id: string) => {
    setPlayingTrackId(playingTrackId === id ? null : id);
  };

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

  const handleRemove = () => {
    remove({ id: track.id });
    onOpenChange(false);
  };

  return {
    fileRef,
    selectedFile: file,
    selectedUrl: url,
    error,
    handleChoose,
    handleChange,
    handlePlayPause,
    handleSave,
    handleRemove,
    loading: isPending,
    clear,
    playingTrackId,
  };
}
