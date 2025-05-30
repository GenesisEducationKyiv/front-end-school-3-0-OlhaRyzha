import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnFiltersState, VisibilityState } from '@tanstack/react-table';
import { META, TRACKS_LIST_KEY } from '@/constants/table.constants';
import { useTableParams } from '@/utils/hooks/table/useTableParams';
import {
  useTracksQuery,
  useDeleteTrack,
} from '@/utils/hooks/tanStackQuery/useTracksQuery';
import { useAppSelector } from '@/store';
import { selectSelectMode } from '@/store/slices/table/tableSlice';
import { trackColumns } from '@/configs/columnsConfig';
import PaginationControls from './PaginationControls';
import TableBodyComponent from './TableBody';
import CreateTrackModal from '@/components/Modal/CreateTrackModal';
import { AlertDialogComponent } from '@/components/shared/AlertDialog';
import { Track } from '@/types/shared/track';
import { Dialog } from '../ui/dialog';
import { useTable } from '@/utils/hooks/useTable';
import { AudioUploadModal } from '../Audio';
import { Loader } from '../shared';
import TableToolbar from './TableToolbar';

function TrackTable() {
  const {
    params,
    setParams,
    search,
    setSearch,
    handleSortingChange,
    handlePageChange,
    handleLimitChange,
    sorting,
  } = useTableParams({ listKey: TRACKS_LIST_KEY });
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

  return (
    <>
      {trackForEdit && (
        <Dialog
          open
          onOpenChange={(o) => !o && setTrackForEdit(null)}>
          <CreateTrackModal
            track={trackForEdit}
            onClose={() => setTrackForEdit(null)}
          />
        </Dialog>
      )}
      {trackForUpload && (
        <AudioUploadModal
          track={trackForUpload}
          open={!!trackForUpload}
          onOpenChange={(o) => !o && setTrackForUpload(null)}
        />
      )}
      <AlertDialogComponent
        open={!!trackForDelete}
        onOpenChange={(open) => !open && setTrackForDelete(null)}
        title='Delete track?'
        description='This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
        onConfirm={() => {
          if (trackForDelete) handleConfirmDelete(trackForDelete);
          setTrackForDelete(null);
        }}
      />

      {loading ? (
        <Loader loading />
      ) : (
        <div className='w-full'>
          <TableToolbar
            search={search}
            setSearch={setSearch}
            params={params}
            setParams={setParams}
            availableArtists={availableArtists}
            selectedIds={selectedIds}
            table={table}
            setRowSelection={setRowSelection}
          />
          <TableBodyComponent
            tracks={tracks}
            table={table}
          />
          <PaginationControls
            totalItems={totalItems}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
            handleLimitChange={handleLimitChange}
            limit={limit}
          />
        </div>
      )}
    </>
  );
}
export default TrackTable;
