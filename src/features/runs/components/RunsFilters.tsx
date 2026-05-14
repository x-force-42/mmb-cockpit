import { useProjects } from "@/api/queries/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RunsListQuery, TerminalPhase } from "@/types/api";

const ALL = "__all__";

const PHASE_OPTIONS: { value: TerminalPhase; label: string }[] = [
  { value: "success", label: "sucesso" },
  { value: "meeseeks_failure", label: "meeseeks falhou" },
  { value: "dev_server_failure", label: "dev server" },
  { value: "garagem_pushback", label: "pushback" },
  { value: "garagem_no_slug", label: "sem slug" },
  { value: "garagem_error", label: "erro garagem" },
];

interface Props {
  filters: RunsListQuery;
  onChange: (next: RunsListQuery) => void;
  onClear: () => void;
}

export function RunsFilters({ filters, onChange, onClear }: Props) {
  const projectsQuery = useProjects();
  const projects = projectsQuery.data?.items ?? [];

  const update = (patch: Partial<RunsListQuery>) =>
    onChange({ ...filters, ...patch, offset: 0 });

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-md border bg-background p-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="filter-project" className="text-xs">
          Projeto
        </Label>
        <Select
          value={filters.project ?? ALL}
          onValueChange={(v) => update({ project: v === ALL ? undefined : v })}
        >
          <SelectTrigger id="filter-project" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos os projetos</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.slug} value={p.slug}>
                {p.name || p.slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="filter-phase" className="text-xs">
          Fase
        </Label>
        <Select
          value={filters.phase ?? ALL}
          onValueChange={(v) =>
            update({
              phase: v === ALL ? undefined : (v as TerminalPhase),
            })
          }
        >
          <SelectTrigger id="filter-phase" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas as fases</SelectItem>
            {PHASE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="filter-from" className="text-xs">
          De
        </Label>
        <Input
          id="filter-from"
          type="date"
          className="w-40"
          value={filters.from ?? ""}
          onChange={(e) => update({ from: e.target.value || undefined })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="filter-to" className="text-xs">
          Até
        </Label>
        <Input
          id="filter-to"
          type="date"
          className="w-40"
          value={filters.to ?? ""}
          onChange={(e) => update({ to: e.target.value || undefined })}
        />
      </div>

      <Button variant="outline" onClick={onClear} className="ml-auto">
        Limpar filtros
      </Button>
    </div>
  );
}
