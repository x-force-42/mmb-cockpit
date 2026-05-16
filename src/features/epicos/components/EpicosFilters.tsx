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
import type { EpicoStatus, EpicosListQuery } from "@/types/api";

const ALL = "__all__";

const STATUS_OPTIONS: { value: EpicoStatus; label: string }[] = [
  { value: "aberto", label: "aberto" },
  { value: "fechado", label: "fechado" },
];

interface Props {
  filters: EpicosListQuery;
  onChange: (next: EpicosListQuery) => void;
  onClear: () => void;
}

export function EpicosFilters({ filters, onChange, onClear }: Props) {
  const update = (patch: Partial<EpicosListQuery>) =>
    onChange({ ...filters, ...patch, offset: 0 });

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-md border bg-background p-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="filter-epico-status" className="text-xs">
          Status
        </Label>
        <Select
          value={filters.status ?? ALL}
          onValueChange={(v) =>
            update({ status: v === ALL ? undefined : (v as EpicoStatus) })
          }
        >
          <SelectTrigger id="filter-epico-status" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="filter-epico-from" className="text-xs">
          De
        </Label>
        <Input
          id="filter-epico-from"
          type="date"
          className="w-40"
          value={filters.from ?? ""}
          onChange={(e) => update({ from: e.target.value || undefined })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="filter-epico-to" className="text-xs">
          Até
        </Label>
        <Input
          id="filter-epico-to"
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
