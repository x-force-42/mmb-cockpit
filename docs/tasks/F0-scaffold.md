# Task F0 — Scaffold do projeto

## ID
F0

## Status
🎯 pronto pra delegar

## Intenção

Criar a fundação do `mmb-cockpit`: projeto Vite + React +
TypeScript + Vitest funcional, com estrutura de pastas convencional,
scripts npm que rodam (dev, build, test), e uma página "Hello cockpit"
que prova que tudo se conecta. **Nenhuma decisão sobre styling, data
fetching ou bibliotecas de gráfico nesta task** — essas vêm em tasks
subsequentes, discutidas com o Rick.

## Escopo

### Dentro

- `npm create vite@latest` com template `react-ts` (ou equivalente).
- Configuração mínima de Vitest (test runner + jsdom + testing-library
  básico).
- Estrutura inicial de pastas:
  ```
  src/
  ├── main.tsx
  ├── App.tsx
  ├── pages/         (vazio por enquanto, só placeholder)
  ├── components/    (vazio)
  ├── api/           (vazio — F1 popula com client + types)
  └── types/         (vazio)
  ```
- `package.json` com scripts: `dev`, `build`, `preview`, `test`,
  `test:run`, `lint` (se houver linter), `typecheck`.
- ESLint + Prettier OU Biome — escolher um e configurar mínimo
  (vide "Decisão recomendada" abaixo). Estilo do código segue o
  config default da ferramenta escolhida.
- React Router DOM v6+ instalado e com 2 rotas placeholder:
  - `/` → tela "Hello cockpit"
  - `/runs` → tela "lista (em construção)"
  Apenas pra provar que o roteamento funciona.
- Um teste unitário em Vitest que prova o setup: testa o componente
  inicial renderiza "Hello cockpit".
- `README.md` da raiz já existe; adicione comandos `npm install`,
  `npm run dev` se mudarem (provavelmente não mudam).

### Fora

- Estilo / theming / Tailwind / CSS-in-JS. Sem decisão tomada ainda.
- Data fetching (TanStack Query, SWR, fetch puro). F1 decide e
  implementa.
- Charts (recharts, visx, etc).
- API client efetivo — F1 vai cuidar.
- Layout/shell (sidebar, header, footer) — task futura.
- Deploy / CI — task futura.

## Critério de pronto

1. `npm install` na raiz funciona limpo.
2. `npm run dev` sobe Vite em `localhost:5173` e a página `/`
   exibe "Hello cockpit".
3. `npm run build` gera `dist/` sem erros.
4. `npm test` ou `npm run test:run` roda o teste do Hello e passa.
5. `npx tsc --noEmit` (typecheck) passa sem erros.
6. ESLint/Biome roda (`npm run lint` se configurado) sem erros.
7. README atualizado se algum comando divergiu do esperado.
8. Tudo commitado em commits pequenos e descritivos.

## Contexto técnico

### Estado do repo

Repo recém-iniciado. Apenas docs + scripts + .gitignore + README.
Nenhum `package.json` ainda. Esta task é literalmente do zero.

### Decisões fechadas (não negocie)

Alinhadas com o Rick em 2026-05-14:

- **Template Vite**: `react-ts`. Não use SWC se o Vite default for
  Babel — fica como vier.
- **Linter/formatter**: **Biome**. Não usar ESLint+Prettier.
- **React Router**: v6 (current stable).
- **Testing Library**: `@testing-library/react` + `@testing-library/jest-dom`
  via Vitest. Configurar jsdom em `vite.config.ts`.
- **Tsconfig**: `strict: true`. Acompanhe o template, só endurece
  se default vier flexível demais.
- **Rotas placeholder**: `/` → "Hello cockpit", `/runs` → "em construção".
  Mantenha exatamente esses paths. Decisão de onde mora a dashboard
  fica pra task da dashboard, não aqui.
- **Stack core fechada**: React + Vite + TypeScript + Vitest + Biome
  + react-router. Nenhuma outra dep de runtime ou tooling entra em
  F0 — se aparecer "vai precisar", flagga e pergunta.

### Padrões a seguir

- Português pra mensagens UX e comentários (igual ao ecossistema MMB).
- Inglês pra nomes técnicos de componentes (Run, Project, etc).
- Commits no estilo `feat: scaffold inicial Vite React TS`,
  `chore: adiciona vitest`, etc.

## Implementação sugerida

Ordem aproximada:

1. `npm create vite@latest . -- --template react-ts` na raiz da
   worktree (cuidado: o cwd da worktree).
2. Mover/limpar arquivos default que não fazem sentido (assets do
   logo Vite, etc — mantenha só o mínimo).
3. Adicionar Vitest + testing-library + jsdom como dev deps.
   Configurar `vite.config.ts` com `test: { environment: "jsdom",
   setupFiles: "./src/setupTests.ts" }`.
4. Criar `src/setupTests.ts` com `import "@testing-library/jest-dom"`.
5. Configurar Biome (ou ESLint+Prettier): rodar `npx @biomejs/biome init`
   ou similar. Aceitar defaults razoáveis.
6. Instalar `react-router-dom`. Em `App.tsx`, configurar 2 rotas
   triviais.
7. Criar `src/pages/Hello.tsx` exibindo `Hello cockpit`.
8. Criar `src/pages/RunsList.tsx` placeholder com `Em construção`.
9. Escrever um teste `src/pages/Hello.test.tsx` que renderiza
   `<Hello />` e busca o texto.
10. Rodar `npm run dev`, `npm test`, `npm run build`, `npm run lint`,
    `npx tsc --noEmit` — todos verdes.
11. Commit final com tudo organizado.

## Testes a adicionar

Mínimo:

- `src/pages/Hello.test.tsx` — renderiza, encontra texto "Hello cockpit".

Quaisquer testes extras de smoke do scaffold são bem-vindos mas não
obrigatórios.

## Decisões em aberto

Nenhuma — todas as decisões do MVP estão fechadas (ver "Decisões
recomendadas"). Se algo aparecer durante implementação que não
caiba nas recomendadas, **flagga e pergunta**.

## Dependências

- Bloqueia: F1 (API client) e todas as outras tasks frontend.
- Bloqueado por: nada.

## Conflito potencial com

Nada. É a primeira task, repo vazio.

## Estimativa

~2h com IA, máximo. Maior parte é configuração de tooling.
Implementação de UI é minúscula nesta task. Se estourar muito
desse teto, é sinal de que você caiu em yak-shaving — pare e
reporte ao Rick.
