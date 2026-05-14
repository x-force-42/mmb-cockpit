# Task F2 — UI tooling + layout shell (Tailwind + shadcn + chrome)

## ID
F2

## Status
🎯 pronto pra delegar — **paraleliza com F1** (matriz de conflito
abaixo)

## Intenção

Levantar a camada visual do cockpit: Tailwind v4 funcionando,
shadcn-cli inicializado e 3-4 componentes base copiados, e o
**layout shell** (Header + Sidebar + área de conteúdo com `<Outlet>`)
pronto pra receber as telas reais que vêm em F3/F4/F5.

Quando essa task mergear, qualquer tela poderá usar `bg-slate-50`,
`<Button variant="outline">`, etc., e já vai nascer dentro do
shell sem se preocupar com cabeçalho/navegação.

## Escopo

### Dentro

- **Tailwind v4**:
  - `npm i -D tailwindcss @tailwindcss/vite`.
  - Adiciona o plugin `@tailwindcss/vite` em `vite.config.ts`.
  - Cria `src/index.css` com `@import "tailwindcss";`.
  - Importa `./index.css` em `src/main.tsx`.
- **shadcn-cli init**:
  - `npx shadcn@latest init` (responde: TypeScript yes, base color
    `slate`, CSS variables yes, RSC no, components alias
    `@/components`, utils alias `@/lib/utils`).
  - Resolver o alias `@` no `tsconfig.app.json` + `vite.config.ts`
    pra apontar pra `src/`.
  - Instala componentes iniciais: `npx shadcn@latest add button card
    skeleton separator` — esses 4 cobrem o shell e dão base
    pras telas.
- **Layout shell** em `src/components/layout/`:
  - `Layout.tsx` — grid CSS com sidebar fixa à esquerda + main area
    com `<Outlet />` no centro. Topo com Header. Responsivo
    minimamente (sidebar pode virar drawer < 768px ou simplesmente
    ficar visível sempre — escolha do agente, comente a decisão).
  - `Header.tsx` — barra superior fina, fundo branco/slate, com
    título "MMB Cockpit". Espaço reservado pra futuro indicador de
    projeto ativo (deixe um `<div>` placeholder à direita).
  - `Sidebar.tsx` — lista vertical com links pras rotas, usando
    `<NavLink>` do `react-router-dom` (v7) com classe ativa via
    callback. Itens iniciais:
    - Dashboard → `/`
    - Runs → `/runs`
  - Estilo: minimalista, denso. Cockpit é ferramenta interna, não
    landing page. Slate como cor base, sem gradiente, sem sombra
    pesada. Espelha estética de cockpits/admin tipo Linear, não tipo
    marketing site.
- **Integração com `src/App.tsx`**:
  - Usar nested routes do react-router v7:
    ```tsx
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Hello />} />
        <Route path="/runs" element={<RunsList />} />
      </Route>
    </Routes>
    ```
  - `Hello.tsx` e `RunsList.tsx` continuam existindo como placeholder,
    mas você pode trocar o conteúdo deles por um esboço mínimo que
    mostra que estão dentro do Layout (ex: `<Card><CardHeader>...
    </Card>`). Não invente conteúdo de produto — F3/F4/F5 fazem isso.
- **Testes**:
  - `src/components/layout/Layout.test.tsx` — renderiza Layout
    envolvendo um filho de teste; verifica que Header e Sidebar
    aparecem e que o filho é renderizado na área de conteúdo.
  - `src/components/layout/Sidebar.test.tsx` — renderiza Sidebar
    dentro de `<MemoryRouter>`; verifica os 2 links e seus paths.
  - O teste existente de `Hello` precisa ser ajustado pra envolver
    em `<MemoryRouter>` se quebrar (provavelmente não, já que Hello
    é só `<h1>`).

### Fora

- **Componentes ricos** das telas (tabela paginada, form de edição,
  charts). Cada tela traz os seus.
- **Toaster / feedback global** — F4 vai precisar pro PATCH do detalhe,
  decide lá.
- **Dark mode** — fora do MVP. Variáveis CSS do shadcn já preparam
  o terreno, mas não habilita.
- **Auth, login, user profile** — não existe usuário.
- **API client, queries, MSW** (F1 paralela).

## Critério de pronto

1. `npm run typecheck` zero erros.
2. `npm run test:run` verde — testes novos passam, teste do Hello
   continua passando (ajustado se necessário).
3. `npm run lint` clean (Biome pode reclamar de algumas classes
   Tailwind longas, mas isso é estética, não erro).
4. `npm run build` sucesso. Verifica que o CSS purgado entra no bundle.
5. `npm run dev` em `localhost:5173`:
   - Página `/` exibe o shell (Header + Sidebar + conteúdo).
   - Clicar em "Runs" na sidebar navega pra `/runs` sem reload e
     marca o link como ativo.
   - Visualmente: minimalista, denso, slate-based. Sem desalinhamentos.
6. Alias `@/` funciona em imports (`import { Button } from "@/components/ui/button"`).
7. README ganha 3 linhas sobre styling (Tailwind v4, shadcn, como
   adicionar mais componentes via `npx shadcn add`).

## Contexto técnico

### Stack já fechada

