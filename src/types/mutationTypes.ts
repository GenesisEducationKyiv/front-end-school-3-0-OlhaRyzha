import { UseMutationOptions } from '@tanstack/react-query';
import { IdType } from './ids';

export type OptimisticUpdateContext<TItem> = { previousData?: TItem[] };

export type MutateItemOptions<
  TItem extends { id: IdType },
  TVariables extends Partial<TItem> | IdType[]
> = UseMutationOptions<
  TItem | void,
  Error,
  TVariables,
  OptimisticUpdateContext<TItem>
>;
