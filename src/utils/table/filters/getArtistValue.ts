import { ALL_ARTISTS } from '@/constants/labels.constant';

export function getArtistValue(paramArtist?: string | null) {
  return paramArtist && paramArtist?.trim() !== '' ? paramArtist : ALL_ARTISTS;
}
