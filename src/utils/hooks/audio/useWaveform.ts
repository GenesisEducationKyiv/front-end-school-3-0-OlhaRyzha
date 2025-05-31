import { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Result, ok, err } from 'neverthrow';
import { audioUploadMessages } from '@/constants/message.constant';

interface UseWaveformProps {
  url: string | null;
  isPlaying?: boolean;
}
export function useWaveform({ url, isPlaying = false }: UseWaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#9ca3af',
      progressColor: '#374151',
      cursorColor: 'transparent',
      height: 40,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
    });

    const loadAudio = async () => {
      setIsLoading(true);
      const result: Result<void, string> = await fetch(url)
        .then((response) => {
          if (!response.ok) return err(audioUploadMessages.audioNotFound);
          return ok(undefined);
        })
        .catch(() => err(audioUploadMessages.audioUnavailable));

      if (result.isErr()) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      try {
        await wavesurferRef.current?.load(url);
        setError(null);
      } catch (e) {
        setError(audioUploadMessages.audioUnavailable);
        console.error(audioUploadMessages.audioLoadError, e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAudio();

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [url]);

  useEffect(() => {
    if (!wavesurferRef.current) return;

    if (isPlaying) {
      wavesurferRef.current.play();
    } else {
      wavesurferRef.current.pause();
    }
  }, [isPlaying]);

  return {
    waveformRef,
    error,
    isLoading,
  };
}
