import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ColumnFiltersState,
  isFunction,
  OnChangeFn,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { META } from '@/constants/table.constants';
import {
  useGetTracks,
  useDeleteTrack,
} from '@/utils/hooks/tanStackQuery/useTracksQuery';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectSelectMode,
  selectSorting,
  selectTableParams,
  setMeta,
  updateSorting,
} from '@/store/slices/table/tableSlice';
import { trackColumns } from '@/configs/columnsConfig';
import { useTable } from '@/utils/hooks/table/useTable';
import { Track } from '@/types/shared/track';
import { useSyncTableParamsToUrl } from './useTableParams';
import { useModalsStore } from '@/store/zustand/useModalsStore';
import { usePlayingTrackStore } from '@/store/zustand/usePlayingTrackStore';

export function useTrackTable() {
  const dispatch = useAppDispatch();
  const params = useAppSelector(selectTableParams);
  const sorting = useAppSelector(selectSorting);
  const selectMode = useAppSelector(selectSelectMode);

  const deleteTrack = useDeleteTrack();

  useSyncTableParamsToUrl();

  const { data: tracksData, isLoading, isFetching } = useGetTracks(params);
  const tracks = useMemo(() => tracksData?.data ?? [], [tracksData]);

  useEffect(() => {
    if (tracksData?.meta) {
      dispatch(
        setMeta({
          total: tracksData.meta.total ?? META.total,
          totalPages: tracksData.meta.totalPages ?? META.page,
          currentPage: tracksData.meta.page ?? META.page,
          limit: tracksData.meta.limit ?? META.limit,
        })
      );
    }
  }, [tracksData, dispatch]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const { openModal, closeModal, selectedTrack, modalAction } =
    useModalsStore();

  const { playingTrackId, setPlayingTrackId } = usePlayingTrackStore();

  const handleConfirmDelete = useCallback(
    (track: Track) => deleteTrack.mutate({ id: track.id }),
    [deleteTrack]
  );

  useEffect(() => {
    setRowSelection({});
  }, [params.page, params.limit, params.sort, params.order, params.search]);

  const columns = useMemo(
    () =>
      trackColumns({
        selectMode,
        playAudio: (id: string) => setPlayingTrackId(id),
        onEdit: (t) => openModal(t, 'edit'),
        onUpload: (t) => openModal(t, 'upload'),
        onDelete: (t) => openModal(t, 'delete'),
      }),
    [selectMode, setPlayingTrackId, openModal]
  );

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const next = isFunction(updaterOrValue)
      ? updaterOrValue(sorting)
      : updaterOrValue;
    dispatch(updateSorting(next));
  };

  const table = useTable({
    tracks: tracks.map((track) => ({
      ...track,
      isPlaying: track.id === playingTrackId,
    })),
    columns,
    sorting,
    handleSortingChange,
    columnFilters,
    columnVisibility,
    rowSelection,
    setColumnVisibility,
    setColumnFilters,
    setRowSelection,
    meta: { playingTrackId, setPlayingTrackId },
  });

  const loading = isLoading || isFetching;

  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection]
  );

  return {
    loading,
    selectedIds,
    selectedTrack,
    modalAction,
    openModal,
    closeModal,
    handleConfirmDelete,
    table,
    tracks,
    setRowSelection,
  };
}
