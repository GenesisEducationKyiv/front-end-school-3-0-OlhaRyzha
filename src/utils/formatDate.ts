import { format } from 'date-fns/format';

export function formatDate(date: string | Date): string {
  try {
    return format(new Date(date), 'dd.MM.yyyy HH:mm');
  } catch {
    return '-';
  }
}
