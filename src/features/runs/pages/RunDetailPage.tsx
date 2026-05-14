import { Link, useParams } from "react-router-dom";
import { ApiError } from "@/api/client";
import { useRun } from "@/api/queries/runs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { RunDetail } from "@/types/api";
import { RunMetadata } from "../components/RunMetadata";
import { RunReviewForm } from "../components/RunReviewForm";

export function RunDetailPage() {
  const { id } = useParams<{ id: string }>();
  const query = useRun(id);

  if (query.isLoading) return <DetailSkeleton />;

  if (query.isError) {
    const status =
      query.error instanceof ApiError ? query.error.status : undefined;
    if (status === 404) return <NotFound />;
    return <GenericError onRetry={() => query.refetch()} />;
  }

  const run = query.data;
  if (!run) return <NotFound />;

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb run={run} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_22rem]">
        <RunMetadata run={run} />
        <RunReviewForm run={run} />
      </div>
      <BriefingCard run={run} />
      <CommitsCard run={run} />
    </div>
  );
}

function Breadcrumb({ run }: { run: RunDetail }) {
  return (
    <nav className="text-sm text-muted-foreground" aria-label="breadcrumb">
      <Link to="/runs" className="hover:text-foreground">
        Runs
      </Link>
      <span className="px-1">›</span>
      <span>{run.project_slug}</span>
      <span className="px-1">›</span>
      <span className="font-mono text-xs">{run.id.slice(0, 8)}</span>
    </nav>
  );
}

function BriefingCard({ run }: { run: RunDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Briefing</CardTitle>
      </CardHeader>
      <CardContent>
        {run.briefing_json ? (
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
            {JSON.stringify(run.briefing_json, null, 2)}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sem briefing registrado.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function CommitsCard({ run }: { run: RunDetail }) {
  const commits = (run.meeseeks_commits_json ?? []) as Array<{
    sha?: string;
    message?: string;
  }>;
  if (commits.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Commits do Meeseeks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {commits.map((c, i) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: commits são imutáveis dentro do detalhe; sha pode faltar em fixtures vazias.
              key={`${c.sha ?? ""}-${i}`}
              className="flex items-baseline gap-3 text-sm"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {(c.sha ?? "").slice(0, 7) || "—"}
              </span>
              <span>{c.message ?? "(sem mensagem)"}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-64" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_22rem]">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      <Skeleton className="h-40" />
    </div>
  );
}

function NotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Run não encontrado</CardTitle>
        <CardDescription>
          Talvez o id esteja errado ou a run foi removida.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline">
          <Link to="/runs">Voltar para a lista</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function GenericError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Não consegui carregar este run</CardTitle>
        <CardDescription>
          A API do MMB pode estar fora do ar ou inacessível.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry}>Tentar de novo</Button>
      </CardContent>
    </Card>
  );
}
