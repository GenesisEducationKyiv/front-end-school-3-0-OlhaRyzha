import { INPUT_COVER_IMG_TYPES } from '@/types/input';

export function isUrl(value: unknown): value is 'url' {
  return value === INPUT_COVER_IMG_TYPES[0];
}
