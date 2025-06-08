import { useEffect, useState, useCallback } from 'react';
import { initialParams } from '@/configs/tableConfig';
import { useBulkDeleteTracks } from '@/utils/hooks/tanStackQuery/useTracksQuery';
import { useGenresQuery } from '@/utils/hooks/tanStackQuery/useGenresQuery';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { SetParamsType, SetRowSelectionType } from '@/types/shared/table';
import { isNonEmptyArray } from '@/utils/guards/isNonEmptyArray';

interface UseTableToolbarProps {
  search: string;
  setSearch: (value: string) => void;
  setParams: SetParamsType;
  selectedIds: string[];
  setRowSelection: SetRowSelectionType;
}

export function useTableToolbar({
  search,
  setSearch,
  setParams,
  selectedIds,
  setRowSelection,
}: UseTableToolbarProps) {
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
      setSearch(debouncedSearch);
    }
  }, [debouncedSearch, search, setSearch]);

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
    setParams((prev) => ({ ...prev, ...initialParams }));
    setLocalSearch(initialParams.search || '');
  }, [setParams]);

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
