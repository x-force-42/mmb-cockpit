# feat(M2): prepara Cockpit pro contrato do mmb-logger

> **Body desta task = body da sub-issue GitHub correspondente.**
> O atômico lê este arquivo como prompt direto de execução.
>
> Issue rastreadora: `gh issue view <N> --repo x-force-42/mmb-cockpit`
> Épico: `mmb-logger-destilacao` (master-briefing em
> `/MMB/.tooling/intents/2026-05-15-mmb-logger-destilacao/master-briefing.md`).

## Contexto

Épico maior: **destilação #1 — sistema de logs do andaime**. Em
paralelo, Rick está construindo manualmente o repo `/MMB/mmb-logger/`
— pacote Python + API HTTP (FastAPI) que vai expor endpoints sobre o
novo schema (épicos, ciclos, eventos).

**Hoje o Cockpit** consome a API do MMB original (`/api/runs`,
`/api/projects`, `/api/metrics/overview`) com MSW como mock. Quando
o `mmb-logger` nascer (M3 do épico), o Cockpit precisa apontar pra
lá. Esta task **prepara o Cockpit pro contrato novo, ainda usando
MSW** — quando `mmb-logger` ficar de pé, basta desligar MSW e trocar
a base URL.

## Intenção

Refatorar o Cockpit pra falar a língua nova (épicos, ciclos, estados,
abort tipado, eventos) **mantendo todo o stack atual** (TanStack
Query, MSW, shadcn, Tailwind, recharts, react-hook-form, zod,
react-router v7). Adicionar 1 tela nova (Lista de Épicos) e adaptar
as 3 existentes (Dashboard, Lista de Runs → Lista de Ciclos, Detalhe
de Run → Detalhe de Ciclo). Fixtures MSW reescritas no schema novo.
Edição dos 3 campos manuais (`merged_to_main`, `assertiveness_score`,
`review_note`) continua funcionando, agora em ciclos.

## Estado atual do Cockpit (referência rápida)

- ✅ F0 scaffold Vite/React/TS/Vitest
- ✅ F1 data layer (TanStack Query + MSW + cliente HTTP)
- ✅ F2 UI shell (Tailwind + shadcn + Layout/Header/Sidebar)
- ✅ M1 MVP completo: Dashboard / Lista de Runs / Detalhe de Run + edição
- Componentes shadcn instalados: button, card, dialog, input, label,
  select, separator, skeleton, sonner, table, textarea, tooltip, badge
- Deps de produto: react-hook-form, zod, @hookform/resolvers, recharts,
  react-router-dom v7
- Schema atual em `src/types/api.ts`: `Run`, `RunDetail`, `Project`,
  `MetricsOverview`, `TerminalPhase` (6 valores específicos do MMB)
- Rotas atuais: `/` (Dashboard), `/runs` (Lista), `/runs/:id` (Detalhe)
- Fixtures MSW em `src/api/mocks/fixtures/{runs,projects,metrics}.ts`
- Hooks em `src/api/queries/{runs,projects,metrics}.ts`

## Schema novo (TypeScript)

Reescreva `src/types/api.ts` substituindo o schema atual. **Não
manter compatibilidade com o schema antigo** — o Cockpit não vai
voltar a falar com o MMB original.

