import { Track } from '../shared/track';
import { ValueSetter } from './base';

export interface PlayerState {
  currentTrack: ValueSetter<Track>;
  isPlaying: boolean;
  play: (track: Track) => void;
  togglePlay: () => void;
  stop: () => void;
}
