export type ValueSetter<T> = {
  value: T;
  setValue: (v: T) => void;
};

export type NullableSetter<T> = {
  value: T | null;
  setValue: (v: T | null) => void;
};
