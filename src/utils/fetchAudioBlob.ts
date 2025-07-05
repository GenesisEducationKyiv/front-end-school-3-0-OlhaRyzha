import { Result, ok, err } from 'neverthrow';
import { audioUploadMessages } from '@/constants/message.constant';

export async function fetchAudioBlobResult(
  url: string
): Promise<Result<Blob, string>> {
  try {
    const response = await fetch(url);
    if (!response.ok) return err(audioUploadMessages.audioNotFound);

    const blob = await response.blob();
    if (blob.size === 0 || !blob.type.startsWith('audio/')) {
      return err(audioUploadMessages.audioUnavailable);
    }

    return ok(blob);
  } catch {
    return err(audioUploadMessages.audioUnavailable);
  }
}
