import { Result, ok, err } from 'neverthrow';
import { validationMessages } from '@/constants/message.constant';

const ALLOWED_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  'audio/aac',
  'audio/x-m4a',
];

const ALLOWED_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
const MAX_SIZE = 10 * 1024 * 1024;

const formatSize = (bytes: number) => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};

export async function validateAudioFile(
  file: File,
  maxSize: number = MAX_SIZE
): Promise<Result<void, string>> {
  if (file.size > maxSize) {
    return err(validationMessages.lengthMax(formatSize(maxSize)));
  }

  if (file.size === 0) {
    return err(validationMessages.emty);
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return err(validationMessages.unsupportedFormat);
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return err(validationMessages.fileExtension);
  }

  return ok(undefined);
}
