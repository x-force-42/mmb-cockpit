import { Button } from "@/components/ui/button";

interface Props {
  total: number;
  limit: number;
  offset: number;
  onChange: (newOffset: number) => void;
}

export function Pagination({ total, limit, offset, onChange }: Props) {
  const page = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canPrev = offset > 0;
  const canNext = offset + limit < total;

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">
        {total === 0
          ? "Nenhuma run"
          : `${offset + 1}–${Math.min(offset + limit, total)} de ${total}`}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">
          Página {page} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => onChange(Math.max(0, offset - limit))}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => onChange(offset + limit)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
