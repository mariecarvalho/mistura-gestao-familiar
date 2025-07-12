export function formatDateToInputDate(dateString?: string | null): string {
  if (!dateString) return '';
  return dateString.split('T')[0];
}
