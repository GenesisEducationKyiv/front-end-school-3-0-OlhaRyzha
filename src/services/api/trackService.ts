import { API_ROUTES } from '@/constants/api.constant';
import { IdType } from '../../types/ids';
import {
  BatchDeleteResponse,
  CreateTrackDto,
  PaginatedResponse,
  QueryParams,
  Track as TrackType,
  UpdateTrackDto,
} from '../../types/shared/track';
import apiClient from '../BaseService';
import { ACTIONS } from '@/constants/actions.constants';
import { safeFetch, fetchVoidResponse, safeFetchBlob } from '@/utils/safeFetch';
import {
  batchDeleteResponseSchema,
  paginatedResponseSchema,
  trackSchema,
} from '@/schemas/track.schemas';
import { getValidatedAudioUrl } from '@/utils/getValidatedAudioUrl';

const tracksRoute = API_ROUTES.TRACKS;
const allTracksRoute = API_ROUTES.ALL_TRACKS;

const TrackService = {
  getAll: (params?: QueryParams): Promise<PaginatedResponse<TrackType>> =>
    safeFetch(
      apiClient.get(tracksRoute, { params }),
      paginatedResponseSchema(trackSchema)
    ),
  getAllRaw: (): Promise<TrackType[]> =>
    safeFetch(apiClient.get(allTracksRoute), trackSchema.array()),

  getTrackBySlug: (slug: string): Promise<TrackType> =>
    safeFetch(apiClient.get(`${tracksRoute}/${slug}`), trackSchema),

  create: (payload: CreateTrackDto): Promise<TrackType> =>
    safeFetch(apiClient.post(tracksRoute, payload), trackSchema),

  update: (id: IdType, payload: UpdateTrackDto): Promise<TrackType> =>
    safeFetch(apiClient.put(`${tracksRoute}/${id}`, payload), trackSchema),

  delete: (id: IdType): Promise<{}> =>
    fetchVoidResponse(apiClient.delete(`${tracksRoute}/${id}`)),

  bulkDelete: (ids: IdType[]): Promise<BatchDeleteResponse> =>
    safeFetch(
      apiClient.post(`${tracksRoute}/${ACTIONS.DELETE}`, { ids }),
      batchDeleteResponseSchema
    ),

  uploadAudio: (id: IdType, file: File): Promise<TrackType> => {
    const formData = new FormData();
    formData.append('file', file);
    return safeFetch(
      apiClient.post(`${tracksRoute}/${id}/${ACTIONS.UPLOAD}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      trackSchema
    );
  },

  deleteAudio: (id?: IdType): Promise<TrackType> =>
    safeFetch(
      apiClient.delete(`${tracksRoute}/${id}/${API_ROUTES.FILE}`),
      trackSchema
    ),

  fetchAudioBlob: (id: IdType, audioFile?: string): Promise<Blob> => {
    const url = getValidatedAudioUrl(audioFile);
    return safeFetchBlob(
      String(id),
      apiClient.get<Blob>(url, { responseType: 'blob' })
    );
  },
};

export default TrackService;
