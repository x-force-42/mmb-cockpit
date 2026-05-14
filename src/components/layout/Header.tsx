export function Header() {
  return (
    <header className="flex h-12 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold tracking-tight">
          MMB Cockpit
        </span>
        <span className="text-xs text-muted-foreground">
          Operações do Mr. Meeseeks Box
        </span>
      </div>
      <div data-slot="active-project" className="text-xs text-muted-foreground">
        {/* placeholder pro indicador de projeto ativo (vem em F3+) */}
      </div>
    </header>
  );
}
