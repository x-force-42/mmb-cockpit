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

**Modo velocidade: MVP empacotado.** F0 + F1 + F2 mergeados. F2.1
(hotfixes) + F3 (Lista) + F4 (Detalhe) + F5 (Dashboard) **foram
consolidados na task M1 — cockpit MVP completo**, agora ativa.
Em vez de 4 tasks sequenciais com overhead de orquestração,
um único agente entrega o MVP ponta-a-ponta. Decisões adicionais
fechadas no brief: react-hook-form + zod (forms), recharts (charts),
sonner (toast).

```
PASSADO                                  PRESENTE          FUTURO
●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●━━━━ ━ ━ ━ →
F0 scaffold ✅                           M1 cockpit MVP 🎯
F1 data layer ✅                          (3 telas + hotfixes)
F2 UI + shell ✅                                            v2 (a discutir)
```

## Roadmap concreto

| ID | Foco | Módulos que toca | Depende de |
|---|---|---|---|
| F0 ✅ | Scaffold base | repo todo | — |
| F1 ✅ | Camada de dados | `src/api/`, `src/types/` | F0 |
| F2 ✅ | UI tooling + shell | `src/components/layout/`, `src/components/ui/`, `src/index.css` | F0 |
| **M1** 🎯 | **Cockpit MVP completo** (3 telas + hotfixes) | `src/features/{runs,dashboard}/`, `vite.config.ts`, `scripts/task-end.sh`, etc. | F1 + F2 |
| ~~F2.1, F3, F4, F5~~ | ~~granular~~ | 🔀 absorvido por M1 | — |

## Pós-MVP (a discutir após M1 mergear)

Quando o MVP estiver em master, próximas frentes possíveis:

- **Conectar à API real do MMB** quando E1 mergear no MMB
  (até lá, dev roda só contra MSW).
- **Refinos de UX** descobertos no uso real.
- **Telas v2**: catálogo de projetos, detalhe de projeto,
  comparativo de modelos (depende B1/B2/B3 do MMB).
- **Operação ao vivo** (WebSocket) — eventual sobreposição com
  aquário.

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
