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
import { useModalCloseHandler } from '@/utils/hooks/modal/useModalCloseHandler';

function TrackTable() {
  const {
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
    setRowSelection,
  } = useTrackTable();

  const handleEditModalChange = useModalCloseHandler(setTrackForEdit);
  const handleUploadModalChange = useModalCloseHandler(setTrackForUpload);
  const handleDeleteModalChange = useModalCloseHandler(setTrackForDelete);

  return (
    <>
      {trackForEdit && (
        <Dialog
          open
          onOpenChange={handleEditModalChange}>
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
          onOpenChange={handleUploadModalChange}
        />
      )}
      <AlertDialogComponent
        open={!!trackForDelete}
        onOpenChange={handleDeleteModalChange}
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
            selectedIds={selectedIds}
            table={table}
            setRowSelection={setRowSelection}
          />
          <TableBodyComponent
            tracks={tracks}
            table={table}
          />
          <PaginationControls />
        </div>
      )}
    </>
  );
}
export default TrackTable;
