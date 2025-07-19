import { Draft, produce } from 'immer';
import { ACTIONS } from '@/constants/actions.constants';
import { ActionType } from '@/types/actions';
import { MutationVariables, WithId } from '@/types/mutationTypes';
import { hasId } from '@/utils/guards/hasId';
import { isArray } from '@/utils/guards/isArray';
import { isObject } from '@/utils/guards/isObject';

export function updateDraftData<
  TItem extends object,
  TVariables extends MutationVariables<TItem>,
>(
  action: ActionType,
  variables: TVariables,
  previousData: TItem[] = []
): TItem[] {
  return produce(previousData, (draft) => {
    if (action === ACTIONS.BULK_DELETE && isArray(variables)) {
      for (let i = draft.length - 1; i >= 0; i--) {
        if (
          (draft[i] as WithId).id &&
          variables.includes((draft[i] as WithId).id!)
        ) {
          draft.splice(i, 1);
        }
      }
    } else if (action === ACTIONS.UPDATE && hasId(variables)) {
      const index = draft.findIndex(
        (item) => (item as WithId).id === (variables as WithId).id
      );
      if (index !== -1) {
        draft[index] = { ...draft[index], ...variables };
      }
    } else if (action === ACTIONS.CREATE && isObject(variables)) {
      draft.push(variables as Draft<TItem>);
    } else if (action === ACTIONS.DELETE && hasId(variables)) {
      const index = draft.findIndex(
        (item) => (item as WithId).id === (variables as WithId).id
      );
      if (index !== -1) {
        draft.splice(index, 1);
      }
    }
  });
}
