import { BASE_URL } from '@/services/BaseService';
import { isString } from './guards/isString';
import { ValueSetter } from '@/types/base';

export const getTrackAudioUrl = (audioFile?: ValueSetter<string>) =>
  isString(audioFile) ? `${BASE_URL}/files/${audioFile}` : null;
