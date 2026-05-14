# Task M1 — Cockpit MVP completo (3 telas + hotfixes pós-F2)

## ID
M1

## Status
🎯 pronto pra delegar — task grande, brief autossuficiente

## Intenção

Entregar o **MVP do cockpit em uma única passada**: as 3 telas
(Dashboard, Lista de runs, Detalhe + edição), os componentes
shadcn adicionais que faltam, os hooks já existentes de F1 conectados,
e os 3 hotfixes pós-F2 (vitest scope, shadcn dep, task-end.sh).

A motivação é velocidade: empacotar F2.1 + F3 + F4 + F5 num único
brief reduz overhead de orquestração (briefs, reviews, merges,
context-switching). Em troca, o agente carrega um escopo grande
de uma vez — por isso o brief é mais detalhado que o normal.

Quando essa task mergear, o cockpit estará **funcional ponta-a-ponta**
contra MSW (e contra a API real do MMB quando ela existir / estiver
ligada).

## Escopo

### 0. Hotfixes pós-F2 (faça primeiro — destrava o resto)

**0.1) Vitest excluir `.worktrees/**`**

Em `vite.config.ts`, dentro do bloco `test:`:

```ts
test: {
  globals: true,
  environment: "jsdom",
  setupFiles: "./src/setupTests.ts",
  css: false,
  exclude: [
    "**/node_modules/**",
    "**/.worktrees/**",
    "**/dist/**",
  ],
},
```

Validação: deixe a worktree atual montada e rode `npm run test:run`.
Cada arquivo de teste deve aparecer 1 vez, não 2.

**0.2) `shadcn` → devDependencies**

`shadcn` é CLI, não runtime. Mover a linha de `dependencies` pra
`devDependencies` em `package.json`. `radix-ui` e `lucide-react`
ficam onde estão (são runtime de fato).

**0.3) `task-end.sh` aceita squash merges**

`scripts/task-end.sh` linha 36 usa `git merge-base --is-ancestor`
que falha quando o PR foi mergeado via squash. Substitua o bloco
de check (linhas ~34-43) por:

```bash
# Confere mergeada (FF ou squash)
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  if git merge-base --is-ancestor "$BRANCH" master; then
    : # mergeada via FF/merge tradicional
  elif [ -z "$(git cherry master "$BRANCH" | grep '^\+' || true)" ]; then
    : # mergeada via squash
  else
    echo "ERRO: branch $BRANCH não está mergeada em master."
    echo "Mergeie o PR primeiro, ou destrutivo manualmente:"
    echo "  git worktree remove --force $WORKTREE_PATH"
    echo "  git branch -D $BRANCH"
    exit 1
  fi
fi
```

E troque o `git branch -d` final por `git branch -D` (já validou
acima que mergeou, e `-d` falha em branches squashadas).

### 1. Estrutura de pastas (feature folders)

Adote desta task em diante:

```
src/
├── features/
│   ├── runs/
│   │   ├── pages/
│   │   │   ├── RunsListPage.tsx
│   │   │   └── RunDetailPage.tsx
│   │   ├── components/
│   │   │   ├── RunsTable.tsx
│   │   │   ├── RunsFilters.tsx
│   │   │   ├── RunReviewForm.tsx
│   │   │   ├── RunMetadata.tsx
│   │   │   ├── PhaseBadge.tsx
│   │   │   └── Pagination.tsx
│   │   ├── schema.ts      ← zod do RunPatch
│   │   └── format.ts      ← helpers pt-BR (BRL, datas, durações)
│   └── dashboard/
│       ├── pages/DashboardPage.tsx
│       └── components/
│           ├── KpiCards.tsx
│           ├── RunsPorDiaChart.tsx
│           ├── CustoPorDiaChart.tsx
│           └── PhaseBreakdown.tsx
├── components/layout/...   ← já existe (Layout, Header, Sidebar)
├── components/ui/...        ← já existe + você adiciona via shadcn add
├── api/...                  ← já existe (F1)
├── types/...                ← já existe (F1)
└── lib/...                  ← já existe (utils.ts do shadcn)
```

