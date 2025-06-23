import { Track } from '../shared/track';
import { NullableSetter } from './base';

export interface ModalsState {
  trackForEdit: NullableSetter<Track>;
  trackForUpload: NullableSetter<Track>;
  trackForDelete: NullableSetter<Track>;
}
