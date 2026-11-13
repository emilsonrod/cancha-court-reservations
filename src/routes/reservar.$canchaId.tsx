import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, CalendarDays, Clock, MapPin, Star, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCancha, type Cancha } from "@/data/canchas";
import {
  DURACIONES,
  HORARIOS,
  calcularTotal,
  crearReservaSchema,
  duracionesDisponibles,
  formatFechaLarga,
  formatPrecio,
  generarCodigo,
  horaFin,
  horariosOcupados,
  hoyISO,
} from "@/lib/reserva";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reservar/$canchaId")({
  loader: ({ params }) => {
    const cancha = getCancha(params.canchaId);
    if (!cancha) throw notFound();
    return { cancha };
  },
  head: ({ loaderData }) => {
    const nombre = loaderData?.cancha.nombre;
    const title = nombre ? `Reservar ${nombre} — CanchaYa` : "Cancha no disponible — CanchaYa";
    const description = nombre
      ? `Reserva ${nombre} (${loaderData?.cancha.deporte}) en ${loaderData?.cancha.ubicacion}. Elige fecha y hora.`
      : "Esta cancha no está disponible.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-display text-5xl">Cancha no encontrada</h1>
      <p className="mt-3 text-muted-foreground">Puede que ya no esté disponible.</p>
      <Button asChild variant="turf" size="lg" className="mt-6 rounded-xl">
        <Link to="/" hash="canchas">Ver catálogo</Link>
      </Button>
    </div>
  ),
  component: ReservarPage,
});

type Errores = { [K in "nombre" | "fecha" | "hora" | "horas"]?: string | undefined };

