# Progresso — mmb-cockpit

Log enxuto de marcos. Atualizar a cada milestone, **não** a cada commit.
Mais recente no topo.

---

## 2026-05-14 — F1 + F2 entregues; F2.1 (hotfixes) destrancado

Par paralelo F1 (camada de dados) + F2 (UI tooling + shell) executado
com sucesso em worktrees simultâneas. F1 mergeado primeiro (7 commits
granulares fast-forward), F2 fez rebase + regenerou lockfile +
mergeou via **squash** (decisão de Rick — codificada agora no
PROTOCOLO como padrão).

Resultado: typecheck zero, lint clean (38 arquivos), build 291kb
(92kb gzip), 10 testes (todos verdes — mas vitest captura
`.worktrees/`, ver F2.1).

Veredito por entrega:

- **F1**: forte. Types completos, ApiError tipado, query keys
  factory, MSW handlers com estado mutável + reset. 1 ressalva
  pequena: fixtures não cobrem `garagem_error` terminal_phase
  (F5 vai testar phase_breakdown — fica na lista).
- **F2**: bom, com decisões silenciosas. Layout/Header/Sidebar
  limpos com tokens shadcn. Preset escolhido foi `radix-nova` (não
  o default) + base `neutral` (não `slate` do brief). Trouxe junto
  `@fontsource-variable/geist` e `tw-animate-css` sem pedir. Tudo
  funciona, mas é decisão que o brief de F2 não previa. Aceitamos
  o preset como fato consumado (README já reflete).

Issues identificados → viram **F2.1**:
- Vitest pega `.worktrees/**` (testes duplicados em runtime).
- `shadcn` CLI foi parar em `dependencies` (deveria ser dev).
- `task-end.sh` falha em squash merge (`merge-base --is-ancestor`
  não detecta squash). Explica por que worktree F2 não foi limpa.

Decisões consolidadas nesta rodada:

- **Merge style**: squash padrão. PROTOCOLO atualizado pra refletir.
  Granularidade fica no PR, master fica linear.
- **Hotfixes pequenos pós-task** viram brief micro próprio (F2.1
  como precedente), não enxertados na próxima task.

Próximo passo: rodar F2.1 (~15-20min), depois F3 (Lista de runs)
fica destrancada.

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
