import { Box } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground"
        >
          <Box className="size-4" />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">
            MMB Cockpit
          </span>
          <span className="text-[11px] text-muted-foreground">
            Operações do Mr. Meeseeks Box
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          data-slot="active-project"
          className="text-xs text-muted-foreground"
        >
          {/* placeholder pro indicador de projeto ativo (vem em F3+) */}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