- Tailwind **v4**. Não use v3 — é mais antigo e tem outra config.
- shadcn/ui via CLI oficial (não a "old radix-ui copy").
- React Router v7 (vinha como v6 no brief F0, mas o agente entregou
  v7 que é o stable atual — usar v7 idioms).

### Padrões a seguir

- pt-BR em texto UX (títulos da sidebar, labels).
- Nomes técnicos em inglês (`Layout`, `Sidebar`, `Header`).
- Imports com `verbatimModuleSyntax: true`. `import type` pra tipos puros.
- Commits granulares: `chore(F2): tailwind + shadcn init`,
  `feat(F2): layout shell com header e sidebar`, `test(F2): ...`.

### Pegadinhas conhecidas

- shadcn-cli pode pedir pra editar `tsconfig.json` — você tem
  `tsconfig.json` (root) + `tsconfig.app.json` (compile config).
  O alias `@/*` vai em `tsconfig.app.json` (paths) + `vite.config.ts`
  (resolve.alias). Pode ser que shadcn-cli ofereça gerar isso — aceite.
- Tailwind v4 não precisa de `postcss.config.*`. Se o init criar,
  pode deletar.
- React Router v7: nested routes usam `<Outlet />` dentro do elemento
  pai. NavLink ativa via callback `className={({ isActive }) => ...}`.

## Implementação sugerida

Ordem:

1. `npm i -D tailwindcss @tailwindcss/vite`.
2. Adiciona plugin em `vite.config.ts`.
3. Cria `src/index.css` com `@import "tailwindcss";` + import em `main.tsx`.
4. Confirma que classes Tailwind funcionam: bota `className="text-red-500"`
   em algo, abre o dev server.
5. `npx shadcn@latest init` — responde os prompts.
6. Configura alias `@/` (tsconfig + vite).
7. `npx shadcn@latest add button card skeleton separator`.
8. Cria `src/components/layout/{Layout,Header,Sidebar}.tsx`.
9. Atualiza `src/App.tsx` pra usar nested routes envolvendo em Layout.
10. Ajusta `Hello.tsx`/`RunsList.tsx` se necessário pra renderizar
    bonito dentro do Layout (esboço mínimo, não produto).
11. Escreve os testes do Layout e Sidebar.
12. Roda full check.
13. Atualiza README.

### Sketch do `Layout.tsx`

```tsx
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="min-h-screen grid grid-cols-[16rem_1fr] grid-rows-[auto_1fr] bg-slate-50">
      <div className="col-span-2"><Header /></div>
      <aside className="border-r bg-white"><Sidebar /></aside>
      <main className="p-6"><Outlet /></main>
    </div>
  );
}
```

(Sketch — agente decide detalhes.)

## Testes a adicionar

- `Layout.test.tsx` — renderiza com `<MemoryRouter>` e testa
  presença de elementos do shell + área de conteúdo recebe filho via
  Outlet.
- `Sidebar.test.tsx` — renderiza dentro de `<MemoryRouter>`,
  testa os 2 links com hrefs corretos.

## Decisões em aberto

Nenhuma. Tudo fechado no discovery.

## Dependências

- Bloqueia: F3 (Lista), F4 (Detalhe), F5 (Dashboard) — todas vão
  nascer dentro do Layout e usar componentes shadcn.
- Bloqueado por: nada. **Paraleliza com F1**.

## Conflito potencial com

### F1 (data layer) — PARALELA

| Arquivo | F1 faz | F2 faz | Resolução |
|---|---|---|---|
| `src/api/`, `src/types/` | cria | — | sem conflito |
| `src/components/`, `src/components/layout/` | — | cria | sem conflito |
| `src/components/ui/` (shadcn) | — | cria | sem conflito |
| `src/lib/utils.ts` (shadcn) | — | cria | sem conflito |
| `src/index.css` | — | cria | sem conflito |
| `src/main.tsx` | adiciona `<QueryClientProvider>` + MSW startup | adiciona `import "./index.css"` | linhas diferentes — merge trivial |
| `src/App.tsx` | — | envolve `<Routes>` em `<Layout>` | sem conflito |
| `package.json` | adiciona deps de data | adiciona deps de UI | merge trivial |
| `package-lock.json` | regenera | regenera | **o 2º a mergear faz `git rebase master` + `rm package-lock.json && npm install` e commita o lock atualizado** |
| `tsconfig.app.json` | — | adiciona `paths: { "@/*": ["./src/*"] }` | sem conflito |
| `vite.config.ts` | — | adiciona plugin Tailwind + `resolve.alias` | sem conflito |
| `biome.json` | — | possível tweak (incluir `src/lib/`, `src/components/ui/`) | sem conflito |
| `README.md` | adiciona seção env vars | adiciona seção styling | merge trivial (seções diferentes) |

**Regra de paralelismo**:
- Não toque em `src/api/`, `src/types/`, `src/api/mocks/`, ou
  `src/setupTests.ts`. F1 faz isso.
- Se F1 já mergeou antes do seu PR, rebasee e regenere lockfile.

## Estimativa

~2-3h com IA. Maior bloco é o shadcn init + ajuste de alias.
Layout em si é meia hora.
