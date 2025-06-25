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

export const useAudioUploadState = () => {
  return useAudioUploadStore((state) => ({
    file: state.file,
    url: state.url,
    error: state.error,
    setFile: state.setFile,
    setUrl: state.setUrl,
    setError: state.setError,
    reset: state.reset,
  }));
};
