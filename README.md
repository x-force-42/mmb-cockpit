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

Pré-requisito: API do MMB no ar (`scripts/api.sh` no repo MMB,
porta 8765 default).

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

## Status

Em **bootstrap**. Scaffold ainda não criado — primeira task
(F0) cuida disso.

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
