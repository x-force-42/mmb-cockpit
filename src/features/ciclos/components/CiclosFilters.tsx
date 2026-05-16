import { useEpicos } from "@/api/queries/epicos";
import { useProjetos } from "@/api/queries/projetos";
import { AndaimeVersionFilter } from "@/components/AndaimeVersionFilter";
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
import type { AbortOrigin, CicloStatus, CiclosListQuery } from "@/types/api";

const ALL = "__all__";

const STATUS_OPTIONS: { value: CicloStatus; label: string }[] = [
  { value: "iniciado", label: "iniciado" },
  { value: "planejado", label: "planejado" },
  { value: "pr_aberto", label: "PR aberto" },
  { value: "completo", label: "completo" },
  { value: "abortado", label: "abortado" },
];

const ABORT_OPTIONS: { value: AbortOrigin; label: string }[] = [
  { value: "heartbeat", label: "heartbeat" },
  { value: "manual", label: "manual" },
  { value: "self", label: "self" },
  { value: "master", label: "master" },
];

interface Props {
  filters: CiclosListQuery;
  onChange: (next: CiclosListQuery) => void;
  onClear: () => void;
}

export function CiclosFilters({ filters, onChange, onClear }: Props) {
  const epicosQuery = useEpicos();
  const projetosQuery = useProjetos();
  const epicos = epicosQuery.data?.items ?? [];
  const projetos = projetosQuery.data?.items ?? [];

  const update = (patch: Partial<CiclosListQuery>) =>
    onChange({ ...filters, ...patch, offset: 0 });

  const showAbortOrigin = !filters.status || filters.status === "abortado";

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-md border bg-background p-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="filter-epico" className="text-xs">
          Épico
        </Label>
        <Select
          value={filters.epico ?? ALL}
          onValueChange={(v) => update({ epico: v === ALL ? undefined : v })}
        >
          <SelectTrigger id="filter-epico" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos os épicos</SelectItem>
            {epicos.map((e) => (
              <SelectItem key={e.slug} value={e.slug}>
                {e.slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
            {projetos.map((p) => (
              <SelectItem key={p.slug} value={p.slug}>
                {p.name || p.slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="filter-status" className="text-xs">
          Status
        </Label>
        <Select
          value={filters.status ?? ALL}
          onValueChange={(v) =>
            update({
              status: v === ALL ? undefined : (v as CicloStatus),
              abort_origin: v === "abortado" ? filters.abort_origin : undefined,
            })
          }
        >
          <SelectTrigger id="filter-status" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos os status</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showAbortOrigin ? (
        <div className="flex flex-col gap-1">
          <Label htmlFor="filter-abort" className="text-xs">
            Origem do abort
          </Label>
          <Select
            value={filters.abort_origin ?? ALL}
            onValueChange={(v) =>
              update({
                abort_origin: v === ALL ? undefined : (v as AbortOrigin),
              })
            }
          >
            <SelectTrigger id="filter-abort" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas</SelectItem>
              {ABORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

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

      <AndaimeVersionFilter
        idPrefix="filter-ciclo-andaime"
        selected={filters.andaime_version ?? []}
        onChange={(next) =>
          update({ andaime_version: next.length > 0 ? next : undefined })
        }
      />

      <Button variant="outline" onClick={onClear} className="ml-auto">
        Limpar filtros
      </Button>
    </div>
  );
}
