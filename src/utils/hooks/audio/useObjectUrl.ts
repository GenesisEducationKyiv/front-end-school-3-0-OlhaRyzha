import { ValueSetter } from '@/types/base';
import { createObjectUrl, revokeObjectUrl } from '@/utils/objectUrl';
import { useState, useEffect } from 'react';

export function useObjectUrl(blob?: ValueSetter<Blob>) {
  const [url, setUrl] = useState<ValueSetter<string>>(null);

  useEffect(() => {
    if (!blob) return;

    const newUrl = createObjectUrl(blob);
    setUrl(newUrl);

    return () => {
      revokeObjectUrl(newUrl);
      setUrl(null);
    };
  }, [blob]);

  return url;
}
