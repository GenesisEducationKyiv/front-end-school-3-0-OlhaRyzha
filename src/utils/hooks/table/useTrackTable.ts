import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnFiltersState, VisibilityState } from '@tanstack/react-table';
import { META } from '@/constants/table.constants';
import { useTableParams } from '@/utils/hooks/table/useTableParams';
import {
  useTracksQuery,
  useDeleteTrack,
} from '@/utils/hooks/tanStackQuery/useTracksQuery';
import { useAppSelector } from '@/store';
import { selectSelectMode } from '@/store/slices/table/tableSlice';
import { trackColumns } from '@/configs/columnsConfig';
import { useTable } from '@/utils/hooks/table/useTable';
import { Track } from '@/types/shared/track';

export function useTrackTable() {
  const {
    params,
    setParams,
    search,
    setSearch,
    handleSortingChange,
    handlePageChange,
    handleLimitChange,
    sorting,
  } = useTableParams();

  const deleteTrack = useDeleteTrack();
  const { data: tracksData, isLoading, isFetching } = useTracksQuery(params);

  const tracks = useMemo(() => tracksData?.data ?? [], [tracksData]);
  const totalItems = tracksData?.meta?.total ?? 0;
  const totalPages = tracksData?.meta?.totalPages ?? META.page;
  const currentPage = tracksData?.meta?.page ?? META.page;
  const limit = tracksData?.meta?.limit ?? META.limit;

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const [trackForEdit, setTrackForEdit] = useState<Track | null>(null);
  const [trackForUpload, setTrackForUpload] = useState<Track | null>(null);
  const [trackForDelete, setTrackForDelete] = useState<Track | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const selectMode = useAppSelector(selectSelectMode);

  const handleConfirmDelete = useCallback(
    (track: Track) => deleteTrack.mutate({ id: track.id }),
    [deleteTrack]
  );

  useEffect(() => {
    setRowSelection({});
  }, [params.page, params.limit, params.sort, params.order, params.search]);

  const availableArtists = useMemo(
    () => Array.from(new Set(tracks.map((t) => t.artist))),
    [tracks]
  );

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
    params,
    setParams,
    search,
    setSearch,
    sorting,
    handleSortingChange,
    handlePageChange,
    handleLimitChange,
    totalItems,
    totalPages,
    currentPage,
    limit,
    loading,
    availableArtists,
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
