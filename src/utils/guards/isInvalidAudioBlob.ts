export function isInvalidAudioBlob(blob: Blob): boolean {
  return blob.size === 0 || !blob.type.startsWith('audio/');
}