function ReservarPage() {
  const { cancha } = Route.useLoaderData();
  const navigate = useNavigate();

  const [hoy, setHoy] = useState("");
  useEffect(() => setHoy(hoyISO()), []);

  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [horas, setHoras] = useState(1);
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);

  const ocupados = useMemo(() => horariosOcupados(cancha.id, fecha), [cancha.id, fecha]);
  const permitidas = hora ? duracionesDisponibles(hora) : [...DURACIONES];
  const total = calcularTotal(cancha.precioHora, horas);

  function elegirHora(h: string) {
    setHora(h);
    const max = Math.max(...duracionesDisponibles(h));
    if (horas > max) setHoras(max);
    setErrores((e) => ({ ...e, hora: undefined }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = crearReservaSchema(hoy || hoyISO()).safeParse({ nombre, fecha, hora, horas });
    const nuevos: Errores = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof Errores;
        if (!nuevos[k]) nuevos[k] = issue.message;
      }
    }
    if (hora && ocupados.includes(hora)) nuevos.hora = "Ese horario ya está ocupado";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0 || !result.success) return;

    setEnviando(true);
    setTimeout(() => {
      navigate({
        to: "/confirmacion",
        search: {
          codigo: generarCodigo(),
          cancha: cancha.id,
          nombre: result.data.nombre,
          fecha: result.data.fecha,
          hora: result.data.hora,
          horas: result.data.horas,
        },
      });
    }, 600);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      <Link
        to="/"
        hash="canchas"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden /> Volver al catálogo
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12">
        <ResumenCancha cancha={cancha} />

        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8"
        >
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Nueva reserva</p>
          <h1 className="text-display mt-2 text-4xl sm:text-5xl">Completa tus datos</h1>

          <div className="mt-8 space-y-7">
            <Campo label="Nombre del cliente" icon={User} htmlFor="nombre" error={errores.nombre}>
              <Input
                id="nombre"
                value={nombre}
                maxLength={80}
                autoComplete="name"
                placeholder="Ej. María Fernández"
                onChange={(e) => {
                  setNombre(e.target.value);
                  setErrores((x) => ({ ...x, nombre: undefined }));
                }}
                aria-invalid={!!errores.nombre}
                className="h-12 rounded-xl text-base"
              />
            </Campo>

            <Campo label="Fecha" icon={CalendarDays} htmlFor="fecha" error={errores.fecha}>
              <Input
                id="fecha"
                type="date"
                min={hoy || undefined}
                value={fecha}
                onChange={(e) => {
                  setFecha(e.target.value);
                  setHora("");
                  setErrores((x) => ({ ...x, fecha: undefined, hora: undefined }));
                }}
                aria-invalid={!!errores.fecha}
                className="h-12 rounded-xl text-base"
              />
              {fecha && !errores.fecha && (
                <p className="mt-2 text-sm text-muted-foreground">{formatFechaLarga(fecha)}</p>
              )}
            </Campo>

            <Campo label="Hora de inicio" icon={Clock} error={errores.hora}>
              {!fecha ? (
                <p className="rounded-xl border border-dashed border-border bg-muted/50 px-4 py-5 text-center text-sm text-muted-foreground">
                  Elige primero una fecha para ver los horarios libres.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5" role="radiogroup" aria-label="Hora de inicio">
                    {HORARIOS.map((h) => {
                      const ocupado = ocupados.includes(h);
                      const activo = hora === h;
                      return (
                        <button
                          key={h}
                          type="button"
                          role="radio"
                          aria-checked={activo}
                          disabled={ocupado}
                          onClick={() => elegirHora(h)}
                          className={cn(
                            "h-11 rounded-xl border text-sm font-semibold transition-all",
                            activo
                              ? "border-primary bg-gradient-turf text-primary-foreground shadow-card"
                              : "border-input bg-background hover:border-primary hover:text-primary",
                            ocupado && "cursor-not-allowed border-transparent bg-muted text-muted-foreground/60 line-through hover:border-transparent hover:text-muted-foreground/60",
                          )}
                        >
                          {h}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><span className="size-3 rounded border border-input bg-background" /> Libre</span>
                    <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-muted" /> Ocupado</span>
                    <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-gradient-turf" /> Tu elección</span>
                  </div>
                </>
              )}
            </Campo>

            <Campo label="Duración" icon={Clock}>
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted p-1">
                {DURACIONES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    disabled={!permitidas.includes(d)}
                    onClick={() => setHoras(d)}
                    aria-pressed={horas === d}
                    className={cn(
                      "h-10 rounded-lg text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40",
                      horas === d ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {d} {d === 1 ? "hora" : "horas"}
                  </button>
                ))}
              </div>
            </Campo>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-secondary p-5 text-secondary-foreground sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-secondary-foreground/60">Total a pagar</p>
              <p className="font-display text-4xl font-extrabold text-accent">{formatPrecio(total)}</p>
              <p className="text-xs text-secondary-foreground/60">
                {formatPrecio(cancha.precioHora)} × {horas} {horas === 1 ? "hora" : "horas"}
                {hora && ` · ${hora} – ${horaFin(hora, horas)}`}
              </p>
            </div>
            <Button type="submit" variant="volt" size="xl" disabled={enviando} className="w-full sm:w-auto">
              {enviando ? "Confirmando…" : "Confirmar reserva"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Campo({
  label,
  icon: Icon,
  htmlFor,
  error,
  children,
}: {
  label: string;
  icon: typeof User;
  htmlFor?: string | undefined;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-primary" aria-hidden /> {label}
      </Label>
      {children}
      {error && <p className="mt-2 text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}

function ResumenCancha({ cancha }: { cancha: Cancha }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-3xl bg-secondary text-secondary-foreground shadow-lift">
        <div className="relative aspect-[16/10]">
          <img src={cancha.imagen} alt={cancha.nombre} width={1024} height={768} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-card-fade" />
          <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
            {cancha.deporte}
          </span>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <h2 className="text-display text-4xl">{cancha.nombre}</h2>
            <p className="mt-2 flex items-start gap-1.5 text-sm text-secondary-foreground/75">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden /> {cancha.ubicacion}
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-3 border-t border-sidebar-border pt-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-secondary-foreground/55">Precio</dt>
              <dd className="font-semibold">{formatPrecio(cancha.precioHora)}/h</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-secondary-foreground/55">Capacidad</dt>
              <dd className="flex items-center gap-1 font-semibold"><Users className="size-3.5" aria-hidden />{cancha.capacidad.split(" ")[0]}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-secondary-foreground/55">Valoración</dt>
              <dd className="flex items-center gap-1 font-semibold"><Star className="size-3.5 fill-accent text-accent" aria-hidden />{cancha.rating.toFixed(1)}</dd>
            </div>
          </dl>
          <p className="text-sm text-secondary-foreground/65">
            Superficie: {cancha.superficie}
            {cancha.techada ? " · Techada" : " · Al aire libre"}
          </p>
        </div>
      </div>
    </aside>
  );
}
