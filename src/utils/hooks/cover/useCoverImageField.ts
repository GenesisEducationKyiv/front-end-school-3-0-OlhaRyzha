import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { COVER_IMAGE_FIELD_NAME } from '@/constants/fieldNames.constants';

import {
  CoverImageValue,
  INPUT_COVER_IMG_TYPES,
  InputCoverImageType,
} from '@/types/input';
import { isString } from '@/utils/guards/isString';
import { isFile, isFileType } from '@/utils/guards/isFile';
import { isUrl } from '@/utils/guards/isUrl';

export const useCoverImageField = () => {
  const { setFieldValue, values } = useFormikContext<{
    [COVER_IMAGE_FIELD_NAME]: CoverImageValue;
  }>();

  const initialInputType = isString(values[COVER_IMAGE_FIELD_NAME])
    ? INPUT_COVER_IMG_TYPES[0]
    : INPUT_COVER_IMG_TYPES[1];

  const [inputType, setInputType] =
    useState<InputCoverImageType>(initialInputType);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(COVER_IMAGE_FIELD_NAME, e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(COVER_IMAGE_FIELD_NAME, e.target.files?.[0] || null);
  };

  useEffect(() => {
    const currentValue = values[COVER_IMAGE_FIELD_NAME];

    if (isUrl(inputType) && !isString(currentValue)) {
      setFieldValue(COVER_IMAGE_FIELD_NAME, '');
    }

    if (isFileType(inputType) && !isFile(currentValue)) {
      setFieldValue(COVER_IMAGE_FIELD_NAME, null);
    }
  }, [inputType, setFieldValue, values]);

  return {
    inputType,
    setInputType,
    handleUrlChange,
    handleFileChange,
  };
};
