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

| ID | Título | Status | Brief |
|---|---|---|---|
| **F0** | Scaffold do projeto Vite+React+TS+Vitest | 🎯 pronto | [`F0-scaffold.md`](F0-scaffold.md) |
| F1+ | Tasks subsequentes (a definir) | 🔒 espera F0 mergear + discovery do orquestrador | (a criar) |

## Matriz de paralelismo

Tabela vazia até F0 mergear. F0 é base — toca a estrutura raiz do
repo (package.json, vite.config, tsconfig, etc) e não pode rodar em
paralelo com nada porque ainda não há nada.

Depois de F0, o orquestrador discute com Rick o próximo lote e
constroi a matriz.

## Como criar uma task nova

1. Adicione entrada na tabela acima.
2. Crie o brief em `docs/tasks/<id>-<slug>.md` seguindo o esqueleto
   abaixo.
3. Atualize `docs/arvore.md` se aplicável.
4. Atualize a matriz se a task tocar arquivos compartilhados.

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
