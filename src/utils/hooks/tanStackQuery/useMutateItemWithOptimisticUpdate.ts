import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../services';
import { ActionType } from '../../../types/actions';
import { ACTIONS } from '../../../constants/actions.constants';
import {
  messageOnSuccessCreated,
  messageOnSuccessDeleted,
  messageOnSuccessEdited,
} from '@/constants/message.constant';
import { useToast } from '@/utils/hooks/use-toast';
import {
  MutateItemOptions,
  MutationVariables,
  OptimisticUpdateContext,
  WithId,
} from '@/types/mutationTypes';
import { hasId } from '@/utils/guards/hasId';
import { ApiError } from '@/utils/apiError';
import { isObject } from '@/utils/guards/isObject';
import { isArray } from '@/utils/guards/isArray';

interface UseMutateItemWithOptimisticUpdateProps<
  TItem extends object,
  TVariables extends MutationVariables<TItem>
> {
  queryKey: string[];
  action: ActionType;
  mutateFn: (variables: TVariables) => Promise<TItem | void>;
  entity?: string;
  options?: MutateItemOptions<TItem, TVariables>;
}

export function useMutateItemWithOptimisticUpdate<
  TItem extends object,
  TVariables extends MutationVariables<TItem>
>({
  queryKey,
  action,
  mutateFn,
  options,
  entity = '',
}: UseMutateItemWithOptimisticUpdateProps<TItem, TVariables>) {
  const { toast } = useToast();

  return useMutation<
    TItem | void,
    ApiError,
    TVariables,
    OptimisticUpdateContext<TItem>
  >({
    mutationKey: [...queryKey, action],
    mutationFn: mutateFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<TItem[]>(queryKey);
      let updatedData = previousData ? [...previousData] : [];

      if (action === ACTIONS.BULK_DELETE && isArray(variables)) {
        updatedData = updatedData.filter(
          (item) =>
            !((item as WithId).id && variables.includes((item as WithId).id!))
        );
      } else if (action === ACTIONS.UPDATE && hasId(variables)) {
        updatedData = updatedData.map((item) =>
          (item as WithId).id &&
          (item as WithId).id === (variables as WithId).id
            ? { ...item, ...variables }
            : item
        );
      } else if (
        action === ACTIONS.CREATE &&
        isObject(variables) &&
        !isArray(variables)
      ) {
        updatedData = [...updatedData, variables as TItem];
      } else if (action === ACTIONS.DELETE && hasId(variables)) {
        updatedData = updatedData.filter(
          (item) =>
            (item as WithId).id ||
            (item as WithId).id !== (variables as WithId).id
        );
      }

      queryClient.setQueryData(queryKey, updatedData);

      return { previousData };
    },
    onError: (error: ApiError, _vars, context) => {
      const errorMessage = error.userMessage;

      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      const message =
        action === ACTIONS.UPDATE
          ? messageOnSuccessEdited(entity)
          : action === ACTIONS.CREATE || action === ACTIONS.UPLOAD_AUDIO
          ? messageOnSuccessCreated(entity)
          : messageOnSuccessDeleted(entity);

      toast({
        title: 'Success',
        description: message,
        variant: 'success',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    ...options,
  });
}
