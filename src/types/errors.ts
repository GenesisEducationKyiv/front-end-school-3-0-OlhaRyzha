export interface AppError {
  message: string;
  code?: string | number;
  data?: unknown;
}
