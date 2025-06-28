import { COVER_IMAGE_FIELD_NAME } from '@/constants/fieldNames.constants';

export const isCoverImageField = (
  name: string
): name is typeof COVER_IMAGE_FIELD_NAME => name === COVER_IMAGE_FIELD_NAME;
