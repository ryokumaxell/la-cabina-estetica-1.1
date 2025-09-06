import { format, addDays, startOfWeek, endOfWeek, isSameWeek, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: es });
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es });
}

export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm', { locale: es });
}

export function getWeekDays(date: Date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Lunes
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function isCurrentWeek(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isSameWeek(dateObj, new Date(), { weekStartsOn: 1 });
}

export function calculateAge(birthDate?: string | null): number {
  if (!birthDate || (typeof birthDate === 'string' && birthDate.trim() === '')) {
    return 0; // Si no se proporciona fecha, devolvemos 0 para evitar errores
  }
  const today = new Date();
  const birth = parseISO(birthDate as string);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}