import { useActiveTrack } from './useActiveTrack';

const WS_URL = import.meta.env.VITE_WS_URL;

export function useRandomTrackWS(enabled: boolean) {
  return useActiveTrack(enabled ? WS_URL : null);
}