```typescript
/**
 * Tipos do contrato da API REST do mmb-logger.
 * Fonte autoritativa (em construção):
 *   /MMB/mmb-logger/docs/api.md (vai existir quando M1 do logger fechar)
 *
 * Por enquanto, este arquivo define o contrato; MSW implementa fixtures.
 */

// ─── épicos ────────────────────────────────────────────────────────────

export type EpicoStatus = "aberto" | "fechado";

export interface Epico {
  id: string;
  slug: string;
  started_at: string;        // ISO8601 UTC
  intencao: string;          // texto livre da intenção do Rick
  status: EpicoStatus;
  closed_at: string | null;
  // Agregados úteis pra lista:
  ciclos_total: number;
  ciclos_completos: number;
  ciclos_abortados: number;
}

export interface EpicoDetail extends Epico {
  // Lista de ciclos filhos ordenados por planner_invoked_at desc:
  ciclos: Ciclo[];
}

// ─── ciclos ────────────────────────────────────────────────────────────

export type CicloStatus =
  | "iniciado"   // master invocou planner; nada além disso ainda
  | "planejado"  // planner produziu briefing assertivo
  | "pr_aberto"  // atômico abriu PR — aguardando feedback do Rick
  | "completo"   // Rick deu feedback final no Cockpit
  | "abortado";  // qualquer ponto: heartbeat-loss, manual, self, master

export type AbortOrigin = "heartbeat" | "manual" | "self" | "master";

export type MergedToMain = 0 | 1 | null;
export type AssertivenessScore = 1 | 2 | 3 | 4 | 5 | null;

/** Item enxuto da listagem (`GET /api/ciclos`). */
export interface Ciclo {
  id: string;
  epico_id: string;
  project: string;                  // ex: 'mmb-core' | 'mmb-cockpit' | 'mmb-aquarium' | 'mmb-logger'
  planner_invoked_at: string;       // ISO8601 UTC
  status: CicloStatus;
  instruction: string;              // texto que o master mandou pro planner (truncado em listagem)
  pr_url: string | null;
  pr_number: number | null;
  closed_partial_at: string | null;
  closed_complete_at: string | null;
  merged_to_main: MergedToMain;
  assertiveness_score: AssertivenessScore;
  cost_usd: number | null;
  // Abort (null quando status !== 'abortado')
  abort_origin: AbortOrigin | null;
  abort_reason: string | null;
}

export interface CicloDetail extends Ciclo {
  briefing_md: string | null;       // briefing maduro produzido pelo planner
  review_note: string | null;
  abort_at: string | null;
  tokens_input: number | null;
  tokens_output: number | null;
  diff_added: number | null;
  diff_deleted: number | null;
  diff_files: number | null;
}

// ─── eventos do ciclo ──────────────────────────────────────────────────

export type EventoKind =
  | "state_change"
  | "msg_send"
  | "msg_receive"
  | "heartbeat_loss"
  | "atomic_spawn"
  | "atomic_deregister"
  | "pr_opened"
  | "journal_warn"
  | "journal_error"
  | "journal_critical";

export type EventoSeverity = "info" | "warn" | "error" | "critical";

export interface Evento {
  id: number;
  ciclo_id: string;
  ts: string;                       // ISO8601 UTC
  kind: EventoKind;
  severity: EventoSeverity | null;
  payload: Record<string, unknown>; // payload_json já parseado
}

// ─── listagens + filtros ───────────────────────────────────────────────

export interface EpicosListResponse {
  items: Epico[];
  total: number;
  limit: number;
  offset: number;
}

export interface EpicosListQuery {
  status?: EpicoStatus;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

export interface CiclosListResponse {
  items: Ciclo[];
  total: number;
  limit: number;
  offset: number;
}

export type CiclosListOrder =
  | "planner_invoked_at:asc"
  | "planner_invoked_at:desc"
  | "cost_usd:asc"
  | "cost_usd:desc";

export interface CiclosListQuery {
  epico?: string;             // filtra por epico_id ou slug
  project?: string;
  status?: CicloStatus;
  abort_origin?: AbortOrigin; // útil quando status=abortado
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
  order?: CiclosListOrder;
}

export interface CicloPatch {
  merged_to_main?: MergedToMain;
  assertiveness_score?: AssertivenessScore;
  review_note?: string | null;
}

// ─── projetos ──────────────────────────────────────────────────────────

export interface Projeto {
  id: string;
  slug: string;
  name: string;
  path: string;
  repo_url: string | null;
  created_at: string;
}

export interface ProjetosListResponse {
  items: Projeto[];
}

// ─── métricas ──────────────────────────────────────────────────────────

export interface DiaCusto {
  dia: string;       // YYYY-MM-DD
  usd: number;
}

export interface DiaCiclos {
  dia: string;
  n: number;
}

export type StatusBreakdown = Partial<Record<CicloStatus, number>>;
export type AbortBreakdown = Partial<Record<AbortOrigin, number>>;

export interface MetricasOverview {
  window_days: number;
  ciclos_total: number;
  epicos_total: number;
  custo_total_usd: number;
  tempo_medio_completo_s: number;     // tempo médio do iniciado → completo
  taxa_abort: number;                  // ciclos_abortados / ciclos_total
  taxa_merged: number;                 // merged_to_main=1 / ciclos completos
  custo_por_dia: DiaCusto[];
  ciclos_por_dia: DiaCiclos[];
  status_breakdown: StatusBreakdown;
  abort_breakdown: AbortBreakdown;
}
```

## Endpoints MSW (`src/api/mocks/handlers.ts`)

