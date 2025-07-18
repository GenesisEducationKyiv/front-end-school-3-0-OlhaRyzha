import TableBodyComponent from './TableBody';
import { AlertDialogComponent } from '@/components/shared/AlertDialog';
import { Dialog } from '../ui/dialog';
import { Loader } from '../shared';
import TableToolbar from './TableToolbar';
import { PaginationControls } from '../shared/pagination';
import { useTrackTable } from '@/utils/hooks/table/useTrackTable';
import { dialogMessages } from '@/constants/message.constant';
import { useModalCloseHandler } from '@/utils/hooks/modal/useModalCloseHandler';
import { lazy, Suspense } from 'react';

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
          <Suspense fallback={<Loader loading />}>
            <CreateTrackModal
              track={selectedTrack}
              onClose={closeModal}
            />
          </Suspense>
        </Dialog>
      )}

      {modalAction === 'upload' && selectedTrack && (
        <Suspense fallback={<Loader loading />}>
          <AudioUploadModal
            track={selectedTrack}
            open
            onOpenChange={handleModalClose}
          />
        </Suspense>
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
        />
        <PaginationControls />
      </div>
    </>
  );
}

export default TrackTable;
