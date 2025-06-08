export const messageOnSuccessCreated = (value: string) =>
  `A new ${value} has been successfully created.`;

export const messageOnSuccessEdited = (value: string) =>
  `The ${value.toLowerCase()} has been successfully updated.`;

export const messageOnSuccessDeleted = (value: string) =>
  `The ${value.toLowerCase()} has been permanently deleted.`;

export const validationMessages = {
  required: 'This field is required and cannot be left empty.',
  requiredFile: 'File must be selected',
  url: 'Please enter a valid URL starting with http:// or https://.',
  fileExtension:
    'Only supported image formats are allowed (.jpg, .jpeg, .png, .webp, .gif).',
  emty: 'This field cannot be empty.',
  unsupportedFormat:
    'Unsupported audio format. Please use a standard format such as .mp3 or .wav.',
  selectAtLeastOne: 'You must select at least one genre to continue.',
  lengthMax: (maxSize: string) =>
    `The selected file must be smaller than ${maxSize}.`,
  invalidScheme: 'Only HTTP and HTTPS links are supported.',
  invalidHost:
    'The provided image host is not allowed. Please use a trusted source.',
  error: 'An error occurred',
  unknownError: 'An unknown error occurred',
  errorUploading: 'Error uploading audio:',
};
export const audioUploadMessages = {
  replaceOrRemove: 'Replace or remove the current audio file.',
  selectToUpload: 'Select an audio file to upload.',
  audioNotFound: 'Audio not found',
  audioUnavailable: 'Audio file not available',
  audioLoadError: 'Audio load error:',
};
export const dialogMessages = {
  cannotBeUndone: 'This action cannot be undone.',
  areYouSure: 'Are you absolutely sure?',
  delete: (value: string) => `Delete ${value}? `,
  deleteAll: (value: string) =>
    `This will permanently delete all selected ${value}? `,
};
