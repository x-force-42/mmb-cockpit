# CLAUDE.md — mmb-cockpit

Guia pra sessões Claude que operam neste repo.

## O que é este projeto

**mmb-cockpit** é a interface visual do Cockpit de Operações do
[Mr. Meeseeks Box](https://github.com/eliezer-cardoso/mr-meeseeks-box).
SPA Vite + React + TypeScript + Vitest, consumindo a API REST
exposta pelo MMB em `localhost:8765`.

A base inteira (strings, comentários, docs voltados pro Rick)
está em **português brasileiro**. Componentes de UI usam termos
em inglês quando são técnicos (Run, Project, Metrics) e pt-BR
quando são da fala — mantém a coerência com o ecossistema MMB
+ Rick & Morty (Garagem, Meeseeks).

## Onde mora o resto do ecossistema

| Repo | Path local | Papel |
|---|---|---|
| `mr-meeseeks-box` | `~/llab/mr-meeseeks-box` | Bot Discord + Garagem + Meeseeks + API |
| `mmb-cockpit` | `~/llab/mmb-cockpit` (este) | UI de inspeção retrospectiva |
| `mmb-fixture` | `~/llab/mmb-fixture` | Projeto-alvo dos testes E2E do MMB |

## Camada agêntica — onde ler antes de operar

Este projeto opera com workflow estruturado de orquestrador +
agentes delegados em worktrees paralelas. Dependendo do seu papel
nesta sessão, leia o doc certo:

- **Você é uma sessão Claude na raiz do mmb-cockpit** (orquestrador),
  e o Rick está conversando contigo sobre planejar, discutir,
  delegar, revisar entregas, atualizar docs? → leia
  [`docs/ORQUESTRADOR.md`](docs/ORQUESTRADOR.md).
- **Você é uma sessão Claude em uma worktree** (agente delegado),
  iniciada via `scripts/task-start.sh <id>`? → leia
  [`docs/tasks/PROTOCOLO.md`](docs/tasks/PROTOCOLO.md) primeiro,
  depois o brief da sua task em `docs/tasks/<id>-<slug>.md`.

## Operação como agente de task (bootstrap)

Se você é uma sessão Claude recém-iniciada neste repo e o Rick
ainda não te disse o que fazer, **siga este protocolo antes de
qualquer outra coisa**:

1. **Verifique se está numa worktree de task, não na raiz do repo.**
   Rode `git rev-parse --show-toplevel` e `git branch --show-current`.
   - Se você está na raiz do mmb-cockpit (`/home/eliezer/llab/mmb-cockpit`)
     e na branch `master`: avise o Rick e ofereça rodar
     `scripts/task-start.sh <id>` pra criar a worktree antes de começar.
   - Se você está numa worktree (`.../.worktrees/<id>-<slug>`) e na
     branch `task/<id>-<slug>`: ok, prossiga.

2. **Liste as tasks abertas**. Leia `docs/tasks/INDEX.md` — é o
   registro canônico. Identifique as marcadas com 🎯 (prontas pra
   delegar) e, se já está numa worktree, qual delas casa com o slug
   da branch atual.

3. **Pergunte ao Rick** via `AskUserQuestion` qual task ele quer
   que você atue (ou se prefere uma conversa exploratória sem
   entrar em task). Se já está numa worktree, sugira como primeira
   opção a task da branch atual.

4. **Quando ele escolher, leia o brief específico**
   (`docs/tasks/<id>-<slug>.md`). Trate o brief como autoritativo.

5. **Antes de qualquer edit**, releia `docs/tasks/PROTOCOLO.md`,
   especialmente o pré-flight de 4 invariantes.

6. **Confirme decisões em aberto** do brief com o Rick antes de
   implementar. Não chute.

7. **Trabalhe**. Commits pequenos, mensagens descritivas, hooks
   nunca pulados, `master` nunca recebe push direto. Você abre PR
   — só o Rick mergeia.

8. **Ao terminar**, relate em formato curto: o que foi feito, o que
   ficou aberto, decisões tomadas no caminho.

Se nada disso se aplica (Rick está fazendo pergunta exploratória,
debug, ou trabalho fora de uma task formal), apenas responda o que
foi perguntado.

## Convenções específicas do cockpit

(Vão sendo preenchidas conforme o orquestrador alinhar com Rick.
Hoje estão em aberto — F0 e tasks subsequentes vão decidir e
codificar:)

- Stack: Vite + React + TypeScript + Vitest (núcleo confirmado).
- Roteamento: a decidir (react-router provável).
- Estilo: a decidir (Tailwind / CSS modules / outro).
- Data fetching: a decidir (TanStack Query / SWR / fetch puro).
- Gráficos: a decidir (recharts / visx / nivo).
- Linter/formatter: a decidir (ESLint+Prettier / Biome).
