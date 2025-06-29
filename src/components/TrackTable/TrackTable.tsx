import TableBodyComponent from './TableBody';
import { AlertDialogComponent } from '@/components/shared/AlertDialog';
import { Dialog } from '../ui/dialog';
import { Loader } from '../shared';
import TableToolbar from './TableToolbar';
import { PaginationControls } from '../shared/pagination';
import { useTrackTable } from '@/utils/hooks/table/useTrackTable';
import { dialogMessages } from '@/constants/message.constant';
import { useModalCloseHandler } from '@/utils/hooks/modal/useModalCloseHandler';
import { lazy } from 'react';

const CreateTrackModal = lazy(() =>
  import('../Modal').then((m) => ({ default: m.CreateTrackModal }))
);

const AudioUploadModal = lazy(() =>
  import('../Audio').then((m) => ({ default: m.AudioUploadModal }))
);

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

  if (loading) return <Loader loading={loading} />;
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

      <div className='w-full'>
        <TableToolbar
          selectedIds={selectedIds}
          table={table}
          setRowSelection={setRowSelection}
        />
        <TableBodyComponent
          tracks={tracks}
          table={table}
          loading={loading}
        />
        <PaginationControls />
      </div>
    </>
  );
}

export default TrackTable;
