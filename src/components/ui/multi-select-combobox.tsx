"use client";

import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface Props {
  options: readonly MultiSelectOption[];
  selected: readonly string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  /** Acima desse limite o trigger mostra "{N} selecionadas" no lugar dos chips. */
  maxVisibleChips?: number;
  /** Texto exibido no `CommandEmpty`. */
  emptyText?: string;
  /** Texto do botão "limpar" no rodapé do popover. */
  clearLabel?: string;
  /** Largura mínima do trigger. */
  className?: string;
  /** Identidade pro elemento focável (se quiser associar com `Label`). */
  id?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

/**
 * Combobox multi-select com trigger no estilo `Select` shadcn + popover
 * `Command`. Clique num item alterna seleção sem fechar o popover.
 */
export function MultiSelectCombobox({
  options,
  selected,
  onChange,
  placeholder = "Selecione…",
  maxVisibleChips = 3,
  emptyText = "Nada encontrado.",
  clearLabel = "Limpar seleção",
  className,
  id,
  disabled,
  "aria-label": ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);

  const selectedSet = new Set(selected);
  const selectedOptions = options.filter((o) => selectedSet.has(o.value));

  const toggle = (value: string) => {
    if (selectedSet.has(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeChip = (value: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange([]);
  };

  const overflow = selectedOptions.length > maxVisibleChips;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(
          "flex h-8 min-w-40 items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50",
          className,
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : overflow ? (
            <span className="text-sm">
              {selectedOptions.length} selecionadas
            </span>
          ) : (
            selectedOptions.map((opt) => (
              <Badge
                key={opt.value}
                variant="secondary"
                className="gap-1 px-1.5 py-0 font-normal"
              >
                <span className="truncate">{opt.label}</span>
                <span
                  role="button"
                  aria-label={`Remover ${opt.label}`}
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => removeChip(opt.value, e)}
                  className="-mr-0.5 inline-flex size-3.5 cursor-pointer items-center justify-center rounded-sm hover:bg-muted-foreground/20"
                >
                  <XIcon className="size-3" aria-hidden />
                </span>
              </Badge>
            ))
          )}
        </div>
        <ChevronDownIcon
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar…" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const isSelected = selectedSet.has(opt.value);
                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => toggle(opt.value)}
                  >
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input",
                      )}
                      aria-hidden
                    >
                      {isSelected ? <CheckIcon className="size-3" /> : null}
                    </div>
                    <span>{opt.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          {selectedOptions.length > 0 ? (
            <div className="flex justify-end border-t p-1">
              <button
                type="button"
                onClick={clearAll}
                className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {clearLabel}
              </button>
            </div>
          ) : null}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
