import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../services';
import { ActionType } from '../../../types/actions';
import { IdType } from '../../../types/ids';
import { ACTIONS } from '../../../constants/actions.constants';
import {
  messageOnSuccessCreated,
  messageOnSuccessDeleted,
  messageOnSuccessEdited,
} from '@/constants/message.constant';
import { useToast } from '@/utils/hooks/use-toast';
import {
  MutateItemOptions,
  OptimisticUpdateContext,
} from '@/types/mutationTypes';
import { hasId } from '@/utils/guards/hasId';
import { ApiError } from '@/utils/apiError';

interface UseMutateItemWithOptimisticUpdateProps<
  TItem extends { id: IdType },
  TVariables extends Partial<TItem> | IdType[]
> {
  queryKey: string[];
  action: ActionType;
  mutateFn: (variables: TVariables) => Promise<TItem | void>;
  entity?: string;
  options?: MutateItemOptions<TItem, TVariables>;
}

export function useMutateItemWithOptimisticUpdate<
  TItem extends { id: IdType },
  TVariables extends Partial<TItem> | IdType[]
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

      queryClient.setQueryData<TItem[]>(queryKey, (oldData = []) => {
        if (action === ACTIONS.BULK_DELETE && Array.isArray(variables)) {
          return oldData.filter((item) => !variables.includes(item.id));
        }
        if (action === ACTIONS.UPDATE && hasId(variables)) {
          return oldData?.map((item) =>
            item.id === variables.id ? { ...item, ...variables } : item
          );
        }
        if (action === ACTIONS.CREATE) {
          const newItem: TItem = { ...(variables as Partial<TItem>) } as TItem;
          return [...oldData, newItem];
        }
        if (action === ACTIONS.DELETE && hasId(variables)) {
          return oldData.filter((item) => item.id !== variables.id);
        }
        return oldData;
      });

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
