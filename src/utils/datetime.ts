import { format, isFuture, isPast } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

export const APP_TIMEZONE = 'America/Sao_Paulo';

/** Converte um Date/ISO (armazenado em UTC no banco) para o horário de Brasília. */
export function toBrasilia(date: string | Date): Date {
  return toZonedTime(new Date(date), APP_TIMEZONE);
}

/** Converte um valor datetime-local, interpretado em Brasília, para ISO/UTC. */
export function fromBrasiliaToISO(localDateTime: string): string {
  return fromZonedTime(localDateTime, APP_TIMEZONE).toISOString();
}

/** Valor seguro para preencher <input type="datetime-local"> no fuso de Brasília. */
export function toBrasiliaInputValue(date: string | Date): string {
  return format(toBrasilia(date), "yyyy-MM-dd'T'HH:mm");
}

export function formatDatePt(date: string | Date): string {
  return format(toBrasilia(date), 'dd/MM/yyyy', { locale: ptBR });
}

export function formatTimePt(date: string | Date): string {
  return format(toBrasilia(date), 'HH:mm', { locale: ptBR });
}

export function formatDateTimePt(date: string | Date): string {
  return format(toBrasilia(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function isUpcoming(date: string | Date): boolean {
  return isFuture(new Date(date));
}

export function isPastDate(date: string | Date): boolean {
  return isPast(new Date(date));
}
