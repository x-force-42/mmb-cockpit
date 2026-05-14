import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TerminalPhase } from "@/types/api";

const PHASE_LABEL: Record<TerminalPhase, string> = {
  success: "sucesso",
  meeseeks_failure: "meeseeks falhou",
  dev_server_failure: "dev server",
  garagem_pushback: "pushback",
  garagem_no_slug: "sem slug",
  garagem_error: "erro garagem",
};

// Variants do shadcn não têm verde; aplico classes Tailwind diretamente
// pra "success" sair em verde e manter o resto consistente.
const PHASE_CLASS: Record<TerminalPhase, string> = {
  success:
    "border-transparent bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
  meeseeks_failure: "border-transparent bg-destructive text-white",
  dev_server_failure: "border-transparent bg-destructive text-white",
  garagem_pushback:
    "border-transparent bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  garagem_no_slug: "",
  garagem_error: "border-transparent bg-destructive text-white",
};

const PHASE_VARIANT_FALLBACK: Record<TerminalPhase, "outline" | "secondary"> = {
  success: "secondary",
  meeseeks_failure: "secondary",
  dev_server_failure: "secondary",
  garagem_pushback: "secondary",
  garagem_no_slug: "outline",
  garagem_error: "secondary",
};

export function PhaseBadge({ phase }: { phase: TerminalPhase }) {
  return (
    <Badge
      variant={PHASE_VARIANT_FALLBACK[phase]}
      className={cn(PHASE_CLASS[phase])}
    >
      {PHASE_LABEL[phase]}
    </Badge>
  );
}
