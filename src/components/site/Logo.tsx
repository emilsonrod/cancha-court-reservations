export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-xl bg-accent text-accent-foreground shadow-volt">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M12 5v14" />
          <circle cx="12" cy="12" r="2.6" />
        </svg>
      </span>
      <span className="text-display text-2xl tracking-wide">
        Cancha<span className="text-accent">Ya</span>
      </span>
    </span>
  );
}
