import WaveSurfer from 'wavesurfer.js';

export function getWaveSurfer(ref: HTMLElement) {
  return WaveSurfer.create({
    container: ref,
    waveColor: '#9ca3af',
    progressColor: '#374151',
    cursorColor: 'transparent',
    height: 40,
  });
}
