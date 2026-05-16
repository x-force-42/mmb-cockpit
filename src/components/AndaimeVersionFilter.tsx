import { Label } from "@/components/ui/label";
import { TAGS_DISPONIVEIS } from "@/lib/tags";
import { cn } from "@/lib/utils";

interface Props {
  selected: readonly string[];
  onChange: (next: string[]) => void;
  /** Texto da legend; default "Versão do andaime". */
  legend?: string;
  /** Prefixo dos `id`s dos inputs — precisa ser único por instância na página. */
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
  const toggle = (tag: string, checked: boolean) => {
    if (checked) {
      if (selected.includes(tag)) return;
      onChange([...selected, tag]);
    } else {
      onChange(selected.filter((t) => t !== tag));
    }
  };

  return (
    <fieldset
      className={cn(
        "flex flex-col gap-1.5 rounded-md border bg-background p-2",
        className,
      )}
    >
      <legend className="px-1 text-xs font-medium text-muted-foreground">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {TAGS_DISPONIVEIS.map((tag) => {
          const id = `${idPrefix}-${tag}`;
          const checked = selected.includes(tag);
          return (
            <div key={tag} className="flex items-center gap-1.5">
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => toggle(tag, e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-input accent-primary"
              />
              <Label htmlFor={id} className="cursor-pointer text-sm">
                {tag}
              </Label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
