import TableBodyComponent from './TableBody';
import CreateTrackModal from '@/components/Modal/CreateTrackModal';
import { AlertDialogComponent } from '@/components/shared/AlertDialog';
import { Dialog } from '../ui/dialog';
import { AudioUploadModal } from '../Audio';
import { Loader } from '../shared';
import TableToolbar from './TableToolbar';
import { PaginationControls } from '../shared/pagination';
import { useTrackTable } from '@/utils/hooks/table/useTrackTable';
import { dialogMessages } from '@/constants/message.constant';

function TrackTable() {
  const {
    params,
    setParams,
    search,
    setSearch,
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
    loading,
    totalItems,
    currentPage,
    totalPages,
    limit,
    handlePageChange,
    handleLimitChange,
    setRowSelection,
  } = useTrackTable();

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
        title={dialogMessages.delete('track')}
        description={dialogMessages.cannotBeUndone}
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
