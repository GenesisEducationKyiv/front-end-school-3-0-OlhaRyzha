import { NullableSetter, ValueSetter } from './base';

export interface PlayingTrackIdState {
  playingTrackId: ValueSetter<string>;
  setPlayingTrackId: NullableSetter<string>;
}
