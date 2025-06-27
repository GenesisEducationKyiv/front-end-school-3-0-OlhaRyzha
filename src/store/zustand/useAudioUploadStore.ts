import { create } from 'zustand';
import { AudioUploadState } from '@/types/zustand/audio';

export const useAudioUploadStore = create<AudioUploadState>((set) => ({
  file: null,
  url: null,
  error: null,

  setFile: (file) => set({ file }),
  setUrl: (url) => set({ url }),
  setError: (error) => set({ error }),

  reset: () => set({ file: null, url: null, error: null }),
}));

export const selectAudioFile = (s: AudioUploadState) => s.file;
export const selectSetAudioFile = (s: AudioUploadState) => s.setFile;

export const selectAudioUrl = (s: AudioUploadState) => s.url;
export const selectSetAudioUrl = (s: AudioUploadState) => s.setUrl;

export const selectAudioError = (s: AudioUploadState) => s.error;
export const selectSetAudioError = (s: AudioUploadState) => s.setError;
