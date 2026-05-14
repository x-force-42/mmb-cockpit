# mmb-cockpit — Plano

Mapa vivo. Visão + decomposição + estado atual.

## Visão

Cockpit web pra inspeção retrospectiva do MMB. SPA Vite/React/TS
consumindo a API REST do MMB (`localhost:8765`). Foco do MVP: 3
telas que entregam **governança + post-mortem** imediatamente,
deixando "operação ao vivo" pra v2.

## MVP — 3 telas (definidas em discovery no MMB)

1. **Dashboard de governança** — agregados de custo, runs por dia,
   taxa de pushback, tempo médio. Cards e gráficos.
2. **Lista de runs** — tabela paginada com filtros (projeto, fase,
   datas) e ordenação.
3. **Detalhe de run** — view completa do post-mortem + form pra
   editar `merged_to_main`, `assertiveness_score`, `review_note`.

## Onde estamos

**Infra entregue, telas próximas.** F0 + F1 + F2 mergeados em
master. Stack toda decidida (TanStack Query + MSW + Tailwind v4 +
shadcn/ui preset radix-nova + feature folders). F2.1 (hotfixes
pequenos pós-F2) é o último passo antes das telas. Depois disso,
F3 (Lista) começa.

```
PASSADO                         PRESENTE         FUTURO
●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●━━━━ ━ ━ ━ ━ →
F0 scaffold ✅                  F2.1 hotfixes 🎯
F1 data layer ✅                                F3 Lista
F2 UI + shell ✅                                F4 Detalhe
                                                F5 Dashboard
```

## Roadmap concreto

| ID | Foco | Módulos que toca | Depende de |
|---|---|---|---|
| F0 ✅ | Scaffold base | repo todo | — |
| F1 ✅ | Camada de dados | `src/api/`, `src/types/` | F0 |
| F2 ✅ | UI tooling + shell | `src/components/layout/`, `src/components/ui/`, `src/index.css` | F0 |
| F2.1 🎯 | Hotfixes (vitest, shadcn dep, task-end) | `vite.config.ts`, `package.json`, `scripts/task-end.sh` | F1 + F2 |
| F3 | Tela: Lista de runs | `src/features/runs/` | F2.1 |
| F4 | Tela: Detalhe + edição | `src/features/runs/` (compartilha com F3) | F3 (padrões) |
| F5 | Tela: Dashboard | `src/features/dashboard/` | F2.1 (charts: decide na hora) |

## Convenção de modularização

Adotada no discovery 2026-05-14:

```
src/
├── features/
│   ├── runs/          (pages + hooks + components específicos)
│   └── dashboard/     (idem)
├── components/
│   ├── layout/        (Header, Sidebar, Layout — F2)
│   └── ui/            (shadcn — F2)
├── api/               (client, queryClient, mocks — F1)
├── types/             (contrato compartilhado — F1)
└── lib/               (utils, helpers — shadcn coloca utils.ts aqui)
```

`features/` permite que duas telas paralelizem sem cruzar paths.

## Trilhas (a definir)

Trilhas só fazem sentido quando há concorrência real entre frentes.
Até aqui é frente única (frontend do MVP), tasks numeradas
sequencialmente F0-F5. Quando o MVP fechar e aparecerem v2 features
(operação ao vivo, multi-projeto B1 ressonando, etc.), o orquestrador
introduz trilhas.

## Dependências do ecossistema

- **API do MMB**: contrato definido em
  `mr-meeseeks-box/docs/tasks/E1-api-cockpit.md` seção "Contrato dos
  5 endpoints". Mudanças no contrato exigem coordenação via task no
  MMB.
- **Aquário**: vizinho independente. Mesma fonte de dados, mas
  cockpit não consome dele.
