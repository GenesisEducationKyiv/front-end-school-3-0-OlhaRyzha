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