Apague `src/pages/Hello.tsx`, `src/pages/Hello.test.tsx` e
`src/pages/RunsList.tsx` — são placeholders de F0/F2, substituídos
agora.

### 2. Componentes shadcn adicionais

Rode (em sequência, deixa o CLI baixar):

```bash
npx shadcn@latest add table dialog select input textarea label badge tooltip sonner
```

(`form` não é estritamente necessário — você vai usar react-hook-form
diretamente com Input/Select/Textarea. Pule.)

`sonner` instala o toast — adicione `<Toaster />` no Layout, ou em
`main.tsx` ao lado do `<App />` (escolha do agente; recomendo Layout
pra estar dentro do BrowserRouter).

### 3. Deps novas

```bash
npm i react-hook-form zod @hookform/resolvers recharts
```

(Versões: o que estiver atual em 2026-05. recharts ^2 ou ^3 — qualquer
um serve, escolha o atual.)

### 4. Atualizar roteamento

`src/App.tsx`:

```tsx
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { RunsListPage } from "./features/runs/pages/RunsListPage";
import { RunDetailPage } from "./features/runs/pages/RunDetailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/runs" element={<RunsListPage />} />
        <Route path="/runs/:id" element={<RunDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
```

`Sidebar.tsx` (atualizar `NAV_ITEMS`):

```tsx
const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/runs", label: "Runs", end: false },
] as const;
```

(O `end: false` em `/runs` faz com que `/runs/:id` também marque
"Runs" como ativo na sidebar — comportamento desejado.)

### 5. Tela: Dashboard (`/`)

`src/features/dashboard/pages/DashboardPage.tsx`:

- Consome `useMetricsOverview(30)` (já existe em
  `src/api/queries/metrics.ts`).
- 4 estados: loading (Skeleton), erro (Card com mensagem +
  botão retry → `refetch()`), vazio (Card "sem dados ainda"),
  sucesso (renderiza dashboard).
- Picker simples de janela: select com [7, 30, 90] dias.
  Use `useState` local; refaz query quando muda.

Layout do sucesso:

```
┌─────────────────────────────────────────────┐
│ KpiCards (4 cards: total runs, custo total, │
│   tempo médio, taxa de pushback)            │
├─────────────────────┬───────────────────────┤
│ RunsPorDiaChart      │ CustoPorDiaChart       │
│ (BarChart recharts)  │ (LineChart recharts)   │
├─────────────────────┴───────────────────────┤
│ PhaseBreakdown (lista com Badge por phase    │
│   + contagem + barra de proporção)           │
└─────────────────────────────────────────────┘
```

Componentes:

- **`KpiCards.tsx`**: recebe `MetricsOverview`, renderiza 4
  `<Card>` em `grid grid-cols-2 lg:grid-cols-4 gap-4`. Cada card:
  título em `text-xs text-muted-foreground`, valor em
  `text-2xl font-semibold`. Formatos:
  - Total runs: `formatNumber(runs_total)` (ex: "87")
  - Custo total: `formatBRL(custo_total_usd * COTACAO)` ou
    `formatUSD(custo_total_usd)` — **use USD direto**, sem cotação
    (API entrega USD).
  - Tempo médio: `formatDuration(tempo_medio_s)` (ex: "1m 32s")
  - Taxa de pushback: `formatPercent(taxa_pushback)` (ex: "18%")
- **`RunsPorDiaChart.tsx`**: recharts `<BarChart>` sobre
  `runs_por_dia` (ordenado asc por dia pra eixo X cronológico).
  Eixo Y: contagem. Tooltip com data formatada pt-BR.
- **`CustoPorDiaChart.tsx`**: recharts `<LineChart>` (ou
  `<AreaChart>`) sobre `custo_por_dia`. Eixo Y em USD.
- **`PhaseBreakdown.tsx`**: lista vertical. Pra cada `phase` em
  `phase_breakdown`, mostra `<PhaseBadge phase={phase} />` + count
  + barra de proporção (`<div>` com `width: ${n/total*100}%`).

### 6. Tela: Lista de runs (`/runs`)

`src/features/runs/pages/RunsListPage.tsx`:

