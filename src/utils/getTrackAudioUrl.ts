export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getTrackAudioUrl = (audioFile?: string) =>
  `${API_BASE_URL}/api/files/${audioFile}`;
