import { ColumnDef } from '@tanstack/react-table';
import { Track } from '@/types/shared/track';

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    playingTrackId?: string | null;
    setPlayingTrackId?: (id: string | null) => void;
  }
}
import noCover from '@/assets/image_not_available.png';
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
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { lazy, Suspense } from 'react';
import { Loader } from '@/components/shared';
import { getTrackAudioUrl } from '@/utils/getTrackAudioUrl';
import { formatDate } from '@/utils/formatDate';

const Waveform = lazy(() => import('@/components/Audio/AudioWaveform'));

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
          aria-label='Select all'
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
          data-testid='sort-select'>
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
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
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
      cell: ({ row }) => (
        <img
          className='h-12 w-12 rounded object-cover'
          src={row.original.coverImage || noCover}
          alt={row.original.coverImage ? 'Cover image' : 'No cover available'}
          data-testid={`track-item-${row.original.id}-cover`}
        />
      ),
    },
    {
      id: 'createdAt',
      size: 50,
      minSize: 50,
      header: ({ column }) => (
        <Button
          type='button'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          data-testid='sort-select'>
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
      cell: ({ row, table }) => {
        const track = row.original;
        const audioUrl = getTrackAudioUrl(track.audioFile);

        return audioUrl ? (
          <Suspense fallback={<Loader loading />}>
            <Waveform
              url={audioUrl}
              id={track.id}
              isPlaying={table.options.meta?.playingTrackId === track.id}
              onPlayPause={(id) => {
                if (table.options.meta?.setPlayingTrackId) {
                  table.options.meta.setPlayingTrackId(
                    table.options.meta.playingTrackId === id ? null : id
                  );
                }
              }}
            />
          </Suspense>
        ) : (
          <span className='text-sm text-muted-foreground'>—</span>
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
                  data-testid='track-menu-button'>
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
                  onSelect={() => onUpload(track)}>
                  {track.audioFile ? 'Remove audio' : 'Upload audio'}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  data-testid={`delete-track-${track.id}`}
                  onSelect={() => onDelete(track)}>
                  Delete <RiDeleteBin5Fill className='ml-1' />
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
