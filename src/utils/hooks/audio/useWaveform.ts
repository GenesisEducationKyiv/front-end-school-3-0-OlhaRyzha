import { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { isString } from '@/utils/guards/isString';
import { ValueSetter } from '@/types/zustand/base';
import { getWaveSurfer } from '@/utils/getWaveSurfer';

interface UseWaveformProps {
  url: ValueSetter<string>;
  isPlaying?: boolean;
}

export function useWaveform({ url, isPlaying = false }: UseWaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<ValueSetter<WaveSurfer>>(null);
  const [error, setError] = useState<ValueSetter<string>>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    if (!waveformRef.current || !isString(url)) {
      setError(null);
      setIsLoading(false);
      return;
    }

    const isBlob = url.startsWith('blob:');
    const isHttp = url.startsWith('http');

    const wavesurfer = getWaveSurfer(waveformRef.current);
    wavesurferRef.current = wavesurfer;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      if (isBlob) {
        wavesurfer.load(url);
      } else if (isHttp) {
        setError('Only blob urls supported in waveform!');
        setIsLoading(false);
        return;
      } else {
        setError('Invalid url');
        setIsLoading(false);
        return;
      }

      wavesurfer.once('ready', () => {
        if (isCancelled) return;
        setIsLoading(false);
        setError(null);
      });

      wavesurfer.once('error', (e) => {
        if (isCancelled) return;
        setError(isString(e) ? e : 'Audio load error');
        setIsLoading(false);
      });
    };

    load();

    return () => {
      isCancelled = true;
      wavesurferRef.current?.destroy();
    };
  }, [url]);

  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    isPlaying ? ws.play() : ws.pause();
  }, [isPlaying]);

  return { waveformRef, error, isLoading };
}
