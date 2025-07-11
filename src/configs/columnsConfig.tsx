import { ColumnDef } from '@tanstack/react-table';
import { Track } from '@/types/shared/track';
import noCover from '@/assets/image_not_available.webp';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, MoreHorizontal, Trash2 } from '@/components/icons';
import { formatDate } from '@/utils/formatDate';
import { TrackWaveform } from '@/components/Audio';

interface TrackColumnsOpts {
  selectMode: boolean;
  onEdit: (t: Track) => void;
  onUpload: (t: Track) => void;
  onDelete: (t: Track) => void;
  playAudio: (audioUrl: string) => void;
}

export const trackColumns = ({
  selectMode,
  onEdit,
  onUpload,
  onDelete,
}: TrackColumnsOpts): ColumnDef<Track>[] => {
  const cols: ColumnDef<Track>[] = [];

  if (selectMode) {
    cols.push({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          data-testid='select-all'
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label='Select all tracks'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          data-testid={`track-checkbox-${row.original.id}`}
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label={`Select track ${row.original.title}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 48,
    });
  }

  cols.push(
    {
      accessorKey: 'title',
      size: 200,
      minSize: 150,
      header: ({ column }) => (
        <Button
          type='button'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          data-testid='sort-title'
          aria-label='Sort by title'>
          Title <ArrowUpDown className='ml-1 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <span data-testid={`track-item-${row.original.id}-title`}>
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: 'artist',
      size: 200,
      minSize: 150,
      header: ({ column }) => (
        <Button
          type='button'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          aria-label='Sort by artist'>
          Artist <ArrowUpDown className='ml-1 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <span data-testid={`track-item-${row.original.id}-artist`}>
          {row.original.artist}
        </span>
      ),
    },
    {
      id: 'cover',
      header: 'Cover',
      size: 200,
      minSize: 150,
      cell: ({ row }) => {
        return (
          <img
            className='h-12 w-12 rounded object-cover'
            src={row.original.coverImage || noCover}
            onError={(e) => {
              e.currentTarget.src = noCover;
            }}
            alt={
              row.original.coverImage
                ? `Cover image for ${row.original.title}`
                : 'No cover available'
            }
            data-testid={`track-item-${row.original.id}-cover`}
            loading='lazy'
          />
        );
      },
    },
    {
      id: 'createdAt',
      size: 50,
      minSize: 50,
      header: ({ column }) => (
        <Button
          type='button'
          variant='ghost'
          data-testid='sort-select'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          aria-label='Sort by creation date'>
          Created At <ArrowUpDown className='ml-1 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <span data-testid={`track-item-${row.original.id}-createdAt`}>
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: 'audio',
      header: 'Audio',
      size: 600,
      minSize: 400,
      cell: ({ row }) => {
        const { audioFile, id } = row.original;
        if (!audioFile) return null;
        return (
          <TrackWaveform
            id={id}
            audioFile={audioFile}
          />
        );
      },
    },
    {
      accessorKey: 'genres',
      header: 'Genres',
      size: 200,
      minSize: 150,
      meta: { filterVariant: 'select' },
      cell: ({ row }) => (
        <span data-testid={`track-item-${row.original.id}-genres`}>
          {row.original.genres.join(', ')}
        </span>
      ),
    },
    {
      id: 'actions',
      header: () => <span className='text-right'>Actions</span>,
      enableHiding: false,
      size: 120,
      minSize: 120,
      cell: ({ row }) => {
        const track = row.original;
        return (
          <div className='flex justify-end gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type='button'
                  size='icon'
                  variant='ghost'
                  data-testid='track-menu-button'
                  aria-label={`Open actions menu for ${track.title}`}>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem
                  data-testid={`edit-track-${track.id}`}
                  onSelect={() => onEdit(track)}>
                  Edit
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  data-testid={`upload-track-${track.id}`}
                  onSelect={() => {
                    setTimeout(() => onUpload(track), 0);
                  }}>
                  {track.audioFile ? 'Remove audio' : 'Upload audio'}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  data-testid={`delete-track-${track.id}`}
                  onSelect={() => onDelete(track)}>
                  Delete <Trash2 className='ml-1' />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }
  );

  return cols;
};
