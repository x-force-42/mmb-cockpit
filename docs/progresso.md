# Progresso — mmb-cockpit

Log enxuto de marcos. Atualizar a cada milestone, **não** a cada commit.
Mais recente no topo.

---

## 2026-05-14 — F0 entregue + discovery de stack fechado

Scaffold inicial mergeado (commits `4239e93`, `9b329a0`, `9ddfe7c`).
Resultado: Vite 6 + React 19 + TS 6 + Vitest 3 + Biome 2 +
react-router 7 rodando. Estrutura `src/{pages,components,api,types}`
criada. Teste de smoke do Hello passa. Build 231kb (74kb gzip).

Veredito da entrega: critérios de pronto 8/8 atingidos. Divergências
menores anotadas pra rodadas futuras:
- Agente entregou react-router v7 em vez de v6 — v7 é o stable atual
  (fusão com Remix). Briefs futuros: fixar versão exata OU deixar
  livre, nunca "vX (current stable)".
- README ficou stale "scaffold ainda não criado" — atualizado nesta
  rodada de docs do orquestrador.
- Pequenos: typo pt-BR no teste (`o saudação`), `globals: true` no
  vitest config redundante com imports explícitos, `erasableSyntaxOnly`
  no tsconfig veio "de graça" e pode dar fricção se enums tradicionais
  forem precisos depois. Itens registrados como débito pra F1+ corrigir
  oportunisticamente.

Discovery de stack (rodadas 2 e 3 com Rick, fechado nesta data):

- **Data fetching**: TanStack Query (cache, mutations, devtools).
- **Styling**: Tailwind v4 (velocidade com IA, UI densa, build pequeno).
- **Components**: shadcn/ui (cópia via CLI, Radix por baixo, sem dep).
- **API mocking**: MSW v2 com fixtures JSON (dev sem MMB + testes
  determinísticos).
- **Ordem das telas**: Lista → Detalhe → Dashboard (valor de
  post-mortem cedo).
- **Layout shell**: task própria (F2).
- **Arquitetura modular**: `src/features/<nome>/` (ilhas, permite
  paralelismo real entre telas).
- **Forms**: react-hook-form + zod (recomendação prévia, fecha em F4).
- **Charts**: recharts vs Tremor (fecha em F5).

Próximo passo: rodar F1 e F2 em paralelo. Briefs `F1-data-layer.md` e
`F2-ui-shell.md` prontos com matriz de conflito explícita.

---

## 2026-05-14 — bootstrap

Repo criado a partir do orquestrador do MMB. Camada agêntica
importada e adaptada do `mr-meeseeks-box`:

- `CLAUDE.md` com identidade do projeto e roteamento de bootstrap.
- `docs/ORQUESTRADOR.md` adaptado — princípios genéricos preservados,
  exemplos e paths atualizados pro contexto cockpit.
- `docs/tasks/PROTOCOLO.md` com pré-flight de 4 invariantes.
- `docs/tasks/INDEX.md` com F0 (scaffold) como primeira task 🎯.
- `docs/arvore.md` com visão e MVP de 3 telas (decidido em
  discovery prévio no MMB — `mr-meeseeks-box/docs/tasks/E0-discovery-cockpit.md`).
- `scripts/task-start.sh` + `scripts/task-end.sh` adaptados.
- `.gitignore` apropriado pra projeto frontend.

Próximo passo: instanciar orquestrador local nesta raiz e atacar
F0 — scaffold do projeto Vite+React+TS+Vitest. Depois disso o
orquestrador discute com Rick a sequência de tasks subsequentes.
