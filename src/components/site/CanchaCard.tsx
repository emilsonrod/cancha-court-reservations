import { Link } from "@tanstack/react-router";
import { MapPin, Star, Users, Umbrella } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Cancha } from "@/data/canchas";
import { formatPrecio } from "@/lib/reserva";

export function CanchaCard({ cancha, index = 0 }: { cancha: Cancha; index?: number }) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift animate-rise-in"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={cancha.imagen}
          alt={`Cancha de ${cancha.deporte.toLowerCase()}: ${cancha.nombre}`}
          width={1024}
          height={768}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-card-fade" />
        <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
          {cancha.deporte}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-1 text-xs font-semibold text-secondary-foreground backdrop-blur">
          <Star className="size-3.5 fill-accent text-accent" aria-hidden />
          {cancha.rating.toFixed(1)}
        </span>
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-secondary-foreground">
          <p className="font-display text-3xl font-extrabold leading-none">
            {formatPrecio(cancha.precioHora)}
            <span className="ml-1 text-sm font-medium text-secondary-foreground/80">/hora</span>
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1.5">
          <h3 className="text-2xl font-bold uppercase leading-tight">{cancha.nombre}</h3>
          <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            {cancha.ubicacion}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
            <Users className="size-3.5" aria-hidden /> {cancha.capacidad}
          </span>
          <span className="rounded-md bg-muted px-2 py-1">{cancha.superficie}</span>
          {cancha.techada && (
            <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
              <Umbrella className="size-3.5" aria-hidden /> Techada
            </span>
          )}
        </div>
        <Button asChild variant="turf" size="lg" className="mt-auto w-full rounded-xl">
          <Link to="/reservar/$canchaId" params={{ canchaId: cancha.id }}>
            Reservar
          </Link>
        </Button>
      </div>
    </article>
  );
}