Substituir tudo. Endpoints a implementar:

| Endpoint | Resposta | Notas |
|---|---|---|
| `GET /api/epicos` | `EpicosListResponse` | filtros: status, from, to. Paginação. |
| `GET /api/epicos/:id` | `EpicoDetail` | inclui ciclos filhos |
| `GET /api/ciclos` | `CiclosListResponse` | filtros: epico, project, status, abort_origin, from, to. Order. |
| `GET /api/ciclos/:id` | `CicloDetail` | |
| `GET /api/ciclos/:id/eventos` | `{ items: Evento[] }` | ordem cronológica asc |
| `PATCH /api/ciclos/:id` | `CicloDetail` | aceita `CicloPatch`; valida domínios igual hoje |
| `GET /api/projetos` | `ProjetosListResponse` | |
| `GET /api/metricas/overview?days=N` | `MetricasOverview` | default 30 |

Validações 422 igual ao padrão atual (ex: `status` inválido,
`order` inválido, `merged_to_main` fora de `{0,1,null}`, etc).

## Fixtures (reescrever todas)

`src/api/mocks/fixtures/`:
- `epicos.ts` — 4-6 épicos: 2 abertos, 2-3 fechados, 1 com taxa de abort alta
- `ciclos.ts` — 15-25 ciclos distribuídos pelos épicos, cobrindo
  TODOS os 5 estados, com pelo menos 2 ciclos de cada `abort_origin`
- `eventos.ts` — eventos pra 3-4 ciclos (timeline rica) e vazio
  pra o resto
- `projetos.ts` — 4 projetos: mmb-core, mmb-cockpit, mmb-aquarium, mmb-logger
- `metricas.ts` — agregados consistentes com fixtures de ciclos

Apague `runs.ts` antigo.

