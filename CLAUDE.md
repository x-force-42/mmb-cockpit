# CLAUDE.md — mmb-cockpit

> O `mmb-cockpit` é um **target interno** do MMB (runtime de
> orquestração agnóstico a target). Exerce papel de **governança
> retrospectiva**: SPA Vite + React + TS que consome a API REST do
> `mmb-logger` em `localhost:8765`.

Esta sessão Claude pode estar operando em **3 modos**. Identifique o
seu antes de qualquer ação.

## Modo 1 — Atômico spawnado pelo andaime

Você nasceu via `/MMB/.tooling/bin/spawn-atomic.sh`. Está numa
worktree `.worktrees/<id>-<slug>/`, branch `task/<id>-<slug>`, pane
tmux com auto-kill em 8s pós-PR. Brief é a sub-issue do GitHub.

→ **Leia:** [`/MMB/.tooling/profiles/atomic-agent.md`](../.tooling/profiles/atomic-agent.md) (autoritativo)
→ **Brief:** `gh issue view <N> --repo x-force-42/mmb-cockpit`
→ **PR:** abre via `open-pr.sh`; **nunca mergeia** (guardrail A10)

Detecção rápida: variável `$MMB_AGENT_ID` está exportada no env
(injetada por `spawn-atomic.sh`).

## Modo 2 — Worker stateless do andaime

Você foi spawnado pelo `commd` ao chegar mensagem em
`/MMB/.tooling/inbox/cockpit/`. Vida curta: processa uma mensagem,
escreve 2–5 linhas via stdout, morre. Sem worktree, CWD é a raiz do
cockpit.

→ **Leia:** [`/MMB/.tooling/profiles/project-orchestrator.md`](../.tooling/profiles/project-orchestrator.md) (autoritativo)
→ **Mensagem:** path absoluto passado como `$2` do `worker.sh`
→ **Materialização de sub-issue:** [`/MMB/.tooling/bin/create-task-issue.sh`](../.tooling/bin/create-task-issue.sh)
→ **Spawn atômico:** [`/MMB/.tooling/bin/spawn-atomic.sh`](../.tooling/bin/spawn-atomic.sh)

Detecção rápida: invocado por `worker.sh cockpit <path>`; CWD é
`/MMB/mmb-cockpit/`; sem `MMB_AGENT_ID`.

## Modo 3 — Sessão manual

Rick rodou `claude` direto neste repo, fora do andaime — modo dev
tradicional ou operação local via `scripts/task-start.sh <id>`. Este
protocolo é **independente do andaime** (foi importado do
`mr-meeseeks-box` antes do andaime existir) e segue válido para
trabalho manual sem orquestração cross-repo.

→ **Orquestrador local** (sessão na raiz, conversando com Rick): [`docs/ORQUESTRADOR.md`](docs/ORQUESTRADOR.md)
→ **Agente delegado em worktree**: [`docs/tasks/PROTOCOLO.md`](docs/tasks/PROTOCOLO.md) + brief específico em [`docs/tasks/<id>-<slug>.md`](docs/tasks/)
→ **Índice de tasks**: [`docs/tasks/INDEX.md`](docs/tasks/INDEX.md)

Detecção rápida: você não foi spawnado pelo andaime (sem
`MMB_AGENT_ID`, sem mensagem como parâmetro); Rick está
conversando contigo aqui.

## Stack confirmada

- **Vite + React + TypeScript + Vitest**
- **Tailwind + shadcn/ui** — UI shell
- **TanStack Query + MSW** — data layer + mocks
- **react-router** — roteamento
- API consumida: `mmb-logger` em `localhost:8765`

Comentários e docs voltados pro Rick em pt-BR; termos técnicos de UI
em inglês quando convencionais (Run, Project, Metrics).

## Quando NÃO seguir nenhum dos 3 protocolos

- Pergunta exploratória do Rick ("e se a gente..."). Responda direto.
- Debug isolado de bug específico — debug, não vira task.
- Rick disse "rapidinho, esquece o protocolo". Obedeça.
