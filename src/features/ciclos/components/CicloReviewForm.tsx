import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { usePatchCiclo } from "@/api/queries/ciclos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CicloDetail } from "@/types/api";
import { type ReviewFormValues, reviewSchema } from "../schema";

interface Props {
  ciclo: CicloDetail;
}

const MERGED_OPTIONS = [
  { value: "1", label: "Sim" },
  { value: "0", label: "Não" },
  { value: "null", label: "Indefinido" },
] as const;

const SCORE_OPTIONS = [
  { value: "null", label: "—" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
] as const;

function parseMerged(value: string): ReviewFormValues["merged_to_main"] {
  if (value === "null") return null;
  return Number(value) as 0 | 1;
}

function parseScore(value: string): ReviewFormValues["assertiveness_score"] {
  if (value === "null") return null;
  return Number(value) as 1 | 2 | 3 | 4 | 5;
}

function isReviewable(status: CicloDetail["status"]): boolean {
  return status === "pr_aberto" || status === "completo";
}

function disabledHint(status: CicloDetail["status"]): string {
  if (status === "abortado") {
    return "ciclo abortado, sem review aplicável";
  }
  return "review fica disponível quando o ciclo abre PR";
}

export function CicloReviewForm({ ciclo }: Props) {
  const mutation = usePatchCiclo(ciclo.id);
  const enabled = isReviewable(ciclo.status);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      merged_to_main: ciclo.merged_to_main,
      assertiveness_score: ciclo.assertiveness_score,
      review_note: ciclo.review_note ?? "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success("Review salvo.");
        form.reset(values);
      },
      onError: (err) => {
        toast.error(`Falha ao salvar: ${(err as Error).message}`);
      },
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <fieldset disabled={!enabled} className="contents">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="merged">Mergeado em main</Label>
              <Controller
                control={form.control}
                name="merged_to_main"
                render={({ field }) => (
                  <Select
                    value={field.value === null ? "null" : String(field.value)}
                    onValueChange={(v) => field.onChange(parseMerged(v))}
                    disabled={!enabled}
                  >
                    <SelectTrigger id="merged" className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MERGED_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="score">Assertividade</Label>
              <Controller
                control={form.control}
                name="assertiveness_score"
                render={({ field }) => (
                  <Select
                    value={field.value === null ? "null" : String(field.value)}
                    onValueChange={(v) => field.onChange(parseScore(v))}
                    disabled={!enabled}
                  >
                    <SelectTrigger id="score" className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SCORE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note">Nota</Label>
              <Controller
                control={form.control}
                name="review_note"
                render={({ field }) => (
                  <Textarea
                    id="note"
                    rows={4}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={!enabled}
                  />
                )}
              />
            </div>
          </fieldset>

          {enabled ? (
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando…" : "Salvar"}
              </Button>
              {form.formState.isDirty && !mutation.isPending ? (
                <span className="text-xs text-muted-foreground">
                  Mudanças não salvas
                </span>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {disabledHint(ciclo.status)}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