**Realismo:** use `instruction` em pt-BR com texto realista de
intenções de tarefa (ex: "refatorar `pipeline.py` pra suportar timeout
customizado por task", "adicionar coluna `cost_usd` em ciclos com
default null", etc). Não deixe `"task de teste 1"` etc — testar UX
de truncamento em listas exige textos com tamanho variado.

## Hooks (`src/api/queries/`)

Renomear/criar:
- `runs.ts` → `ciclos.ts`: `useCiclos`, `useCiclo`, `usePatchCiclo`, `useEventosCiclo`
- `projects.ts` → `projetos.ts`: `useProjetos`
- `metrics.ts` → `metricas.ts`: `useMetricasOverview`
- **Novo** `epicos.ts`: `useEpicos`, `useEpico`

Manter padrão de testes existente em cada hook (mock de fetch via
MSW, smoke do shape esperado).

## Telas

### Rotas finais

```tsx
// src/App.tsx
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/epicos" element={<EpicosListPage />} />
    <Route path="/epicos/:id" element={<EpicoDetailPage />} />
    <Route path="/ciclos" element={<CiclosListPage />} />
    <Route path="/ciclos/:id" element={<CicloDetailPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route>
</Routes>
```

Sidebar (`NAV_ITEMS`):

```tsx
const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/epicos", label: "Épicos", end: false },
  { to: "/ciclos", label: "Ciclos", end: false },
] as const;
```

### 1. Dashboard (`/`) — adaptar

Usa `useMetricasOverview(window)`. KPI cards mudam:
- **Total ciclos** (`ciclos_total`)
- **Épicos** (`epicos_total`)
- **Custo total USD** (`custo_total_usd`)
- **Taxa de abort** (`taxa_abort`, percent) — substitui "taxa de pushback"

Charts:
- `CiclosPorDiaChart` — BarChart sobre `ciclos_por_dia`
- `CustoPorDiaChart` — LineChart sobre `custo_por_dia` (mantém)

Novos visualizadores:
- `StatusBreakdown` — lista com Badge colorido por status + contagem + barra de proporção (segue o pattern do `PhaseBreakdown` antigo)
- `AbortBreakdown` — só renderiza se houver aborts; mostra origem (heartbeat/manual/self/master) com contagens

Estados: loading (Skeleton), erro (Card retry), vazio (Card "sem ciclos ainda"), sucesso.

### 2. Lista de Épicos (`/epicos`) — **nova**

`features/epicos/pages/EpicosListPage.tsx`:
- Consome `useEpicos({ status, from, to })`
- Tabela com colunas: **Slug**, **Intenção** (truncada), **Status** (Badge), **Iniciado em**, **Ciclos** (`ciclos_completos / ciclos_total`, com sub-badge vermelho se `ciclos_abortados > 0`), **Ação** (linha clicável → `/epicos/:id`)
- Filtros: status (aberto/fechado/todos), from, to
- Sem ordenação por enquanto (server entrega por `started_at:desc`)
- Paginação igual à de ciclos

### 3. Detalhe de Épico (`/epicos/:id`) — **nova**

`features/epicos/pages/EpicoDetailPage.tsx`:
- Consome `useEpico(id)`
- Header: slug + status badge + datas
- Bloco "Intenção" (texto da intenção, parágrafo)
- Subtítulo "Ciclos deste épico"
- Reusa `<CiclosTable>` (a mesma da tela de ciclos) passando os
  ciclos filhos do `EpicoDetail.ciclos` — **não refetcha**, vem do
  payload. Sem filtros nesta tela; é visão completa.

### 4. Lista de Ciclos (`/ciclos`) — adaptar de Lista de Runs

`features/ciclos/pages/CiclosListPage.tsx`:
- Consome `useCiclos({ epico, project, status, abort_origin, from, to, order, limit, offset })`
- Filtros: épico (select alimentado por `useEpicos({ status: undefined })`),
  projeto, status (5 valores + "Todos"), abort_origin (só aparece se
  status=abortado ou "Todos"), date range, ordenação por
  `planner_invoked_at`
- Tabela colunas:
  - **Data** (planner_invoked_at, ordenável)
  - **Épico** (slug do épico-pai, clicável → `/epicos/:id`)
  - **Projeto**
  - **Instrução** (truncada ~60 chars + tooltip)
  - **Status** (`<CicloStatusBadge />`)
  - **PR** (badge "#42" linkando pra `pr_url`, ou "—")
  - **Custo** (`formatUSD(cost_usd)`)
  - **Review** (2 indicadores compactos: merged + score, igual à tabela de runs hoje)
- Linha clicável → `/ciclos/:id`
- Paginação manual como hoje

### 5. Detalhe de Ciclo (`/ciclos/:id`) — adaptar de Detalhe de Run

`features/ciclos/pages/CicloDetailPage.tsx`:

Layout (grid 2 col desktop, stack mobile):

```
┌──────────────────────────────────────────────────┐
│ Breadcrumb: Ciclos › <epico.slug> › <id..>       │
├──────────────────────────┬───────────────────────┤
│ CicloMetadata             │ CicloReviewForm       │
│  (Card com: instrução,    │  (form com:           │
│   estado, project,        │   merged_to_main,     │
│   datas, custo, tokens,   │   score 1-5,          │
│   diff stats, PR link)    │   review_note)        │
├──────────────────────────┴───────────────────────┤
│ [SE status='abortado']                            │
│ AbortCard (destacado, com origem + razão)         │
├──────────────────────────────────────────────────┤
│ Briefing (Card com markdown rendered do          │
│   briefing_md — usa biblioteca ou pre simples)   │
├──────────────────────────────────────────────────┤
│ EventosTimeline (lista cronológica de eventos)   │
└──────────────────────────────────────────────────┘
```

Componentes novos:
- **`CicloMetadata.tsx`**: pares label/value
- **`CicloReviewForm.tsx`**: igual `RunReviewForm` mas em ciclo; só
  ativo quando `status === 'pr_aberto'` ou `status === 'completo'`
  (se abortado, form fica desabilitado com mensagem "ciclo abortado,
  sem review aplicável")
- **`AbortCard.tsx`**: card vermelho-suave, ícone Lucide por origem,
  label legível, razão como parágrafo
- **`EventosTimeline.tsx`**: lista vertical, cada item: ts formatado +
  ícone do kind + payload renderizado de forma legível. Severity
  colorada (cinza/amarelo/vermelho/roxo). Vazio: "sem eventos
  registrados". Reusa `useEventosCiclo(id)`.
- **`CicloStatusBadge.tsx`**: igual `PhaseBadge` antigo, mapeia status
  → variant:
  - `iniciado` → outline (cinza)
  - `planejado` → secondary (azul-suave)
  - `pr_aberto` → default (amarelo/laranja — aguardando)
  - `completo` → default (verde)
  - `abortado` → destructive (vermelho)

### Markdown rendering do briefing

`briefing_md` é markdown produzido pelo planner. Opções:
1. `<pre>` simples — preserva fidelidade, sem polish
2. Biblioteca: `react-markdown` + `remark-gfm` (~50kb gzipped extra)

**Decisão fechada:** começar com `<pre>` simples (opção 1). Markdown
rendering vira task futura se Rick pedir. Justificativa: bundle size +
adicionar deps em primeiro voo é fricção desnecessária.

## Helpers de formatação (`src/lib/format.ts`)

Já existe. Pode precisar adicionar:
- `formatCicloStatus(status: CicloStatus): string` — label em pt-BR
- `formatAbortOrigin(origin: AbortOrigin): string` — label em pt-BR
- `formatEventoKind(kind: EventoKind): string` — label em pt-BR

Mantém `formatUSD`, `formatDuration`, `formatDateTime`, `formatDate`,
`formatPercent` como estão.

## Decisões fechadas (NÃO renegociar)

1. **Substituir, não duplicar.** Schema antigo (`Run`, `RunDetail`,
   `TerminalPhase`) sai completamente. Não há modo legacy.
2. **MSW continua até M3.** Não tentar conectar à API real do logger
   nesta task — o logger ainda não existe.
3. **`<pre>` simples pro briefing markdown.** Sem biblioteca de
   markdown nesta task.
4. **Stack mantida.** Não troque biblioteca, não renomeie pasta `features/`,
   não mude convenções de imports.
5. **pt-BR** em strings UX, labels de UI, mensagens de erro.
6. **Tokens shadcn** pra cores; status com cores Tailwind explícitas
   nas badges quando variants default não comportam (igual feito em M1).
7. **Edição só ativa em ciclos `pr_aberto` ou `completo`.** Outros
   estados: form desabilitado com hint.
8. **Sem novas deps.** Trabalhe com o que está no package.json.
9. **Rota `/runs/*` some.** Sem redirect — usuário único é Rick, não
   há terceiros com bookmarks.
10. **`status_breakdown` no Dashboard renderiza todos os 5 estados**
    mesmo zerados (visibilidade > minimalismo).

## Anti-escopo (fora)

- ❌ Conectar à API real do mmb-logger (vira M3 do épico)
- ❌ Auth / login / multi-user
- ❌ Dark mode toggle
- ❌ Export CSV
- ❌ Markdown rendering com biblioteca
- ❌ WebSocket / real-time
- ❌ Filtros server-side avançados além dos listados acima
- ❌ Search livre de texto
- ❌ Mexer em `mmb-logger/` (Rick está fazendo manual)
- ❌ Criar página de gestão de projetos
- ❌ Aquarium integration

## Critério de pronto

- [ ] `npm run typecheck` zero erros
- [ ] `npm run lint` clean
- [ ] `npm run test:run` verde — testes existentes adaptados + smoke das telas novas
- [ ] `npm run build` sucesso. Bundle <600kb gzipped
- [ ] `npm run dev`:
  - [ ] `/` renderiza Dashboard novo (4 KPIs adaptados, 2 charts, status_breakdown, abort_breakdown se houver)
  - [ ] `/epicos` lista épicos, filtros funcionam, clique navega
  - [ ] `/epicos/:id` mostra header + intenção + tabela de ciclos filhos
  - [ ] `/ciclos` lista ciclos, todos os filtros funcionam, ordenação por data, paginação, linha clica
  - [ ] `/ciclos/:id` (estado=`pr_aberto` ou `completo`) mostra metadata + form review ativo + briefing + eventos
  - [ ] `/ciclos/:id` (estado=`abortado`) mostra AbortCard destacado + form desabilitado
  - [ ] `/ciclos/:id` (estado=`iniciado` ou `planejado`) mostra metadata sem PR ainda + form desabilitado
  - [ ] PATCH em `/ciclos/:id` via form funciona (toast sucesso, re-fetch)
  - [ ] `/runs/*` → 404 (rota some) ou Navigate pra `/ciclos`
- [ ] Fixtures realistas com pt-BR; todos os 5 estados representados; todos os 4 abort_origin com pelo menos 1 ciclo
- [ ] Commits granulares na branch (lembre: master squasha)

## Princípios

- **Primeiro voo do método v3.** Cadência baixa, briefings densos,
  questions só em emergência real.
- **Rick está em paralelo** construindo o logger e quer foco. Não
  pingar trivialidades.
- **Substituibilidade.** O atômico (worker stateless) pode morrer
  e ser ressuscitado — estado vive em GitHub (issue, PR, commits).
