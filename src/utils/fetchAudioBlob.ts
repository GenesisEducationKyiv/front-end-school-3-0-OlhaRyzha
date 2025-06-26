export const fetchAudioBlob = async (
  audioUrl?: string
): Promise<string | null> => {
  if (!audioUrl) return null;
  console.log('Fetching audio blob from URL:', audioUrl);
  const response = await fetch(audioUrl);
  if (!response.ok) throw new Error('Failed to fetch audio');
  const blob = await response.blob();
  if (blob.size === 0 || !blob.type.startsWith('audio/'))
    throw new Error('Audio is empty or not audio');
  return URL.createObjectURL(blob);
};
