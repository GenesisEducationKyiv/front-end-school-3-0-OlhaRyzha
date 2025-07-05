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
  zodError: '[ZOD PARSE ERROR]:',
  unknownError: 'An unknown error occurred',
  errorUploading: 'Error uploading audio:',
  responseIsNull: 'Response is null or undefined',
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

export const apiErrorMessages = {
  badRequest: 'Bad Request',
  unauthorized: 'Please log in',
  forbidden: 'Access denied',
  notFound: 'Not found',
  timeout: 'Request timed out',
  conflict: 'Conflict',
  payloadTooLarge: 'Payload too large',
  unsupportedMediaType: 'Unsupported media type',
  validationError: 'Validation error',
  tooManyRequests: 'Too many requests',
  serverError: 'Server error',
  badGateway: 'Bad gateway',
  serviceUnavailable: 'Service unavailable',
  gatewayTimeout: 'Gateway timeout',
  clientError: 'Client error',
  serverErrorStatus: 'Server error',
  networkError: 'Network error',
};

export const audioWaveformMessages = {
  onlyBlobUrls: 'Only blob urls supported in waveform!',
  invalidUrl: 'Invalid url',
};
