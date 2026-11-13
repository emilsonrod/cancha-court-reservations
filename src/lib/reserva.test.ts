import { describe, expect, it } from "vitest";
import {
  HORARIOS,
  calcularTotal,
  crearReservaSchema,
  duracionesDisponibles,
  horaFin,
} from "./reserva";

describe("reglas de reserva", () => {
  it("el total es precio por hora multiplicado por las horas", () => {
    expect(calcularTotal(150, 2)).toBe(300);
  });

  it("los turnos van de 08:00 a 22:00", () => {
    expect(HORARIOS[0]).toBe("08:00");
    expect(HORARIOS.at(-1)).toBe("22:00");
  });

  it("no permite turnos que pasen de medianoche", () => {
    expect(duracionesDisponibles("22:00")).toEqual([1, 2]);
    expect(horaFin("21:00", 3)).toBe("24:00");
  });

  it("rechaza fechas pasadas y nombres vacíos", () => {
    const schema = crearReservaSchema("2026-11-13");
    expect(schema.safeParse({ nombre: "Ana Pérez", fecha: "2026-11-12", hora: "10:00", horas: 1 }).success).toBe(false);
    expect(schema.safeParse({ nombre: "  ", fecha: "2026-11-13", hora: "10:00", horas: 1 }).success).toBe(false);
    expect(schema.safeParse({ nombre: "Ana Pérez", fecha: "2026-11-13", hora: "10:00", horas: 1 }).success).toBe(true);
  });
});
