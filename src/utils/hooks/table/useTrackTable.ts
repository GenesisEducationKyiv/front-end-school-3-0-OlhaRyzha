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
import { useInitTableParamsOnce } from './useInitTableParamsOnce';
import { useSyncTableParamsToUrl } from './useTableParams';
import {
  selectSetTrackForDelete,
  selectSetTrackForEdit,
  selectSetTrackForUpload,
  selectTrackForDelete,
  selectTrackForEdit,
  selectTrackForUpload,
  useModalsStore,
} from '@/store/ zustand/useModalsStore';
import {
  selectPlayingTrackId,
  selectSetPlayingTrackId,
  usePlayingTrackStore,
} from '@/store/ zustand/usePlayingTrackStore';

export function useTrackTable() {
  const dispatch = useAppDispatch();
  const params = useAppSelector(selectTableParams);
  const sorting = useAppSelector(selectSorting);
  const selectMode = useAppSelector(selectSelectMode);

  const deleteTrack = useDeleteTrack();

  useInitTableParamsOnce();
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

  const trackForEdit = useModalsStore(selectTrackForEdit);
  const setTrackForEdit = useModalsStore(selectSetTrackForEdit);

  const trackForUpload = useModalsStore(selectTrackForUpload);
  const setTrackForUpload = useModalsStore(selectSetTrackForUpload);

  const trackForDelete = useModalsStore(selectTrackForDelete);
  const setTrackForDelete = useModalsStore(selectSetTrackForDelete);

  const playingTrackId = usePlayingTrackStore(selectPlayingTrackId);
  const setPlayingTrackId = usePlayingTrackStore(selectSetPlayingTrackId);

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
        onEdit: setTrackForEdit,
        onUpload: setTrackForUpload,
        onDelete: setTrackForDelete,
      }),
    [selectMode, setPlayingTrackId]
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
    meta: {
      playingTrackId,
      setPlayingTrackId,
    },
  });

  const loading = isLoading || isFetching;

  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection]
  );

  return {
    loading,
    selectedIds,
    trackForEdit,
    setTrackForEdit,
    trackForUpload,
    setTrackForUpload,
    trackForDelete,
    setTrackForDelete,
    handleConfirmDelete,
    table,
    tracks,
    setRowSelection,
  };
}
