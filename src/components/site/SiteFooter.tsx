import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-sm text-sm text-secondary-foreground/65">
            Reserva canchas deportivas en minutos. Sin llamadas, sin esperas.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-secondary-foreground/75">
          <Link to="/" hash="como-funciona" className="hover:text-accent">Cómo funciona</Link>
          <Link to="/" hash="canchas" className="hover:text-accent">Canchas</Link>
        </div>
      </div>
      <div className="border-t border-sidebar-border py-4 text-center text-xs text-secondary-foreground/50">
        © {new Date().getFullYear()} CanchaYa · Versión de demostración
      </div>
    </footer>
  );
}
