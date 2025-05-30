import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { COVER_IMAGE_FIELD_NAME } from '@/constants/fieldNames.constants';

type CoverImageValue = string | File | null;

export const useCoverImageField = () => {
  const { setFieldValue, values } = useFormikContext<{
    coverImage: CoverImageValue;
  }>();

  const initialInputType =
    typeof values[COVER_IMAGE_FIELD_NAME] === 'string' ? 'url' : 'file';

  const [inputType, setInputType] = useState<'url' | 'file'>(initialInputType);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(COVER_IMAGE_FIELD_NAME, e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(COVER_IMAGE_FIELD_NAME, e.target.files?.[0] || null);
  };

  useEffect(() => {
    const currentValue = values[COVER_IMAGE_FIELD_NAME];
    if (inputType === 'url' && typeof currentValue !== 'string') {
      setFieldValue(COVER_IMAGE_FIELD_NAME, '');
    }
    if (inputType === 'file' && !(currentValue instanceof File)) {
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
