import { NullableSetter, ValueSetter } from './base';

export interface AudioUploadState {
  file: ValueSetter<File>;
  setFile: NullableSetter<File>;
  url: ValueSetter<string>;
  setUrl: NullableSetter<string>;
  error: ValueSetter<string>;
  setError: NullableSetter<string>;
  reset: () => void;
}
