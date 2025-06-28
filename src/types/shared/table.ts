import { Dispatch, SetStateAction } from 'react';
import { QueryParams } from './track';

export type SetRowSelectionType = Dispatch<
  SetStateAction<Record<string, boolean>>
>;
export type SetParamsType = (updater: (p: QueryParams) => QueryParams) => void;
