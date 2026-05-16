# Task M3 — Filtro multiselect de andaime_version

## ID
M3

## Trilha
Integração com mmb-logger (continuidade pós-M2).

## Status
🎯 pronto pra delegar

## Origem
Briefing do master, épico cross-repo `filtro-andaime-version`.
Issue GitHub: `x-force-42/mmb-cockpit#11`. Conteúdo canônico da
task = body da issue. Este arquivo é espelho local pra
`task-start.sh` resolver branch/worktree.

## Intenção

Adicionar controle de **multiselect** de tags do andaime nas
páginas `EpicosListPage` e `CiclosListPage`. Marcação de N tags
faz a UI chamar a API com `?andaime_version=X&andaime_version=Y`
e renderizar só os matching. Desmarcar tudo volta ao "sem filtro".

## Contrato com o backend (já acordado)

```
GET /api/epicos?andaime_version=v0.5.0&andaime_version=v0.6.0
GET /api/ciclos?andaime_version=v0.6.0
```

A querystring usa **a mesma key repetida**, não JSON array.
`URLSearchParams.append(key, value)` para cada elemento da lista.

## Escopo

### Dentro

- `src/types/api.ts` — adicionar `andaime_version?: string[]` em
  `EpicosListQuery` e `CiclosListQuery`.
- `src/api/client.ts` — garantir que `apiGet` (ou helper de
  serialização de querystring) trate `string[]` como múltiplos
  `.append` na mesma key (NÃO `JSON.stringify`, NÃO
  comma-separated).
- `src/lib/tags.ts` — **arquivo novo** com
  `export const TAGS_DISPONIVEIS: readonly string[] = [...]` +
  comentário explicando que precisa atualizar quando tag nova
  surgir.
- `src/features/epicos/pages/EpicosListPage.tsx` + componente
  filho de filtros — adicionar controle multiselect.
- `src/features/ciclos/pages/CiclosListPage.tsx` + idem.
- `src/api/mocks/handlers.ts` — replicar a lógica do filtro nas
  MSW handlers pra dev mode e testes funcionarem.
- Testes vitest cobrindo serialização + handler MSW + componente.

### Fora

- Backend (task separada em `mmb-logger`).
- Tag discovery dinâmica.
- Range semver-aware.
- Persistência do filtro em localStorage (bonus se trivial).
- Deep-link via URL (bonus se trivial).

## Critério de pronto

- [ ] Página `/epicos` tem componente multiselect com as 7 tags
      hardcoded em `TAGS_DISPONIVEIS`.
- [ ] Marcando 1 tag, lista mostra só épicos com aquela
      `andaime_version`.
- [ ] Marcando 2+, lista mostra union.
- [ ] Desmarcando tudo, lista volta a mostrar todos.
- [ ] Idem na página `/ciclos`.
- [ ] Filtro combina com outros filtros existentes (status, etc)
      via AND.
- [ ] Network tab mostra querystring no formato correto
      (`andaime_version=...&andaime_version=...`).
- [ ] `npm run typecheck` OK.
- [ ] `npm run build` OK.
- [ ] `npm run test:run` OK.
- [ ] `npm run lint` OK.

## Contexto técnico

Arquivos relevantes:

- `src/types/api.ts:96` — `EpicosListQuery` atual.
- `src/types/api.ts:135` — `CiclosListQuery` atual.
- `src/api/client.ts` — `apiGet` helper (verificar como serializa
  params).
- `src/features/epicos/pages/EpicosListPage.tsx:25` —
  `useState<EpicosListQuery>`.
- `src/features/ciclos/pages/CiclosListPage.tsx` (verificar nome
  exato).
- `src/api/mocks/handlers.ts:112` — handler de `/api/epicos`.
- `src/api/mocks/handlers.ts:159` — handler de `/api/ciclos`.

Briefing master: `.tooling/intents/2026-05-16-filtro-andaime-version/master-briefing.md`.

## Dependências

`requires: nenhum`. Backend (`mmb-logger/filtro-andaime-version`)
é independente — contrato já acordado, cockpit mocka via MSW.

## Conflito potencial com (outras tarefas)

Nenhum visível.
