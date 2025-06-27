import { useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Track } from '@/types/shared/track';
import { BTNS_LABELS } from '@/constants/labels.constant';
import { audioUploadMessages } from '@/constants/message.constant';
import { useAudioUpload } from '@/utils/hooks/audio/useAudioUpload';
import { TrackWaveform } from './TrackWaveform';

interface AudioUploadModalProps {
  track: Track;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded?: () => void;
}

function AudioUploadModal({
  track,
  open,
  onOpenChange,
  onUploaded,
}: AudioUploadModalProps) {
  const {
    fileRef,
    selectedFile,
    selectedUrl,
    error,
    handleChoose,
    handleChange,
    handleSave,
    handleRemove,
    loading: isPending,
    clear,
  } = useAudioUpload({ track, onOpenChange, onUploaded });

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        const activeEl = document.activeElement as HTMLElement | null;
        if (activeEl) activeEl.blur();
      });
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Audio for “{track.title}”</DialogTitle>
          <DialogDescription>
            {track.audioFile
              ? audioUploadMessages.replaceOrRemove
              : audioUploadMessages.selectToUpload}
          </DialogDescription>
        </DialogHeader>

        <input
          ref={fileRef}
          type='file'
          accept='audio/*'
          className='hidden'
          onChange={handleChange}
        />

        {error && (
          <p
            className='mt-2 text-sm text-red-600'
            role='alert'>
            {error}
          </p>
        )}

        <div className='mt-4 space-y-4'>
          {selectedFile && selectedUrl ? (
            <>
              <p className='text-sm mb-2'>Preview:</p>
              <TrackWaveform
                id='preview'
                previewUrl={selectedUrl}
              />

              <div className='flex items-center gap-2 mt-2'>
                <span className='truncate text-sm text-balance'>
                  {selectedFile.name}
                </span>
                <button
                  onClick={clear}
                  className='text-gray-500 hover:text-gray-700'
                  data-testid={`clear-selected-file-${track.id}`}>
                  <HiXMark className='h-4 w-4' />
                </button>
              </div>
            </>
          ) : track.audioFile ? (
            <>
              <p className='text-sm mb-2'>Current file:</p>
              <TrackWaveform
                id={track.id}
                audioFile={track.audioFile}
              />
            </>
          ) : null}
        </div>

        <DialogFooter className='flex justify-between mt-4'>
          {track.audioFile && !selectedFile && (
            <Button
              variant='destructive'
              onClick={handleRemove}
              data-testid={`delete-audio-${track.id}`}>
              {BTNS_LABELS.REMOVE_FILE}
            </Button>
          )}

          <div className='flex gap-2 ml-auto'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}>
              {BTNS_LABELS.CANCEL}
            </Button>
            <Button
              onClick={handleChoose}
              data-testid={`choose-file-${track.id}`}>
              {BTNS_LABELS.CHOOSE_FILE}
            </Button>
            <Button
              disabled={!selectedFile || isPending}
              onClick={handleSave}
              data-testid={`save-audio-${track.id}`}>
              {isPending ? BTNS_LABELS.SAVING : BTNS_LABELS.SAVE}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AudioUploadModal;
