import { INPUT_COVER_IMG_TYPES } from '@/types/input';

export function isFile(value: unknown): value is File {
  return value instanceof File;
}
export function isFileType(value: unknown): value is 'file' {
  return value === INPUT_COVER_IMG_TYPES[1];
}
