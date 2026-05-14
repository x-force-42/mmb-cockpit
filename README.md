# mmb-cockpit

Cockpit de Operações do **Mr. Meeseeks Box** — interface visual pra
inspeção retrospectiva de runs, projetos, métricas de governança e
edição de campos de review.

Consome a **API REST** exposta pelo MMB (`api/` no repo
`~/llab/mr-meeseeks-box`). É um SPA puro — sem backend próprio.

## O que é

Aplicação web local. Vite + React + TypeScript + Vitest. Roda em
`http://localhost:5173` (Vite default), consome
`http://localhost:8765` (default da API do MMB).

Foco do MVP (decidido no discovery `mr-meeseeks-box/docs/tasks/E0-discovery-cockpit.md`):

- **Dashboard de governança** — agregados (custo/dia, runs/dia,
  taxa de pushback, tempo médio).
- **Lista de runs** com filtros (projeto, fase terminal, período)
  e ordenação.
- **Detalhe de run** com edição dos 3 campos manuais
  (`merged_to_main`, `assertiveness_score`, `review_note`).

## Como rodar

```bash
# Setup uma vez:
npm install

# Dev:
npm run dev          # sobe Vite em :5173

# Testes:
npm test             # Vitest watch
npm run test:run     # Vitest single-shot

# Build:
npm run build
```

Em dev o MSW está **ligado por padrão** (via `.env.development`).
Você não precisa da API do MMB rodando localmente — as fixtures
em `src/api/mocks/fixtures/` cobrem os 5 endpoints.

### Variáveis de ambiente

| Variável | Default (dev) | O que faz |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8765` | Onde o client HTTP aponta. |
| `VITE_ENABLE_MSW` | `true` | Se `true`, intercepta `/api/*` no browser. |

Pra apontar pro MMB real (sem mock), crie `.env.local` com:

```
VITE_ENABLE_MSW=false
VITE_API_BASE_URL=http://localhost:8765
```

`.env.local` é gitignored e sobrescreve o `.env.development`.

Pra testes (Vitest), o MSW roda em modo Node automaticamente via
`src/setupTests.ts` — independente das variáveis acima.

## Status

**Infra em paralelo.** F0 (scaffold) entregue. Próximo lote: F1
(camada de dados — TanStack Query + MSW) e F2 (UI tooling + layout
shell — Tailwind + shadcn) paralelizáveis. Telas (F3-F5) começam
quando ambos mergearem. Ver `docs/arvore.md` pro roadmap completo
e `docs/tasks/INDEX.md` pras tasks abertas.

## Styling

- **Tailwind v4** via plugin `@tailwindcss/vite`. Tokens e variáveis
  CSS ficam em `src/index.css` (escritos pelo shadcn init).
- **shadcn/ui** (preset Nova, base neutra) pra primitivos. Alias
  `@/*` resolve `src/*` (configurado em `tsconfig.json` e
  `vite.config.ts`).
- Componentes base já instalados: `button`, `card`, `skeleton`,
  `separator` em `src/components/ui/`.
- Pra adicionar mais: `npx shadcn@latest add <componente>`.

## Operação como agente

Este repo segue o mesmo workflow do MMB: orquestrador em master,
agentes delegados em worktrees, briefs autoritativos.

- **Você é o orquestrador**? Leia `docs/ORQUESTRADOR.md`.
- **Você é um agente delegado em uma worktree**? Leia
  `docs/tasks/PROTOCOLO.md` + o brief da sua task.

## Relação com o MMB

Cockpit é vizinho do MMB e do aquário (todos consumindo o mesmo
SQLite via caminhos diferentes). Cockpit **não** tem dependência
de código com o MMB — só do contrato REST. Evolução independente.
