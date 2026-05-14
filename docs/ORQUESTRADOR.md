# Orquestrador — modus operandi do mmb-cockpit

Doc espelho de [`tasks/PROTOCOLO.md`](tasks/PROTOCOLO.md): aquele
fala como um **agente delegado** deve operar; este fala como o
**orquestrador** (sessão Claude na raiz do mmb-cockpit conversando
com o Rick) deve operar.

Este workflow foi importado do **mr-meeseeks-box** (ver
`mr-meeseeks-box/docs/ORQUESTRADOR.md`), onde foi codificado depois
de 5 ciclos consecutivos de delegação bem-sucedida. As regras são
genéricas; só os exemplos e paths mudam.

## Os atores

| Ator | Quem é | Onde mora | O que faz |
|---|---|---|---|
| **Rick** | Humano dono do projeto | Termo + browser | Decide, prioriza, merga |
| **Orquestrador** | Sessão Claude na raiz do cockpit | `master` | Discovery, briefs, docs, coordenação |
| **Agente delegado** | Sessão Claude em worktree | `.worktrees/<id>-<slug>` | Executa **uma** task específica |

Orquestrador e agente delegado são **a mesma ferramenta** (Claude
CLI), em papéis diferentes. A worktree é o que separa.

## O ciclo principal — do brainstorm ao merge

Sete fases. Nem toda task passa por todas — hotfix de 1 linha pula
muita coisa; uma trilha nova passa por tudo.

### 1. Brainstorm em conversa

Rick traz uma necessidade. Orquestrador ouve, valida o entendimento,
e sinaliza categoria:

- **Resposta direta** — pergunta exploratória, debug. Não vira task.
- **Hotfix pequeno** — orquestrador pode fazer em até ~20min, sem
  brief. Commita direto em `master`.
- **Trilha existente** — cai numa task já mapeada. Pula pra fase 5.
- **Discovery formal** — é novidade real, passa pelas fases 2-4.

Orquestrador desafia o framing: "essa é a coisa certa?", "qual é o
ganho?". Combina o porquê antes do como.

### 2. Discovery iterativa

Quando grande o suficiente, vira **conversa estruturada**:

- 3 perguntas por rodada, focadas no que destranca a próxima decisão.
- Cada rodada produz **decisões consolidadas** + **decisões em aberto**.
- Decisões viram texto, vivem num doc tipo `docs/tasks/E0-...md`
  formato discovery (não-implementável).
- Iterar até decisões em aberto chegarem a zero.
- Quando zero: discovery fecha, vira brief.

### 3. Brief de delegação

Brief é autoritativo. Mora em `docs/tasks/<id>-<slug>.md`. Estrutura
em [`tasks/INDEX.md`](tasks/INDEX.md) seção "Esqueleto de brief".

**Princípio central**: o brief deve ser autossuficiente. Um agente
recém-iniciado, sem contexto desta sessão, precisa conseguir entregar
só com:

1. O brief.
2. O código atual do projeto.
3. `docs/tasks/PROTOCOLO.md`.

Se o agente precisar voltar e perguntar algo que não está no brief,
o brief falhou. Nada de "decisão em aberto" no brief de uma task 🎯
pronta — se está aberta, é discovery não terminou ainda.

### 4. Atualização do mapa

Atomicamente com o brief:

- **`tasks/INDEX.md`** — entrada na tabela com status, link.
- **`tasks/INDEX.md`** matriz de paralelismo (se aplicável).
- **`arvore.md`** — nó atualizado.
- **`progresso.md`** — só quando milestone, não a cada commit.

Tudo num único commit `docs(<id>): ...`. Mapa e brief sempre juntos.

### 5. Provisionamento da worktree

Rick roda `scripts/task-start.sh <id>`. Script:

- Atualiza `master`.
- Cria worktree em `.worktrees/<id>-<slug>/` com branch
  `task/<id>-<slug>` a partir de `master`.

Esse passo é deliberado — não automatizar pra dentro do agente.

### 6. Bootstrap do agente

Rick faz `cd` na worktree e roda `claude`. O agente:

1. Pré-flight conforme `PROTOCOLO.md`.
2. Lê `INDEX.md`, identifica a task pelo slug da branch.
3. Pergunta ao Rick qual atacar (já sugerindo a óbvia).
4. Lê o brief autoritativo.
5. Trabalha.

### 7. Entrega, merge, atualização

Agente entrega → Rick revisa → merga → avisa o orquestrador.

Orquestrador:

- Inspeciona o diff. Dá um veredito honesto.
- Atualiza `INDEX.md`, `arvore.md`, `progresso.md`.
- Commita como `docs(<id>): ...`.

## Princípios implícitos

1. **Conversa é pra decisões, brief é pra execução.**
2. **Brief é autoritativo, agente não negocia escopo.**
3. **Docs são a camada de consenso** — memória de sessão não conta.
4. **Scripts enforcem invariantes**, não são docs.
5. **Orquestrador não toca código de produção** (só docs/scripts).
6. **Paralelismo é deliberado** — toda task 🎯 ganha matriz de conflito.
7. **Validação é iterativa** — cada merge atualiza progresso.

## Anti-padrões

- **Brief com decisões em aberto pendentes** → reverte pra discovery.
- **Agente refatorando código vizinho** → rejeita merge, brief é
  recortado, agente reinicia.
- **Orquestrador implementando "um detalhezinho"** → se passa de
  1-2 linhas óbvias, vira brief. Escopo silenciosamente cresce aqui.
- **Sessão paralela sem matriz de conflito** → matriz é responsabilidade
  do orquestrador, atualizar antes da 2ª worktree subir.
- **Hotfix sem rastro** → menção em `progresso.md` quando for
  material. Regra: se em 2 meses não dá pra reconstruir o "por quê"
  só com código + commit msg, falta narrativa.

## Quando NÃO seguir o protocolo

- **Conversação exploratória** ("e se a gente fizesse X?").
- **Debug em produção** — entender por que algo caiu, sem brief.
- **Pergunta sobre arquitetura** — quer entender, não fazer.
- **Pivô grande de visão** — refatora a camada agêntica antes.

## Como a camada agêntica evolui

Heurística da regra das 3 ocorrências:

- Padrão repetiu 3 vezes seguidas do mesmo jeito? → real.
- Documentar agora custa pouco e poupa muito? → vale.
- Serve sessões futuras, não a atual? → essencial.

A camada agêntica é meta-código. Trate com a mesma seriedade de um
framework: refactor regular, deletar o que não usa, não acumular
cruft.

## Coordenação com o ecossistema MMB

O cockpit consome a **API REST do MMB**. Se a API mudar contrato:

- Coordenação acontece via `mr-meeseeks-box/docs/tasks/`. Mudanças
  no contrato viram task no MMB.
- O cockpit ajusta consumo via task própria quando o contrato
  evoluir.
- Não há código compartilhado — só o contrato JSON.
