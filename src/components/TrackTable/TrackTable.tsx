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
    loading,
    selectedIds,
    selectedTrack,
    modalAction,
    closeModal,
    handleConfirmDelete,
    table,
    tracks,
    setRowSelection,
  } = useTrackTable();

  const handleModalClose = useModalCloseHandler(() => closeModal());

  return (
    <>
      {modalAction === 'edit' && selectedTrack && (
        <Dialog
          open
          onOpenChange={handleModalClose}>
          <CreateTrackModal
            track={selectedTrack}
            onClose={closeModal}
          />
        </Dialog>
      )}

      {modalAction === 'upload' && selectedTrack && (
        <AudioUploadModal
          track={selectedTrack}
          open
          onOpenChange={handleModalClose}
        />
      )}

      <AlertDialogComponent
        open={modalAction === 'delete'}
        onOpenChange={handleModalClose}
        title={dialogMessages.delete('track')}
        description={dialogMessages.cannotBeUndone}
        confirmText='Delete'
        cancelText='Cancel'
        onConfirm={() => {
          if (selectedTrack) handleConfirmDelete(selectedTrack);
          closeModal();
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
