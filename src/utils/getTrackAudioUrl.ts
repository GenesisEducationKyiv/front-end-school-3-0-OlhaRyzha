import { BASE_URL } from '@/services/BaseService';
import { isString } from './guards/isString';

export const getTrackAudioUrl = (audioFile?: string) =>
  isString(audioFile) ? `${BASE_URL}/files/${audioFile}` : null;
