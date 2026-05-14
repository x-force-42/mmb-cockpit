# Task F1 — Camada de dados (API client + TanStack Query + MSW)

## ID
F1

## Status
🎯 pronto pra delegar — **paraleliza com F2** (matriz de conflito
abaixo)

## Intenção

Levantar a camada de dados do cockpit: cliente HTTP tipado pros 5
endpoints do MMB, integração com TanStack Query (hooks tipados,
caching, mutations), e mocks via MSW pra que dev e testes não
dependam do MMB rodando.

Quando essa task mergear, qualquer tela poderá consumir runs,
projetos e métricas com 1-2 linhas de código, sem se preocupar
com fetch/cache/erro.

## Escopo

### Dentro

- **Deps de runtime**: `@tanstack/react-query`.
- **Deps de dev**: `msw` (v2.x).
- **Types do contrato** em `src/types/api.ts`:
  - `Run` (item enxuto da listagem).
  - `RunDetail` (todos os campos + `briefing_json` parseado + `meeseeks_commits_json` parseado + `project_slug`).
  - `Project`.
  - `MetricsOverview` (com `custo_por_dia[]`, `runs_por_dia[]`, `phase_breakdown`).
  - `RunPatch` (3 campos opcionais).
  - `RunsListQuery` (filtros).
  - `TerminalPhase` union dos 6 valores válidos.
- **Cliente HTTP** em `src/api/client.ts`:
  - Wrapper fino sobre `fetch`. Base URL configurável via
    `import.meta.env.VITE_API_BASE_URL` (default `http://localhost:8765`).
  - Faz JSON parsing, faz `throw` em status >= 400 com um `ApiError` tipado.
  - Não usa `axios` — `fetch` puro chega.
- **Query client** em `src/api/queryClient.ts`:
  - `QueryClient` singleton com defaults sensatos
    (`staleTime: 30s`, `refetchOnWindowFocus: false` — é cockpit local,
    não Bloomberg).
- **Hooks tipados** em `src/api/queries/`:
  - `runs.ts`: `useRuns(filters)`, `useRun(id)`, `usePatchRun()`
    (a mutation invalida `['runs']` e `['run', id]`).
  - `projects.ts`: `useProjects()`.
  - `metrics.ts`: `useMetricsOverview(days)`.
- **MSW setup** em `src/api/mocks/`:
  - `handlers.ts` — 5 handlers cobrindo os 5 endpoints com fixtures.
  - `browser.ts` — `setupWorker(...)` pra dev.
  - `server.ts` — `setupServer(...)` pra testes (Node).
  - `public/mockServiceWorker.js` gerado por `npx msw init public/`.
- **Fixtures** em `src/api/mocks/fixtures/`:
  - `runs.ts` — 5 runs variadas (cobrir os principais `terminal_phase`).
    Tem que casar com o shape de `RunDetail` (não só `Run` enxuto),
    porque o handler de `GET /api/runs/{id}` serve daí também.
  - `projects.ts` — 2-3 projetos.
  - `metrics.ts` — 1 overview com `days=30` realista.
- **Integração com `main.tsx`**:
  - Envolver `<App />` em `<QueryClientProvider client={queryClient}>`.
  - Em dev, iniciar MSW se `import.meta.env.VITE_ENABLE_MSW === "true"`.
    Pela ergonomia, default ligado em dev: criar `.env.development`
    no repo com `VITE_ENABLE_MSW=true` e `VITE_API_BASE_URL=http://localhost:8765`.
    `.env.local` (gitignored) sobreve.
- **Integração com testes** em `src/setupTests.ts`:
  - `beforeAll`/`afterEach`/`afterAll` do MSW server.
- **Testes** (vitest + testing-library + @testing-library/react-hooks
  ou `renderHook` do `@testing-library/react`):
  - `src/api/queries/runs.test.tsx` — `useRuns()` resolve com lista,
    `useRun(id)` resolve com detalhe, `useRun("inexistente")`
    devolve erro 404.
  - `src/api/queries/projects.test.tsx` — `useProjects()` lista.
  - `src/api/queries/metrics.test.tsx` — `useMetricsOverview(30)`
    devolve overview com chaves esperadas.
  - Use `QueryClientProvider` mock e `waitFor` pra resolver suspense.

