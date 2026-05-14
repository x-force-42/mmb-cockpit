# Progresso — mmb-cockpit

Log enxuto de marcos. Atualizar a cada milestone, **não** a cada commit.
Mais recente no topo.

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
