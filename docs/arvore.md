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

**Bootstrap.** Repo recém-criado, sem scaffold ainda. Próxima task
é F0 (criar a base Vite+React+TS+Vitest). Depois disso, o
orquestrador discute com Rick o próximo lote e quebra em tasks
paralelizáveis.

```
PASSADO          PRESENTE         FUTURO
                   ●━━━━ ━ ━ ━ ━ ━ →
                   ↑
              repo criado
              scaffold pendente (F0)
```

## Trilhas (a definir)

Trilhas só fazem sentido quando há concorrência real entre frentes.
Até lá, fica plano: tasks numeradas sequencialmente (F0, F1, F2...).
O orquestrador introduz trilhas quando ficar útil.

## Dependências do ecossistema

- **API do MMB**: contrato definido em
  `mr-meeseeks-box/docs/tasks/E1-api-cockpit.md` seção "Contrato dos
  5 endpoints". Mudanças no contrato exigem coordenação via task no
  MMB.
- **Aquário**: vizinho independente. Mesma fonte de dados, mas
  cockpit não consome dele.
