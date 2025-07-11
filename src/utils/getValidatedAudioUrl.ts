import { audioUploadMessages } from '@/constants/message.constant';
import { getTrackAudioUrl } from './getTrackAudioUrl';
import { invariant } from './invariant';
import { ValueSetter } from '@/types/base';

export function getValidatedAudioUrl(audioFile?: ValueSetter<string>): string {
  const url = getTrackAudioUrl(audioFile);
  invariant(url, audioUploadMessages.audioUnavailable);
  return url;
}
