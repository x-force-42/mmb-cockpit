# Tasks abertas — mmb-cockpit

Índice canônico de tasks. Toda task que se quer trabalhar **precisa**
estar aqui antes — é o registro autoritativo.

## Como agente: use isto

Você está em sessão recém-iniciada e o Rick ainda não disse o que
quer? Siga:

1. Cheque o pré-flight em `docs/tasks/PROTOCOLO.md`.
2. Apresente a lista de tasks 🎯 abaixo via `AskUserQuestion`.
3. Quando ele escolher, leia o brief correspondente.
4. Confirme decisões em aberto se houver.
5. Trabalhe.

## Status atual

Legenda: ✅ entregue · 🎯 pronto pra delegar · ⚡ paraleliza · 🔒 bloqueado

| ID | Título | Status | Brief |
|---|---|---|---|
| **F0** | Scaffold do projeto Vite+React+TS+Vitest | ✅ entregue | [`F0-scaffold.md`](F0-scaffold.md) |
| **F1** | Camada de dados — API client + TanStack Query + MSW | ✅ entregue | [`F1-data-layer.md`](F1-data-layer.md) |
| **F2** | UI tooling + layout shell — Tailwind + shadcn + chrome | ✅ entregue | [`F2-ui-shell.md`](F2-ui-shell.md) |
| **F2.1** | Hotfixes pós-F2 — vitest scope, shadcn dep, task-end squash | 🎯 pronto | [`F2.1-hotfixes-pos-f2.md`](F2.1-hotfixes-pos-f2.md) |
| F3 | Tela: Lista de runs | 🔒 espera F2.1 | (a criar) |
| F4 | Tela: Detalhe de run + edição | 🔒 espera F1 + F2 + F3 (padrões) | (a criar) |
| F5 | Tela: Dashboard de governança | 🔒 espera F1 + F2 + decisão de charts | (a criar) |

## Matriz de paralelismo

Tasks 🎯 ⚡ podem rodar em worktrees simultâneas se a matriz abaixo
permitir. Cada célula explica conflito + resolução.

Nenhum par paralelo ativo no momento — F2.1 é serial pequeno antes
de F3.

### F1 × F2 — histórico (ambas ✅ entregues)

| Arquivo | F1 mexe | F2 mexe | Conflito? |
|---|---|---|---|
| `src/api/`, `src/types/` | cria | — | nenhum |
| `src/components/layout/`, `src/components/ui/` | — | cria | nenhum |
| `src/lib/utils.ts` (shadcn) | — | cria | nenhum |
| `src/index.css` | — | cria | nenhum |
| `src/main.tsx` | + `QueryClientProvider`, MSW startup | + `import "./index.css"` | linhas diferentes, merge trivial |
| `src/App.tsx` | — | envolve `<Routes>` em `<Layout>` | nenhum |
| `package.json` | + deps de data | + deps de UI | merge trivial |
| `package-lock.json` | regenera | regenera | **2º a mergear: rebase + `rm package-lock.json && npm install` + commit do lock** |
| `tsconfig.app.json` | — | + `paths` pra `@/*` | nenhum |
| `vite.config.ts` | — | + plugin Tailwind + alias | nenhum |
| `src/setupTests.ts` | + setup MSW server | (não toca esperado) | nenhum esperado |
| `README.md` | + seção env vars | + seção styling | merge trivial (seções diferentes) |

**Regra para o 2º a mergear**: rebase + regenerar lockfile + commit
`chore: regenera lockfile pós-merge F<x>`.

## Como criar uma task nova

1. Adicione entrada na tabela acima.
2. Crie o brief em `docs/tasks/<id>-<slug>.md` seguindo o esqueleto
   abaixo.
3. Atualize `docs/arvore.md` se aplicável.
4. Atualize a matriz se a task tocar arquivos compartilhados com
   outras 🎯 ⚡.

### Esqueleto de brief

```
# Task <ID> — <título curto>

## ID
## Trilha (opcional)
## Status
## Intenção
## Escopo (dentro / fora)
## Critério de pronto
## Contexto técnico (arquivos relevantes, ponteiros)
## Implementação sugerida (hints; agente decide detalhes)
## Testes a adicionar
## Decisões em aberto
## Dependências (bloqueia / bloqueado por)
## Conflito potencial com (outras tasks)
## Estimativa
```