### Fora

- **Componentes de UI** que consomem (vem nas telas F3/F4/F5).
- **Layout/shell, Tailwind, shadcn** (F2 paralela).
- **Forms** (F4 decide react-hook-form depois).
- **Charts** (F5 decide depois).
- **Indicador global de erro** (toast de erro de API) — F4 traz quando
  for usar mutations de verdade.

## Critério de pronto

1. `npm run typecheck` zero erros.
2. `npm run test:run` verde — todos os testes novos passam +
   o teste pré-existente de `Hello` continua passando.
3. `npm run lint` clean.
4. `npm run build` sucesso.
5. `npm run dev` sobe e (manualmente) abrir o console mostra
   `[MSW] Mocking enabled` (mensagem padrão do MSW v2).
6. Hooks são tipados — abrir `useRuns(...)` em TS dá autocomplete
   sobre `filters` e o retorno tem `Run[]` tipado.
7. `.env.development` versionado, `.env.local` gitignored
   (`.gitignore` já tem `.env.local`).
8. README ganha 3 linhas explicando: variáveis `VITE_*`, como
   desligar MSW (apontar pro MMB real), localização das fixtures.

## Contexto técnico

### Contrato da API (autoritativo)

O contrato dos 5 endpoints está em
**`~/llab/mr-meeseeks-box/docs/tasks/E1-api-cockpit.md`**,
seção "Contrato dos 5 endpoints". Leia antes de tipar.

Resumo dos endpoints:

| Método | Path | Query | Body | Returns |
|---|---|---|---|---|
| GET | `/api/runs` | `project, phase, from, to, limit, offset, order` | — | `{items, total, limit, offset}` |
| GET | `/api/runs/{id}` | — | — | `RunDetail` ou 404 |
| PATCH | `/api/runs/{id}` | — | `{merged_to_main?, assertiveness_score?, review_note?}` | `RunDetail` atualizado |
| GET | `/api/projects` | — | — | `{items: Project[]}` |
| GET | `/api/metrics/overview` | `days` | — | `MetricsOverview` |

Domínios constrangidos:

- `merged_to_main`: `0 | 1 | null`.
- `assertiveness_score`: `1..5 | null`.
- `terminal_phase`: `"success" | "meeseeks_failure" |
  "dev_server_failure" | "garagem_pushback" | "garagem_no_slug" |
  "garagem_error"`.

### Padrões a seguir

- pt-BR em mensagens UX e em strings de comentário.
- Nomes técnicos em inglês (`Run`, `useRuns`, `QueryClient`).
- Imports com `verbatimModuleSyntax: true` (config atual do tsconfig).
  Use `import type {...}` pra tipos puros.
- Biome formatter já está configurado — rode `npm run lint:fix`
  antes de commitar.
- Commits granulares no estilo `feat(F1): ...`, `chore(F1): ...`,
  `test(F1): ...`.

### Decisões já fechadas (não negocie)

- Stack do cockpit já decidida: React + Vite + TS + Vitest + Biome
  + react-router. Esta task **adiciona** `@tanstack/react-query` e `msw`.
- Sem axios. Sem Redux. Sem Zustand. Estado servidor = React Query;
  estado UI local = `useState`.
- MSW v2.x.
- Fixtures inventadas (não tente baixar do MMB real).
- Sem CORS porque MSW intercepta no nível do browser/worker (não há
  fetch real saindo). Mesmo sem MMB rodando, dev funciona.

## Implementação sugerida

Ordem:

1. `npm i @tanstack/react-query`.
2. `npm i -D msw`.
3. `npx msw init public/ --save` — gera `public/mockServiceWorker.js`.
4. Cria `src/types/api.ts` com todos os types do contrato.
5. Cria `src/api/client.ts` (fetch wrapper + `ApiError`).
6. Cria `src/api/queryClient.ts`.
7. Cria `src/api/mocks/fixtures/{runs,projects,metrics}.ts`.
8. Cria `src/api/mocks/handlers.ts` (resolve cada endpoint contra fixtures,
   inclusive 404 quando `params.id` não existe e PATCH validando os domínios).
