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
} from '@/types/mutationTypes';
import { ApiError } from '@/utils/apiError';
import { updateDraftData } from '@/utils/query/updateDraftData';

interface UseMutateItemWithOptimisticUpdateProps<
  TItem extends object,
  TVariables extends MutationVariables<TItem>,
> {
  queryKey: string[];
  action: ActionType;
  mutateFn: (variables: TVariables) => Promise<TItem | void>;
  entity?: string;
  options?: MutateItemOptions<TItem, TVariables>;
}

export function useMutateItemWithOptimisticUpdate<
  TItem extends object,
  TVariables extends MutationVariables<TItem>,
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
      const updatedData = updateDraftData<TItem, TVariables>(
        action,
        variables,
        previousData ?? []
      );

      queryClient.setQueryData(queryKey, updatedData);
      return { previousData };
    },

    onError: (error, _vars, context) => {
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
