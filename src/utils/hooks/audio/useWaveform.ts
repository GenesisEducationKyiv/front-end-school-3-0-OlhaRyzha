import { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
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
    let isCancelled = false;

    if (!waveformRef.current || !url) {
      setError(null);
      setIsLoading(false);
      return;
    }

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#9ca3af',
      progressColor: '#374151',
      cursorColor: 'transparent',
      height: 40,
    });

    wavesurferRef.current = wavesurfer;

    const loadAudio = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(audioUploadMessages.audioNotFound);
        }

        const blob = await response.blob();

        if (blob.size === 0 || !blob.type.startsWith('audio/')) {
          throw new Error(audioUploadMessages.audioUnavailable);
        }

        const blobUrl = URL.createObjectURL(blob);

        try {
          wavesurfer.load(blobUrl);
        } catch (err) {
          console.error('WaveSurfer load() failed', err);
          setError(audioUploadMessages.audioLoadError);
          setIsLoading(false);
          return;
        }

        wavesurfer.once('ready', () => {
          if (isCancelled) return;
          setError(null);
          setIsLoading(false);
        });

        wavesurfer.once('error', (e) => {
          if (isCancelled) return;
          setError(
            typeof e === 'string' ? e : audioUploadMessages.audioLoadError
          );
          setIsLoading(false);
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : audioUploadMessages.audioUnavailable
        );
        setIsLoading(false);
      }
    };

    loadAudio();

    return () => {
      isCancelled = true;
      wavesurferRef.current?.destroy();
    };
  }, [url]);

  useEffect(() => {
    const wavesurfer = wavesurferRef.current;
    if (!wavesurfer) return;

    if (isPlaying) {
      wavesurfer.play();
    } else {
      wavesurfer.pause();
    }
  }, [isPlaying]);

  return {
    waveformRef,
    error,
    isLoading,
  };
}
