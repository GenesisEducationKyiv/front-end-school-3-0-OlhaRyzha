import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { validateAudioFile } from '@/utils/audioUpload';
import { validationMessages } from '@/constants/message.constant';
import { Track } from '@/types/shared/track';
import {
  useDeleteTrackAudio,
  useUploadTrackAudio,
} from '../tanStackQuery/useTracksQuery';
import { invariant } from '@/utils/invariant';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setSelectedUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handlePlayPause = (id: string) => {
    setPlayingTrackId((prev) => (prev === id ? null : id));
  };

  const handleChoose = () => fileRef.current?.click();

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const validationResult = await validateAudioFile(file);
    validationResult.match(
      () => {
        setError(null);
        setSelectedFile(file);
      },
      (errorMsg) => {
        setError(errorMsg);
        setSelectedFile(null);
      }
    );
  };

  const clear = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleSave = async () => {
    invariant(selectedFile, validationMessages.requiredFile);
    try {
      await upload({ id: track.id, file: selectedFile });
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
    selectedFile,
    selectedUrl,
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
