import { ValueSetter } from '@/types/zustand/base';
import { useEffect, useState } from 'react';

export function useLocalAudioUrl(file: ValueSetter<File>) {
  const [url, setUrl] = useState<ValueSetter<string>>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setUrl(localUrl);
    return () => {
      URL.revokeObjectURL(localUrl);
    };
  }, [file]);

  return url;
}
