import { z } from "zod";

export const MONEDA = "Bs";

/** Horario de apertura: turnos de 1 hora desde las 08:00; el último inicia a las 22:00. */
export const HORARIOS = Array.from({ length: 15 }, (_, i) => `${String(8 + i).padStart(2, "0")}:00`);

export const DURACIONES = [1, 2, 3] as const;

export function formatPrecio(monto: number): string {
  return `${MONEDA} ${monto.toLocaleString("es-BO")}`;
}

export function calcularTotal(precioHora: number, horas: number): number {
  return precioHora * horas;
}

/** Hora de fin en formato HH:00 (las canchas cierran a medianoche). */
export function horaFin(horaInicio: string, horas: number): string {
  const h = Number(horaInicio.slice(0, 2)) + horas;
  return `${String(Math.min(h, 24)).padStart(2, "0")}:00`;
}

/** Duraciones permitidas para un turno sin pasar de la medianoche. */
export function duracionesDisponibles(horaInicio: string): number[] {
  const h = Number(horaInicio.slice(0, 2));
  return DURACIONES.filter((d) => h + d <= 24);
}

/**
 * Turnos ocupados simulados (determinísticos por cancha y fecha) para la demo visual.
 */
export function horariosOcupados(canchaId: string, fecha: string): string[] {
  if (!fecha) return [];
  const seed = `${canchaId}-${fecha}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return HORARIOS.filter((_, i) => ((hash >> i) & 7) === 0);
}

export function hoyISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function generarCodigo(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `CY-${out}`;
}

export function formatFechaLarga(fecha: string): string {
  const [y, m, d] = fecha.split("-").map(Number);
  if (!y || !m || !d) return fecha;
  const texto = new Date(y, m - 1, d).toLocaleDateString("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function crearReservaSchema(hoy: string) {
  return z.object({
    nombre: z
      .string()
      .trim()
      .min(3, { message: "Escribe tu nombre completo (mínimo 3 letras)" })
      .max(80, { message: "El nombre no puede superar 80 caracteres" })
      .regex(/^[\p{L}\s'.-]+$/u, { message: "Usa solo letras y espacios" }),
    fecha: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Elige una fecha" })
      .refine((f) => f >= hoy, { message: "La fecha no puede ser pasada" }),
    hora: z.string().refine((h) => HORARIOS.includes(h), { message: "Elige un horario" }),
    horas: z.number().int().min(1).max(3),
  });
}

export type ReservaInput = z.infer<ReturnType<typeof crearReservaSchema>>;
