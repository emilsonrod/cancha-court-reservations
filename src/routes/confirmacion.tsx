import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Check, Clock, MapPin, Timer, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCancha } from "@/data/canchas";
import { calcularTotal, formatFechaLarga, formatPrecio, horaFin } from "@/lib/reserva";

interface ConfirmacionSearch {
  codigo?: string | undefined;
  cancha?: string | undefined;
  nombre?: string | undefined;
  fecha?: string | undefined;
  hora?: string | undefined;
  horas?: number | undefined;
}

const str = (v: unknown, max = 80) => (typeof v === "string" && v.length <= max ? v : undefined);

export const Route = createFileRoute("/confirmacion")({
  validateSearch: (search: Record<string, unknown>): ConfirmacionSearch => {
    const h = Number(search["horas"]);
    return {
      codigo: str(search["codigo"], 20),
      cancha: str(search["cancha"], 60),
      nombre: str(search["nombre"]),
      fecha: str(search["fecha"], 10),
      hora: str(search["hora"], 5),
      horas: Number.isInteger(h) && h >= 1 && h <= 3 ? h : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Reserva confirmada — CanchaYa" },
      { name: "description", content: "Tu reserva de cancha deportiva está confirmada." },
      { property: "og:title", content: "Reserva confirmada — CanchaYa" },
      { property: "og:description", content: "Tu reserva de cancha deportiva está confirmada." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmacionPage,
});

function ConfirmacionPage() {
  const s = Route.useSearch();
  const cancha = s.cancha ? getCancha(s.cancha) : undefined;

  if (!cancha || !s.codigo || !s.nombre || !s.fecha || !s.hora || !s.horas) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-display text-5xl">No encontramos tu reserva</h1>
        <p className="mt-3 text-muted-foreground">Vuelve al catálogo y elige una cancha para reservar.</p>
        <Button asChild variant="turf" size="lg" className="mt-6 rounded-xl">
          <Link to="/" hash="canchas">Ver canchas</Link>
        </Button>
      </div>
    );
  }

  const total = calcularTotal(cancha.precioHora, s.horas);
  const filas = [
    { icon: User, label: "Cliente", valor: s.nombre },
    { icon: CalendarDays, label: "Fecha", valor: formatFechaLarga(s.fecha) },
    { icon: Clock, label: "Horario", valor: `${s.hora} – ${horaFin(s.hora, s.horas)}` },
    { icon: Timer, label: "Duración", valor: `${s.horas} ${s.horas === 1 ? "hora" : "horas"}` },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-secondary bg-court-lines text-secondary-foreground">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-14 sm:px-6 md:py-20">
        <span className="grid size-20 place-items-center rounded-full bg-accent text-accent-foreground shadow-volt animate-pop-check">
          <Check className="size-10" strokeWidth={3} aria-hidden />
        </span>
        <h1 className="text-display mt-6 text-center text-5xl sm:text-6xl animate-rise-in [animation-delay:150ms]">
          ¡Reserva confirmada!
        </h1>
        <p className="mt-3 text-center text-secondary-foreground/75 animate-rise-in [animation-delay:220ms]">
          Todo listo, {s.nombre.split(" ")[0]}. Presenta tu código al llegar a la cancha.
        </p>

        <div className="mt-10 w-full overflow-hidden rounded-3xl bg-card text-card-foreground shadow-lift animate-rise-in [animation-delay:300ms]">
          <div className="flex items-center gap-4 p-5 sm:p-6">
            <img
              src={cancha.imagen}
              alt={cancha.nombre}
              width={1024}
              height={768}
              className="size-20 shrink-0 rounded-2xl object-cover sm:size-24"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{cancha.deporte}</span>
              <h2 className="text-3xl font-bold uppercase leading-tight">{cancha.nombre}</h2>
              <p className="flex items-start gap-1 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden /> {cancha.ubicacion}
              </p>
            </div>
          </div>

          {/* Ticket perforation */}
          <div className="relative flex items-center">
            <span className="absolute -left-3 size-6 rounded-full bg-secondary" />
            <span className="mx-6 w-full border-t-2 border-dashed border-border" />
            <span className="absolute -right-3 size-6 rounded-full bg-secondary" />
          </div>

          <dl className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            {filas.map((f) => (
              <div key={f.label} className="flex items-start gap-3">
                <f.icon className="mt-0.5 size-5 text-primary" aria-hidden />
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</dt>
                  <dd className="font-semibold">{f.valor}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-3 bg-muted p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Código de reserva</p>
              <p className="font-display text-3xl font-extrabold tracking-widest">{s.codigo}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
              <p className="font-display text-3xl font-extrabold text-primary">{formatPrecio(total)}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild variant="volt" size="xl">
            <Link to="/" hash="canchas">Reservar otra cancha</Link>
          </Button>
          <Button asChild variant="outline-light" size="xl">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
