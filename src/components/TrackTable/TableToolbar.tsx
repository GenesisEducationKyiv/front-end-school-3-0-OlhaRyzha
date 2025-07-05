import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertDialogComponent } from '../shared/AlertDialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Track } from '@/types/shared/track';
import { Table } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectSelectMode,
  setSelectMode,
} from '@/store/slices/table/tableSlice';
import { BTNS_LABELS } from '@/constants/labels.constant';
import FiltersBar from './FiltersBar';
import { SetRowSelectionType } from '@/types/shared/table';
import { useTableToolbar } from '@/utils/hooks/table/useTableToolbar';
import { isNonEmptyArray } from '@/utils/guards/isNonEmptyArray';
import { dialogMessages } from '@/constants/message.constant';

interface TableToolbarProps {
  selectedIds: string[];
  table: Table<Track>;
  setRowSelection: SetRowSelectionType;
}

const TableToolbar = ({
  selectedIds,
  table,
  setRowSelection,
}: TableToolbarProps) => {
  const dispatch = useAppDispatch();

  const {
    localSearch,
    setLocalSearch,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleBulkDelete,
    handleReset,
  } = useTableToolbar({
    selectedIds,
    setRowSelection,
  });
  const selectMode = useAppSelector(selectSelectMode);

  return (
    <div className='flex items-center gap-4 py-2'>
      <Input
        placeholder='Search…'
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className='max-w-xs relative'
        data-testid='search-input'
      />

      <FiltersBar />

      {isNonEmptyArray(selectedIds) && (
        <AlertDialogComponent
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          data-testid='confirm-dialog'
          trigger={
            <Button
              type='button'
              variant='destructive'
              data-testid='bulk-delete-button'>
              {BTNS_LABELS.DELETE_SELECTED_ITEMS(selectedIds.length)}
            </Button>
          }
          title={dialogMessages.delete('selected tracks')}
          description={dialogMessages.deleteAll('tracks')}
          confirmText='Delete'
          cancelText='Cancel'
          onConfirm={handleBulkDelete}
        />
      )}

      <Button
        type='button'
        onClick={handleReset}
        data-testid='reset-button'>
        {BTNS_LABELS.RESET_ALL}
      </Button>

      <Button
        type='button'
        onClick={() => dispatch(setSelectMode(!selectMode))}
        data-testid='select-mode-toggle'>
        {selectMode
          ? BTNS_LABELS.DISABLE_BULK_SELECT
          : BTNS_LABELS.ENABLE_BULK_SELECT}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type='button'
            variant='outline'
            className='ml-auto'>
            Columns <ChevronDown className='ml-1 h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {table
            .getAllColumns()
            .filter((col) => col.getCanHide())
            .map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(v) => col.toggleVisibility(!!v)}
                data-testid={`column-toggle-${col.id}`}>
                {col.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default TableToolbar;
