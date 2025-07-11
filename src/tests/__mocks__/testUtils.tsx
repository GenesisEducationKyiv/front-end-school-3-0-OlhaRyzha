import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTrackModal } from '@/components/Modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';
import * as Dialog from '@radix-ui/react-dialog';
import type { Track, CreateTrackDto } from '@/types/shared/track';

export function renderModal(onClose: () => void, track?: Track) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <Dialog.Root open>
          <CreateTrackModal
            track={track}
            onClose={onClose}
          />
        </Dialog.Root>
        <ToastViewport />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export async function fillForm(dto: CreateTrackDto) {
  await userEvent.type(screen.getByLabelText(/title/i), dto.title);
  await userEvent.type(screen.getByLabelText(/artist/i), dto.artist);
  if (dto.genres) {
    for (const genre of dto.genres) {
      await userEvent.click(screen.getByText(genre));
    }
  }
}
