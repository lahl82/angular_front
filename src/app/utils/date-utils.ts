export type DateStruct = {
  year: number;
  month: number;
  day: number;
};

export function getTimeOnly(dateTimeStr: string): string {
    return new Date(dateTimeStr).toISOString().substring(11, 16); // HH:mm
}

export function combineDateAndTime(date: Date, time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined.toISOString();
}

export function getDateOnly(date: Date): string {
    const pad = (n: number): string => n < 10 ? '0' + n : n.toString();

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    return `${year}-${month}-${day}`;
}

export function formatDateForDatetimeLocal(date: Date): string {
  const pad = (n: number): string => n < 10 ? '0' + n : n.toString();

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Los meses empiezan en 0
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function isDateInPast(dateIn: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const input = new Date(dateIn);
  input.setHours(0, 0, 0, 0);

  return input < today;
}

export function isDateStructInPast(dateIn: DateStruct): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const input = new Date(dateIn.year, dateIn.month - 1, dateIn.day);
  input.setHours(0, 0, 0, 0);

  return input < today;
}

export function isDateTimeInPast(date: Date): boolean {
  return date < new Date();
}