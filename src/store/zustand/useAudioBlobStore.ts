import { create } from 'zustand';

interface AudioBlobStore {
  blobs: Record<string, string>;
  setBlob: (id: string, url: string) => void;
  removeBlob: (id: string) => void;
  clearBlobs: () => void;
}

export const useAudioBlobStore = create<AudioBlobStore>((set) => ({
  blobs: {},
  setBlob: (id, url) =>
    set((state) => ({
      blobs: { ...state.blobs, [id]: url },
    })),
  removeBlob: (id) =>
    set((state) => {
      if (state.blobs[id]) URL.revokeObjectURL(state.blobs[id]);
      const { [id]: _, ...rest } = state.blobs;
      return { blobs: rest };
    }),
  clearBlobs: () =>
    set((state) => {
      Object.values(state.blobs).forEach(URL.revokeObjectURL);
      return { blobs: {} };
    }),
}));

export const selectBlobById = (id: string) => (state: AudioBlobStore) =>
  state.blobs[id];
export const selectSetBlob = (state: AudioBlobStore) => state.setBlob;
export const selectRemoveBlob = (state: AudioBlobStore) => state.removeBlob;
export const selectClearBlobs = (state: AudioBlobStore) => state.clearBlobs;
