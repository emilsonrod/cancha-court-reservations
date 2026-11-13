import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarCheck, Clock, MapPin, ShieldCheck, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CanchaCard } from "@/components/site/CanchaCard";
import { canchas, deportes, type Deporte } from "@/data/canchas";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/hero-cancha.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CanchaYa — Reserva tu cancha deportiva en minutos" },
      {
        name: "description",
        content:
          "Encuentra y reserva canchas de fútbol, futsal, tenis, pádel, básquet y vóley. Elige fecha y hora y confirma al instante.",
      },
      { property: "og:title", content: "CanchaYa — Reserva tu cancha deportiva en minutos" },
      {
        property: "og:description",
        content: "Canchas de fútbol, tenis, pádel, básquet y más. Reserva online y confirma al instante.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Bienvenida />
      <Catalogo />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate -mt-16 overflow-hidden bg-secondary pt-16 text-secondary-foreground">
      <img
        src={heroImg}
        alt="Cancha de fútbol iluminada al atardecer"
        width={1920}
        height={1088}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-night" />

      <div className="mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-24 sm:px-6 md:pb-20">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent backdrop-blur animate-rise-in">
          <Zap className="size-3.5" aria-hidden /> Confirmación inmediata
        </span>
        <h1 className="text-display max-w-4xl text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] animate-rise-in [animation-delay:80ms]">
          Tu cancha,
          <br />
          <span className="italic text-accent">a un clic.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-secondary-foreground/80 animate-rise-in [animation-delay:160ms]">
          Fútbol, tenis, pádel, básquet y más. Encuentra el espacio ideal, elige tu horario y juega
          sin llamadas ni esperas.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 animate-rise-in [animation-delay:240ms]">
          <Button asChild variant="volt" size="xl">
            <Link to="/" hash="canchas">Ver canchas disponibles</Link>
          </Button>
          <Button asChild variant="outline-light" size="xl">
            <Link to="/" hash="como-funciona">Cómo funciona</Link>
          </Button>
        </div>

        <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-4 border-t border-secondary-foreground/15 pt-6 animate-rise-in [animation-delay:320ms]">
          {[
            { k: `${canchas.length}`, v: "Canchas activas" },
            { k: "08–23 h", v: "Horario diario" },
            { k: "6", v: "Deportes" },
          ].map((s) => (
            <div key={s.v}>
              <dt className="sr-only">{s.v}</dt>
              <dd className="font-display text-3xl font-extrabold text-accent sm:text-4xl">{s.k}</dd>
              <dd className="text-xs uppercase tracking-wider text-secondary-foreground/65 sm:text-sm">
                {s.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const pasos = [
  {
    icon: MapPin,
    titulo: "Elige tu cancha",
    texto: "Explora el catálogo y filtra por deporte, ubicación o precio.",
  },
  {
    icon: CalendarCheck,
    titulo: "Escoge fecha y hora",
    texto: "Mira los horarios libres al instante y selecciona el que te conviene.",
  },
  {
    icon: Trophy,
    titulo: "Confirma y juega",
    texto: "Recibe tu código de reserva y preséntalo al llegar. ¡Listo!",
  },
];

function Bienvenida() {
  return (
    <section id="como-funciona" className="scroll-mt-16 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Bienvenido a CanchaYa</p>
          <h2 className="text-display mt-3 text-5xl md:text-6xl">
            Reservar una cancha nunca fue tan fácil
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Reunimos los mejores espacios deportivos de la ciudad en un solo lugar. Compara precios,
            revisa la disponibilidad en tiempo real y asegura tu turno en menos de un minuto.
          </p>
          <ul className="mt-8 space-y-3 text-sm font-medium">
            <li className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-primary" aria-hidden /> Reserva garantizada con código único
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-5 text-primary" aria-hidden /> Turnos de 1 a 3 horas, todos los días
            </li>
          </ul>
        </div>

        <ol className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {pasos.map((p, i) => (
            <li
              key={p.titulo}
              className="relative flex gap-5 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card sm:flex-col lg:flex-row lg:items-center"
            >
              <span className="font-display pointer-events-none absolute -right-2 -top-6 text-[7rem] font-extrabold leading-none text-muted">
                {i + 1}
              </span>
              <span className="relative grid size-14 shrink-0 place-items-center rounded-xl bg-gradient-turf text-primary-foreground shadow-card">
                <p.icon className="size-6" aria-hidden />
              </span>
              <div className="relative">
                <h3 className="text-2xl font-bold uppercase">{p.titulo}</h3>
                <p className="mt-1 text-muted-foreground">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Catalogo() {
  const [filtro, setFiltro] = useState<Deporte | "Todos">("Todos");
  const lista = useMemo(
    () => (filtro === "Todos" ? canchas : canchas.filter((c) => c.deporte === filtro)),
    [filtro],
  );

  return (
    <section id="canchas" className="scroll-mt-16 bg-secondary bg-court-lines py-20 text-secondary-foreground md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-accent">Catálogo</p>
            <h2 className="text-display mt-3 text-5xl md:text-6xl">Canchas disponibles</h2>
            <p className="mt-3 max-w-lg text-secondary-foreground/70">
              Elige tu deporte y encuentra el espacio perfecto para tu próximo partido.
            </p>
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:justify-end md:px-0" role="group" aria-label="Filtrar por deporte">
            {(["Todos", ...deportes] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setFiltro(d)}
                aria-pressed={filtro === d}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                  filtro === d
                    ? "border-accent bg-accent text-accent-foreground shadow-volt"
                    : "border-secondary-foreground/20 text-secondary-foreground/80 hover:border-accent hover:text-accent",
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div key={filtro} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((c, i) => (
            <CanchaCard key={c.id} cancha={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
