import { isString } from './guards/isString';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getTrackAudioUrl = (audioFile?: string) =>
  isString(audioFile) ? `${API_BASE_URL}/api/files/${audioFile}` : null;