9. Cria `src/api/mocks/browser.ts` e `src/api/mocks/server.ts`.
10. Atualiza `src/setupTests.ts` pra subir o server do MSW.
11. Cria os hooks em `src/api/queries/`.
12. Atualiza `src/main.tsx`: condicional MSW + QueryClientProvider.
13. Cria `.env.development` versionado (e adiciona `.env.development`
    fora do gitignore — o ignore atual cobre `.env*.local` mas o
    arquivo é versionável).
14. Escreve os testes.
15. Roda full check: typecheck, lint, test:run, build.
16. Atualiza README.

### Sketch de `src/api/mocks/handlers.ts`

```ts
import { http, HttpResponse } from "msw";
import { runs } from "./fixtures/runs";
import { projects } from "./fixtures/projects";
import { metrics } from "./fixtures/metrics";

export const handlers = [
  http.get("*/api/runs", ({ request }) => {
    const url = new URL(request.url);
    // aplicar filtros básicos sobre runs e devolver { items, total, limit, offset }
  }),
  http.get("*/api/runs/:id", ({ params }) => {
    const run = runs.find((r) => r.id === params.id);
    if (!run) return HttpResponse.json({ detail: "run não encontrado" }, { status: 404 });
    return HttpResponse.json(run);
  }),
  http.patch("*/api/runs/:id", async ({ params, request }) => {
    const body = (await request.json()) as Partial<RunPatch>;
    // validar domínios; se inválido devolver 422
    // se id não existe devolver 404
    // atualizar e devolver o run completo
  }),
  http.get("*/api/projects", () => HttpResponse.json({ items: projects })),
  http.get("*/api/metrics/overview", ({ request }) => {
    const url = new URL(request.url);
    const days = Number(url.searchParams.get("days") ?? 30);
    return HttpResponse.json({ ...metrics, window_days: days });
  }),
];
```

### Sketch do hook `useRuns`

```ts
export function useRuns(filters: RunsListQuery = {}) {
  return useQuery({
    queryKey: ["runs", filters],
    queryFn: () => apiGet<RunsListResponse>("/api/runs", filters),
  });
}
```

`apiGet` é helper em `client.ts` que serializa filtros em querystring.

## Testes a adicionar

Já listados acima. Mínimo: 4 testes (um por hook + 1 caso de erro 404
em `useRun`).

## Decisões em aberto

Nenhuma. Tudo fechado no discovery.

## Dependências

- Bloqueia: F3 (Lista), F4 (Detalhe), F5 (Dashboard).
- Bloqueado por: nada. **Paraleliza com F2**.

## Conflito potencial com

### F2 (UI tooling + shell) — PARALELA

| Arquivo | F1 faz | F2 faz | Resolução |
|---|---|---|---|
| `src/api/`, `src/types/` | cria | — | sem conflito |
| `src/components/`, `src/components/layout/` | — | cria | sem conflito |
| `src/main.tsx` | adiciona `<QueryClientProvider>` + MSW startup | adiciona `import "./index.css"` | linhas diferentes — merge trivial |
| `src/App.tsx` | — | envolve `<Routes>` em `<Layout>` | sem conflito |
| `package.json` | adiciona deps de data | adiciona deps de UI | merge trivial |
| `package-lock.json` | regenera | regenera | **o 2º a mergear faz `git rebase master` + `rm package-lock.json && npm install` e commita o lock atualizado** |
| `src/setupTests.ts` | adiciona setup MSW | (provavelmente não toca) | sem conflito esperado |
| `README.md` | adiciona seção de env vars | adiciona seção de styling | merge trivial (seções diferentes) |

**Regra de paralelismo**:
- Não toque em `src/components/`, `src/index.css`, `tailwind.config.ts`,
  ou qualquer arquivo de styling. F2 faz isso.
- Se F2 já mergeou antes do seu PR, rebasee e regenere lockfile.

## Estimativa

~2-3h com IA. Maior bloco é a tipagem do contrato + fixtures.
Plumbing TanStack e MSW é mecânico.
