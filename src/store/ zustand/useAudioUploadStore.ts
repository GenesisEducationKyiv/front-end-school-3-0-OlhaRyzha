import { create } from 'zustand';
import { AudioUploadState } from '@/types/zustand/audio';

export const useAudioUploadStore = create<AudioUploadState>((set) => ({
  file: {
    value: null,
    setValue: (file) => set((s) => ({ file: { ...s.file, value: file } })),
  },
  url: {
    value: null,
    setValue: (url) => set((s) => ({ url: { ...s.url, value: url } })),
  },
  error: {
    value: null,
    setValue: (error) => set((s) => ({ error: { ...s.error, value: error } })),
  },
}));

export const selectAudioFile = (s: AudioUploadState) => s.file.value;
export const selectSetAudioFile = (s: AudioUploadState) => s.file.setValue;

export const selectAudioUrl = (s: AudioUploadState) => s.url.value;
export const selectSetAudioUrl = (s: AudioUploadState) => s.url.setValue;

export const selectAudioError = (s: AudioUploadState) => s.error.value;
export const selectSetAudioError = (s: AudioUploadState) => s.error.setValue;