- Consome `useRuns(filters)` (já existe).
- Estado local: `RunsListQuery` com `limit: 25, offset: 0` defaults.
- 4 estados: loading (Skeleton de tabela), erro, vazio (Card "sem
  runs"), sucesso (tabela).

Componentes:

- **`RunsFilters.tsx`**: barra superior com:
  - Select de projeto (alimentado por `useProjects()`). Opção
    "Todos os projetos" como default (envia `project: undefined`).
  - Select de `phase` (6 opções + "Todas as fases").
  - 2 `<input type="date">` (from / to).
  - Botão "Limpar filtros" reseta tudo.
  Sincronia via callback `onChange(filters)` pro pai atualizar
  o state.
- **`RunsTable.tsx`**: shadcn `<Table>`. Colunas:
  - Data (clicável, ordena por `started_at`)
  - Projeto (`project_slug`)
  - Tarefa (`task_raw`, truncada em ~60 chars com tooltip)
  - Fase (`<PhaseBadge phase={...} />`)
  - Duração (`formatDuration(total_elapsed_s)`)
  - Custo (`formatUSD(garagem_cost_usd + meeseeks_cost_usd)`)
  - Review: 2 indicadores compactos:
    - merged: ícone Lucide (`Check` verde / `X` vermelho /
      `Minus` cinza pra null).
    - score: pequeno texto "4/5" ou "–" pra null.
  - Cada linha é clicável → navega pra `/runs/${id}`.
- **`Pagination.tsx`**: componente próprio (não usa shadcn
  pagination — paginação manual com 2 botões + label "Página X de Y").
  Props: `total, limit, offset, onChange(newOffset)`.

Ordenação: clicar no header da coluna "Data" toggla
`started_at:desc` ↔ `started_at:asc` e re-fetcha. Outras colunas
não ordenam (não tem suporte da API).

### 7. Tela: Detalhe de run (`/runs/:id`)

`src/features/runs/pages/RunDetailPage.tsx`:

- `useParams<{ id: string }>()` pra pegar o id.
- Consome `useRun(id)` (já existe).
- 4 estados: loading (Skeleton), 404 (Card "run não encontrado"
  + link "voltar pra lista"), erro genérico, sucesso.

Layout do sucesso (grid 2 colunas no desktop, stack no mobile):

```
┌──────────────────────────────────────────────┐
│ Breadcrumb: Runs › <project_slug> › <id..>   │
├──────────────────────────┬───────────────────┤
│ RunMetadata               │ RunReviewForm     │
│  (Card com: tarefa,       │  (form com:       │
│   started_at, duração,    │   merged_to_main, │
│   phase, custo total,     │   score 1-5,      │
│   project, ...)           │   review_note)    │
├──────────────────────────┴───────────────────┤
│ Briefing (Card com pretty-printed briefing_json)│
├──────────────────────────────────────────────┤
│ Commits (lista de sha + message do            │
│   meeseeks_commits_json)                      │
└──────────────────────────────────────────────┘
```

Componentes:

- **`RunMetadata.tsx`**: lista de pares (label / value) com
  campos do `RunDetail`. Use `<dl>` semanticamente.
- **`RunReviewForm.tsx`**: form com `react-hook-form` +
  `zodResolver(reviewSchema)`. Campos:
  - `merged_to_main`: 3 radios (Sim / Não / Indefinido), mapeia
    pra `1 / 0 / null`.
  - `assertiveness_score`: select com opções `1..5 | "—"`.
  - `review_note`: textarea livre.
  Botão "Salvar" chama `usePatchRun(id).mutate(values)`. Em sucesso,
  `toast.success("Review salvo")` (sonner). Em erro, `toast.error(...)`.
  O form **inicializa com os valores atuais** (`defaultValues` vem
  do detail).

`schema.ts` (zod):

```ts
import { z } from "zod";

export const reviewSchema = z.object({
  merged_to_main: z.union([z.literal(0), z.literal(1), z.null()]),
  assertiveness_score: z.union([
    z.literal(1), z.literal(2), z.literal(3),
    z.literal(4), z.literal(5), z.null(),
  ]),
  review_note: z.string().nullable(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
```

- **Briefing pretty-print**: bloco `<pre>` com
  `JSON.stringify(briefing_json, null, 2)` dentro de `<Card>`. Sem
  highlight syntax — out of scope.
- **Commits**: se `meeseeks_commits_json` tem `length > 0`, lista
  com sha (mono font, truncado em 7 chars) + message.

### 8. Helpers de formatação

`src/features/runs/format.ts`:

```ts
export function formatUSD(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null) return "—";
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(iso));
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
```

(Compartilhe com Dashboard via re-export ou copie — você decide.
Recomendo movê-lo pra `src/lib/format.ts` já que é genérico.)

### 9. PhaseBadge

`src/features/runs/components/PhaseBadge.tsx`: shadcn `<Badge>` com
cor por phase:

```ts
const PHASE_LABEL: Record<TerminalPhase, string> = {
  success: "sucesso",
  meeseeks_failure: "meeseeks falhou",
  dev_server_failure: "dev server",
  garagem_pushback: "pushback",
  garagem_no_slug: "sem slug",
  garagem_error: "erro garagem",
};

const PHASE_VARIANT: Record<TerminalPhase, BadgeVariant> = {
  success: "default",       // verde-ish
  meeseeks_failure: "destructive",
  dev_server_failure: "destructive",
  garagem_pushback: "secondary",
  garagem_no_slug: "outline",
  garagem_error: "destructive",
};
```

(Use cores via tokens shadcn; ajuste se as variants default não
tiverem verde — pode aplicar Tailwind classes diretamente.)

### 10. Testes mínimos

Não é cobertura exaustiva — é smoke:

- `DashboardPage.test.tsx`: renderiza com mock, vê 4 KPIs.
- `RunsListPage.test.tsx`: renderiza, vê pelo menos 1 linha.
- `RunDetailPage.test.tsx`: renderiza com `id` válido (use
  primeiro id das fixtures), vê tarefa + form.
- `RunReviewForm.test.tsx`: submit aciona mutation com valores
  corretos (use `vi.fn()` mock ou observa MSW handler).
- `format.test.ts`: 5-6 testes dos helpers (BRL, duração, %, etc).

Total esperado: 5-8 testes novos + os 10 existentes seguem verdes.

### 11. Fixtures (opcional mas útil)

Se notar que os 5 runs de fixture não cobrem `garagem_error`,
**adicione 1 fixture** com esse phase pra Dashboard render correto
do `phase_breakdown`. Não obrigatório, mas economiza dor.

### Fora

- Real-time / WebSocket.
- Dark mode toggle.
- Auth.
- Filtros server-side avançados além dos 5 já no contrato.
- Search livre de texto.
- Export pra CSV.
- Edição em massa.
- Comparativo de modelos / catálogo detalhado de projetos
  (vem com B1/B2/B3 do MMB).

## Critério de pronto

1. `npm run typecheck` zero erros.
2. `npm run lint` clean.
3. `npm run test:run` verde — testes existentes + novos passam,
   e (com worktrees montadas) só roda 1 vez cada.
4. `npm run build` sucesso. Bundle <500kb gzipped (~10kb hoje +
   recharts + sonner + react-hook-form deve dar ~200kb gzip).
5. `npm run dev`:
   - `/` mostra Dashboard com 4 KPIs + 2 charts + breakdown.
   - `/runs` lista runs em tabela, filtros funcionam, paginação
     funciona, ordenação por data funciona, clique em linha vai
     pra detalhe.
   - `/runs/<id>` mostra metadata + form de review + briefing.
     Submeter form mostra toast e re-fetcha.
   - `/runs/inexistente` mostra "run não encontrado" + link voltar.
6. `scripts/task-end.sh M1` executa limpo (testa o hotfix 0.3).
7. Commits granulares na branch (lembre: master vai squashar).
   Sugestão de macro-blocos pra granularidade:
   - `chore(M1): hotfixes pós-F2 (vitest, shadcn dep, task-end)`
   - `chore(M1): instala recharts, react-hook-form, zod`
   - `chore(M1): shadcn add table dialog select input textarea ...`
   - `refactor(M1): apaga pages/Hello, migra rotas pra features/`
   - `feat(M1): dashboard com KPIs + charts`
   - `feat(M1): lista de runs com filtros, ordenação, paginação`
   - `feat(M1): detalhe de run com form de review`
   - `feat(M1): formatters pt-BR + PhaseBadge`
   - `test(M1): smoke tests das 3 telas + format`

## Contexto técnico

### Decisões fechadas (não negocie)

- **Forms**: `react-hook-form` + `zod` + `@hookform/resolvers`.
- **Charts**: `recharts`.
- **Toast**: `sonner` (via `shadcn add sonner`).
- **Tabela**: shadcn `<Table>` + paginação manual. **Sem TanStack
  Table** — overkill pra ≤200 linhas por página.
- **Date inputs**: `<input type="date">` HTML5 nativo. Sem
  react-day-picker / date-fns extras.
- **Formatação**: `Intl.*` nativo, locale `pt-BR`, currency `USD`
  (não BRL — API entrega valores em USD).
- **State management**: TanStack Query (servidor) + `useState`
  local (UI). **Sem Zustand / Redux**.
- **Roteamento**: react-router v7, nested routes (já estruturado em F2).

### Padrões já estabelecidos no projeto

- Imports com `verbatimModuleSyntax: true` (`import type {...}`).
- `erasableSyntaxOnly: true` — sem enums; use `as const` + union types.
- Aliases: `@/components`, `@/lib/utils`, `@/api/...`, etc.
- Commits no estilo `feat(M1): ...`, `chore(M1): ...`, etc.
- pt-BR em strings UX e comentários; inglês em nomes técnicos.
- Tokens shadcn: `bg-background`, `bg-muted`, `text-foreground`,
  `text-muted-foreground`, `border-border`, etc.
- Tipos do contrato em `src/types/api.ts` — **use, não duplique**.

### Onde olhar

- **Contrato da API**: `~/llab/mr-meeseeks-box/docs/tasks/E1-api-cockpit.md`,
  seção "Contrato dos 5 endpoints". Use como verdade.
- **Hooks existentes**: `src/api/queries/{runs,projects,metrics}.ts`.
- **Fixtures MSW**: `src/api/mocks/fixtures/{runs,projects,metrics}.ts`.
- **Layout shell**: `src/components/layout/{Layout,Header,Sidebar}.tsx` —
  você só atualiza `NAV_ITEMS` na Sidebar.
- **components.json** do shadcn — não toque, mas saiba que está
  configurado com preset `radix-nova` + base `neutral`.

## Decisões em aberto

Nenhuma. Tudo fechado neste brief.

## Dependências

- Bloqueia: nada (é o MVP).
- Bloqueado por: F1 ✅ e F2 ✅ já mergeados.

## Conflito potencial com

Nada. Worktree única, escopo grande, sem concorrência.

## Estimativa

~6-10h com IA. Distribuição aproximada:

- Hotfixes pós-F2: ~20min.
- Setup (deps + shadcn add): ~20min.
- Dashboard: ~1.5-2h.
- Lista: ~2-3h (tabela + filtros + paginação + ordenação).
- Detalhe + form: ~2-3h (form com validação + toast + estados).
- Testes: ~1h.
- Polish e ajustes finais: ~30min.

**Se a estimativa estourar muito (>15h), pare e reporte ao Rick**
em vez de continuar empurrando. Provavelmente sinaliza que algum
ponto do brief não cobre a realidade.

## Princípios pra essa task em particular

Como o escopo é grande:

1. **Faça as 3 telas em ordem**: Dashboard → Lista → Detalhe.
   Cada uma destrava padrões pra próxima (componentes, formatters,
   estados de loading/erro reusados).
2. **Não invente features além do brief.** Se sentir tentação de
   adicionar export CSV, search global, dark toggle, etc — **não**.
   Anota e reporta no fim.
3. **Commits granulares dentro da branch** mesmo sabendo que vai
   squashar. Ajuda a revisar o PR e a rollback parcial mental.
4. **Rode `npm run test:run` e `npm run typecheck` frequentemente**,
   não só no fim. Catch erros cedo.
5. **Se um shadcn add falhar ou trouxer dep estranha** (vimos isso
   em F2 com Geist + tw-animate-css), reporte mas siga — não
   re-arquiteta o brief.
