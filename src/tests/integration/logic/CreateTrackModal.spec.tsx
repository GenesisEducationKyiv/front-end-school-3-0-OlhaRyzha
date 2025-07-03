import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Dialog from '@radix-ui/react-dialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mockExistingTrack } from '@/tests/__mocks__/mockTrack';
import { CreateTrackModal } from '@/components/Modal';
import {
  ToastProvider,
  ToastViewport,
} from '@/components/ui/toast';

const mockCreate = vi.fn();
const mockUpdate = vi.fn();

vi.mock('@/utils/hooks/tanStackQuery/useTracksQuery', () => ({
  useCreateTrack: () => ({ mutateAsync: mockCreate }),
  useUpdateTrack: () => ({ mutateAsync: mockUpdate }),
}));

vi.mock('@/utils/hooks/tanStackQuery/useGenresQuery', () => ({
  useGenresQuery: () => ({ data: ['Rock', 'Pop', 'Jazz'], isLoading: false }),
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <Dialog.Root open>{children}</Dialog.Root>
        <ToastViewport />
      </ToastProvider>
    </QueryClientProvider>
  );
};

describe('CreateTrackModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('creates a new track and calls onClose', async () => {
    const onClose = vi.fn();
    render(<CreateTrackModal onClose={onClose} />, {
      wrapper: createWrapper(),
    });

    await userEvent.type(screen.getByLabelText(/title/i), 'Test Title');
    await userEvent.type(screen.getByLabelText(/artist/i), 'Test Artist');
    await userEvent.click(screen.getByText('Rock'));
    await userEvent.click(screen.getByTestId('submit-button'));

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('shows validation errors if required fields are empty', async () => {
    const onClose = vi.fn();
    render(<CreateTrackModal onClose={onClose} />, {
      wrapper: createWrapper(),
    });

    await userEvent.click(screen.getByTestId('submit-button'));

    const errorMessages = await screen.findAllByText(/required/i);
    expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    expect(mockCreate).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  test('edits an existing track and calls onClose', async () => {
    const onClose = vi.fn();
    render(
      <CreateTrackModal track={mockExistingTrack} onClose={onClose} />,
      {
        wrapper: createWrapper(),
      }
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue(mockExistingTrack.title);
    expect(screen.getByLabelText(/artist/i)).toHaveValue(mockExistingTrack.artist);

    await userEvent.clear(screen.getByLabelText(/title/i));
    await userEvent.type(screen.getByLabelText(/title/i), 'Updated Title');
    await userEvent.clear(screen.getByLabelText(/artist/i));
    await userEvent.type(screen.getByLabelText(/artist/i), 'Updated Artist');
    await userEvent.click(screen.getByText('Pop'));

    await userEvent.click(screen.getByTestId('submit-button'));

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('closes the modal without saving', async () => {
    const onClose = vi.fn();
    render(<CreateTrackModal onClose={onClose} />, {
      wrapper: createWrapper(),
    });

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockCreate).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
