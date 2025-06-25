import { Track } from '@/types/shared/track';
import { ValueSetter } from './base';

export type ModalAction = 'edit' | 'upload' | 'delete';

export interface ModalsState {
  selectedTrack: ValueSetter<Track>;
  modalAction: ValueSetter<ModalAction>;
  openModal: (track: Track, action: ModalAction) => void;
  closeModal: () => void;
}
