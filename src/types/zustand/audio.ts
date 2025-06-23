import { NullableSetter } from './base';

export interface AudioUploadState {
  file: NullableSetter<File>;
  url: NullableSetter<string>;
  error: NullableSetter<string>;
}
