import { test, expect } from 'vitest';
import { validateAudioFile } from '../../utils/audioUpload';

interface CreateFileProps {
  name: string;
  size: number;
  type: string;
}
function createFile({ name, size, type }: CreateFileProps): File {
  const blobContent = new Uint8Array(size).fill(0);
  const blob = new Blob([blobContent], { type });
  return new File([blob], name, { type });
}

const TEN_MB = 10 * 1024 * 1024;

test('returns ok for valid file', async () => {
  const file = createFile({
    name: 'track.mp3',
    size: 1 * 1024 * 1024,
    type: 'audio/mpeg',
  });
  const result = await validateAudioFile(file, TEN_MB);
  expect(result.isOk()).toBe(true);
});

test('returns error for wrong mime type', async () => {
  const file = createFile({
    name: 'track.mp3',
    size: 1 * 1024 * 1024,
    type: 'application/json',
  });
  const result = await validateAudioFile(file, TEN_MB);
  expect(result.isErr()).toBe(true);
});

test('returns error for unsupported extension', async () => {
  const file = createFile({
    name: 'track.txt',
    size: 1 * 1024 * 1024,
    type: 'audio/mpeg',
  });
  const result = await validateAudioFile(file, TEN_MB);
  expect(result.isErr()).toBe(true);
});

test('returns error for oversized file', async () => {
  const file = createFile({
    name: 'track.mp3',
    size: 11 * 1024 * 1024,
    type: 'audio/mpeg',
  });
  const result = await validateAudioFile(file, TEN_MB);
  expect(result.isErr()).toBe(true);
});
