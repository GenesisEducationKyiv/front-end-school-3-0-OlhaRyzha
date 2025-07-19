import { useQuery } from '@tanstack/react-query';
import { useMutateItemWithOptimisticUpdate } from './useMutateItemWithOptimisticUpdate';
import { TRACKS_QUERY_KEY } from '../../../constants/queryKeys.constants';
import { ACTIONS } from '../../../constants/actions.constants';
import {
  BatchDeleteResponse,
  CreateTrackDto,
  PaginatedResponse,
  QueryParams,
  Track,
  UpdateTrackDto,
} from '../../../types/shared/track';
import { IdType } from '@/types/ids';
import {
  ALL_TRACKS_KEY,
  FILE_KEY,
  TRACK_KEY,
  TRACKS_LIST_KEY,
} from '@/constants/table.constants';
import { useAppDispatch } from '@/store';
import { setAllArtists } from '@/store/slices/table/tableSlice';
import { useEffect } from 'react';
import { TrackService } from '@/services';

export const useGetTracks = (params?: QueryParams) => {
  return useQuery<PaginatedResponse<Track>>({
    queryKey: [TRACKS_LIST_KEY, params],
    queryFn: async () => await TrackService.getAll(params),
  });
};

export const useGetAllTracks = () => {
  const dispatch = useAppDispatch();

  const query = useQuery<Track[]>({
    queryKey: [ALL_TRACKS_KEY],
    queryFn: async () => await TrackService.getAllRaw(),
  });

  useEffect(() => {
    const tracks = query.data;
    if (tracks) {
      const availableArtists = Array.from(new Set(tracks.map((t) => t.artist)));
      dispatch(setAllArtists(availableArtists));
    }
  }, [query.data, dispatch]);

  return query;
};

export const useGetTrack = (slug: string) => {
  return useQuery<Track>({
    queryKey: [TRACKS_LIST_KEY, slug],
    queryFn: () => TrackService.getTrackBySlug(slug),
    enabled: Boolean(slug),
  });
};

export const useCreateTrack = () =>
  useMutateItemWithOptimisticUpdate<Track, CreateTrackDto>({
    queryKey: TRACKS_QUERY_KEY,
    action: ACTIONS.CREATE,
    mutateFn: TrackService.create,
    entity: TRACK_KEY,
  });

export const useUpdateTrack = () =>
  useMutateItemWithOptimisticUpdate<
    Track,
    UpdateTrackDto & { id: string; payload: UpdateTrackDto }
  >({
    queryKey: TRACKS_QUERY_KEY,
    action: ACTIONS.UPDATE,
    mutateFn: ({ id, payload }) => TrackService.update(id!, payload),
    entity: TRACK_KEY,
  });

export const useDeleteTrack = () =>
  useMutateItemWithOptimisticUpdate<Track, { id: string }>({
    queryKey: TRACKS_QUERY_KEY,
    action: ACTIONS.DELETE,
    mutateFn: async ({ id }) => {
      await TrackService.delete(id);
      return;
    },
    entity: TRACK_KEY,
  });

export const useBulkDeleteTracks = () =>
  useMutateItemWithOptimisticUpdate<BatchDeleteResponse, IdType[]>({
    queryKey: TRACKS_QUERY_KEY,
    action: ACTIONS.BULK_DELETE,
    mutateFn: (ids) => TrackService.bulkDelete(ids),
    entity: TRACKS_LIST_KEY,
  });

export const useUploadTrackAudio = () =>
  useMutateItemWithOptimisticUpdate<Track, { id: string; file: File }>({
    queryKey: TRACKS_QUERY_KEY,
    action: ACTIONS.UPLOAD_AUDIO,
    mutateFn: ({ id, file }) => TrackService.uploadAudio(id, file),
    entity: FILE_KEY,
  });

export const useDeleteTrackAudio = () =>
  useMutateItemWithOptimisticUpdate<Track, { id?: string }>({
    queryKey: TRACKS_QUERY_KEY,
    action: ACTIONS.DELETE_AUDIO,
    mutateFn: ({ id }) => TrackService.deleteAudio(id),
    entity: FILE_KEY,
  });
