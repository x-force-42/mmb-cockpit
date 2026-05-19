import { useMemo } from "react";
import { useAndaimeVersions } from "@/api/queries/andaime-versions";
import { Label } from "@/components/ui/label";
import {
  MultiSelectCombobox,
  type MultiSelectOption,
} from "@/components/ui/multi-select-combobox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  selected: readonly string[];
  onChange: (next: string[]) => void;
  /** Texto da label do campo; default "Versão do andaime". */
  legend?: string;
  /** Identidade do campo — precisa ser único por instância na página. */
  idPrefix: string;
  className?: string;
}

export function AndaimeVersionFilter({
  selected,
  onChange,
  legend = "Versão do andaime",
  idPrefix,
  className,
}: Props) {
  const { data: tags = [], isLoading, isError } = useAndaimeVersions();

  const options = useMemo<MultiSelectOption[]>(
    () => tags.map((tag) => ({ value: tag, label: tag })),
    [tags],
  );

  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <Label className="text-xs">{legend}</Label>
        <Skeleton className="h-8 w-44" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label htmlFor={`${idPrefix}-trigger`} className="text-xs">
        {legend}
      </Label>
      {isError ? (
        <p className="h-8 px-1 py-1.5 text-xs text-muted-foreground">
          filtros indisponíveis
        </p>
      ) : tags.length === 0 ? (
        <p className="h-8 px-1 py-1.5 text-xs text-muted-foreground">
          nenhuma versão registrada
        </p>
      ) : (
        <MultiSelectCombobox
          id={`${idPrefix}-trigger`}
          options={options}
          selected={selected}
          onChange={onChange}
          placeholder="Todas"
          aria-label={legend}
          className="w-44"
        />
      )}
    </div>
  );
}
