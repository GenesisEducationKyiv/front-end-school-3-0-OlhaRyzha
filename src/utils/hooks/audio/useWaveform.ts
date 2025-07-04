import { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { isString } from '@/utils/guards/isString';
import { ValueSetter } from '@/types/zustand/base';
import { getWaveSurfer } from '@/utils/getWaveSurfer';
import { isAbortError } from '@/utils/guards/isAbortError';
import {
  audioUploadMessages,
  audioWaveformMessages,
} from '@/constants/message.constant';

interface UseWaveformProps {
  url: ValueSetter<string>;
  isPlaying?: boolean;
}

export function useWaveform({ url, isPlaying = false }: UseWaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<ValueSetter<WaveSurfer>>(null);
  const [error, setError] = useState<ValueSetter<string>>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;
    setIsVisible(false);

    if (!waveformRef.current || !isString(url)) {
      setError(null);
      setIsLoading(false);
      return;
    }

    const isBlob = url.startsWith('blob:');
    const isHttp = url.startsWith('http');

    const wavesurfer = getWaveSurfer(waveformRef.current);
    wavesurferRef.current = wavesurfer;

    setIsLoading(true);
    setError(null);

    wavesurfer.once('ready', () => {
      if (isCancelled) return;
      setIsLoading(false);
      setError(null);
      setIsVisible(true);
    });

    wavesurfer.once('error', (e) => {
      if (isCancelled) return;
      if (isAbortError(e)) return;
      setError(isString(e) ? e : audioUploadMessages.audioLoadError);
      setIsLoading(false);
    });

    if (isBlob) {
      wavesurfer.load(url).catch((e) => {
        if (isCancelled || isAbortError(e)) return;
        setError(isString(e) ? e : audioUploadMessages.audioLoadError);
        setIsLoading(false);
      });
    } else if (isHttp) {
      setError(audioWaveformMessages.onlyBlobUrls);
      setIsLoading(false);
      return;
    } else {
      setError(audioWaveformMessages.invalidUrl);
      setIsLoading(false);
      return;
    }

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

  return { waveformRef, error, isLoading, isVisible };
}
