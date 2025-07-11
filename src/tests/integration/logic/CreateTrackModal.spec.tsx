import { describe, test, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderModal, fillForm } from '@/tests/__mocks__/testUtils';
import {
  mockExistingTrack,
  createTrackDtoMock,
  DUPLICATE_TITLE_ERROR,
  GENERIC_SERVER_ERROR,
} from '@/tests/__mocks__/mockTrack';

const toastMock = vi.fn();
vi.mock('@/utils/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock, dismiss: vi.fn(), toasts: [] }),
}));

const mockCreate = vi.fn();
const mockUpdate = vi.fn();
vi.mock('@/utils/hooks/tanStackQuery/useTracksQuery', () => ({
  useCreateTrack: () => ({ mutateAsync: mockCreate }),
  useUpdateTrack: () => ({ mutateAsync: mockUpdate }),
}));

vi.mock('@/utils/hooks/tanStackQuery/useGenresQuery', () => ({
  useGenresQuery: () => ({ data: ['Rock', 'Pop', 'Jazz'], isLoading: false }),
}));

describe('CreateTrackModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    toastMock.mockClear();
  });

  test('creates a new track and calls onClose', async () => {
    mockCreate.mockResolvedValueOnce({ ...createTrackDtoMock, id: '999' });
    const onClose = vi.fn();
    renderModal(onClose);

    await fillForm(createTrackDtoMock);
    await userEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  test('shows validation errors if required fields are empty', async () => {
    const onClose = vi.fn();
    renderModal(onClose);

    await userEvent.click(screen.getByTestId('submit-button'));

    const errors = await screen.findAllByText(/required/i);
    expect(errors.length).toBeGreaterThan(0);
    expect(mockCreate).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  test('edits an existing track and calls onClose', async () => {
    mockUpdate.mockResolvedValueOnce({
      ...mockExistingTrack,
      title: 'Updated Title',
    });
    const onClose = vi.fn();
    renderModal(onClose, mockExistingTrack);

    expect(screen.getByLabelText(/title/i)).toHaveValue(
      mockExistingTrack.title
    );
    expect(screen.getByLabelText(/artist/i)).toHaveValue(
      mockExistingTrack.artist
    );

    await userEvent.clear(screen.getByLabelText(/title/i));
    await userEvent.type(screen.getByLabelText(/title/i), 'Updated Title');
    await userEvent.clear(screen.getByLabelText(/artist/i));
    await userEvent.type(screen.getByLabelText(/artist/i), 'Updated Artist');
    await userEvent.click(screen.getByText('Pop'));
    await userEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  test('shows error toast when creating a track with duplicate title', async () => {
    mockCreate.mockRejectedValueOnce(new Error(DUPLICATE_TITLE_ERROR.message));
    const onClose = vi.fn();
    renderModal(onClose);

    await fillForm(createTrackDtoMock);
    await userEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: expect.stringMatching(/track with this title/i),
          variant: 'destructive',
        })
      );
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  test('shows error toast when updating a track fails', async () => {
    mockUpdate.mockRejectedValueOnce(new Error(GENERIC_SERVER_ERROR.message));
    const onClose = vi.fn();
    renderModal(onClose, mockExistingTrack);

    await fillForm({ ...createTrackDtoMock, title: 'Some Title' });
    await userEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: expect.stringMatching(/Server Error/),
          variant: 'destructive',
        })
      );
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  test('shows generic error toast on server error', async () => {
    mockCreate.mockRejectedValueOnce(new Error(GENERIC_SERVER_ERROR.message));
    const onClose = vi.fn();
    renderModal(onClose);

    await fillForm(createTrackDtoMock);
    await userEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: expect.stringMatching(/Server Error/),
          variant: 'destructive',
        })
      );
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  test('closes modal when cancelled', async () => {
    const onClose = vi.fn();
    renderModal(onClose);

    await userEvent.click(screen.getByText(/cancel/i));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
