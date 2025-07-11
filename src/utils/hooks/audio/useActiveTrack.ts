import { useEffect, useRef, useState } from 'react';
import { Track } from '@/types/shared/track';
import { ValueSetter } from '@/types/base';

export function useActiveTrack(url: ValueSetter<string>) {
  const [track, setTrack] = useState<ValueSetter<Track>>(null);
  const wsRef = useRef<ValueSetter<WebSocket>>(null);

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => console.log('[WS] Connected');

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'ACTIVE_TRACK') {
          setTrack({ ...msg.payload });
        }
      } catch (err) {
        console.error('[WS] Parse error:', err);
      }
    };

    ws.onerror = (err) => console.error('[WS] Error:', err);
    ws.onclose = () => {
      console.log('[WS] Closed');
      wsRef.current = null;
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [url]);

  return track;
}
