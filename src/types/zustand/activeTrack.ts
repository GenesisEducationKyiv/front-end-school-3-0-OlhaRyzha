export interface ActiveTrackState {
  index: number;
  random: boolean;
  playing: boolean;
}

export interface ActiveTrackActions {
  toggleRandom: () => void;
  togglePlay: () => void;
  setIndex: (idx: number | ((curr: number) => number)) => void;
  setPlaying: (v: boolean) => void;
}
