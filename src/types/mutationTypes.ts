import { UseMutationOptions } from '@tanstack/react-query';
import { IdType } from './ids';

export type OptimisticUpdateContext<T> = { previousData?: T[] };
export type WithId = { id?: IdType };
export type MutationVariables<T> = WithId | Partial<T> | IdType[];

export type MutateItemOptions<
  T extends WithId,
  TVariables extends MutationVariables<T>
> = UseMutationOptions<T | void, Error, TVariables, OptimisticUpdateContext<T>>;
