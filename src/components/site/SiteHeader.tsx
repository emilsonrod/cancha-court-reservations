import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-sidebar-border bg-secondary/90 text-secondary-foreground backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="CanchaYa, inicio">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link to="/" hash="como-funciona" className="text-secondary-foreground/75 transition-colors hover:text-accent">
            Cómo funciona
          </Link>
          <Link to="/" hash="canchas" className="text-secondary-foreground/75 transition-colors hover:text-accent">
            Canchas
          </Link>
        </nav>
        <Button asChild variant="volt" size="sm" className="rounded-full px-4">
          <Link to="/" hash="canchas">Reservar ahora</Link>
        </Button>
      </div>
    </header>
  );
}
