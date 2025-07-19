import { ValueSetter } from '@/types/base';

export function createObjectUrl(blob?: ValueSetter<Blob>): ValueSetter<string> {
  return blob ? URL.createObjectURL(blob) : null;
}

export function revokeObjectUrl(url?: ValueSetter<string>): void {
  if (url) {
    URL.revokeObjectURL(url);
  }
}
