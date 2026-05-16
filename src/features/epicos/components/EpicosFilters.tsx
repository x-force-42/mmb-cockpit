import { SlidersHorizontal } from "lucide-react";
import { AndaimeVersionFilter } from "@/components/AndaimeVersionFilter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="size-4" aria-hidden />
          Filtros
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Limpar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end gap-3">
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

          <AndaimeVersionFilter
            idPrefix="filter-epico-andaime"
            selected={filters.andaime_version ?? []}
            onChange={(next) =>
              update({ andaime_version: next.length > 0 ? next : undefined })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
