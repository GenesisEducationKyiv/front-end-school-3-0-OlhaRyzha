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

  if (loading) return <Loader loading={loading} />;
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
