import { useEffect, useState, useCallback } from 'react';
import { useBulkDeleteTracks } from '@/utils/hooks/tanStackQuery/useTracksQuery';
import { useGenresQuery } from '@/utils/hooks/tanStackQuery/useGenresQuery';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { SetRowSelectionType } from '@/types/shared/table';
import { isNonEmptyArray } from '@/utils/guards/isNonEmptyArray';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  DEFAULT_PARAMS,
  selectTableParams,
  setTableParams,
  updateSearch,
} from '@/store/slices/table/tableSlice';

interface UseTableToolbarProps {
  selectedIds: string[];
  setRowSelection: SetRowSelectionType;
}

export function useTableToolbar({
  selectedIds,
  setRowSelection,
}: UseTableToolbarProps) {
  const dispatch = useAppDispatch();
  const params = useAppSelector(selectTableParams);

  const search = params?.search ?? '';

  const { data: allGenres = [] } = useGenresQuery();

  const bulkDeleteMutation = useBulkDeleteTracks();

  const [localSearch, setLocalSearch] = useState(search);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const debouncedSearch = useDebounce(localSearch);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch !== search) {
      dispatch(updateSearch(debouncedSearch));
    }
  }, [debouncedSearch, search]);

  const handleBulkDelete = useCallback(() => {
    if (!isNonEmptyArray(selectedIds)) return;

    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        setRowSelection({});
        setDeleteDialogOpen(false);
      },
      onError: () => {
        setDeleteDialogOpen(true);
      },
    });
  }, [selectedIds, bulkDeleteMutation, setRowSelection]);

  const handleReset = useCallback(() => {
    dispatch(setTableParams(DEFAULT_PARAMS));
    setLocalSearch(DEFAULT_PARAMS.search || '');
  }, []);

  return {
    localSearch,
    setLocalSearch,
    deleteDialogOpen,
    setDeleteDialogOpen,
    allGenres,
    handleBulkDelete,
    handleReset,
  };
}
