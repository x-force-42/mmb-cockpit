# Protocolo de operação para agentes — mmb-cockpit

Este documento descreve como uma sessão do Claude CLI deve operar
quando inicia em uma worktree do mmb-cockpit pra executar uma
task. Vale pra todas as tasks em `docs/tasks/`.

Se você é um agente lendo isto pela primeira vez nesta sessão:
**leia até o fim antes de tocar em qualquer arquivo.**

## Princípio único

Sessões paralelas trabalhando em tasks diferentes nunca podem
conflitar. Isso só é verdade se cada uma operar em sua própria
**worktree git** com sua própria **branch**, derivada de um
`master` atualizado.

Tudo aqui decorre desse princípio.

## Pré-flight obrigatório (antes de QUALQUER edit)

### 1. Você está numa worktree, não na raiz do repo principal

```bash
git rev-parse --show-toplevel
git rev-parse --git-dir
```

Toplevel legítimo: `/home/eliezer/llab/mmb-cockpit/.worktrees/<id>-<slug>`.

Se toplevel for `/home/eliezer/llab/mmb-cockpit` (raiz): **pare**.
Peça `scripts/task-start.sh <id>` e reinicie a sessão na worktree.

### 2. Você não está em `master` (nem `main`)

```bash
git branch --show-current
```

Deve ser `task/<id>-<slug>`. Senão, **pare**.

### 3. Sua branch está alinhada com master

```bash
git fetch origin master --quiet 2>/dev/null || true
git rev-list --count master..HEAD   # commits seus à frente
git rev-list --count HEAD..master   # commits de master ausentes
```

- HEAD..master > 0 (atrasada): **pare**, peça `git rebase master`
  na worktree, ou recrie.
- master..HEAD > 0 (adiantada): ok, são seus commits em progresso.
- 0/0: estado fresco.

### 4. Working tree limpa antes de começar

```bash
git status --porcelain
```

Vazio = ok. Mudanças não-suas? **Pare** e pergunte ao Rick.

## Fluxo de trabalho

Depois de pré-flight verde:

1. **Leia o brief**: `cat docs/tasks/<seu-id>-<slug>.md`.
2. **Confirme decisões em aberto** com Rick se houver.
3. **Trabalhe**. Commits pequenos com mensagens descritivas.
4. **Rode os testes locais** antes de cada commit
   (`npm test` / `npm run build` conforme aplicável).
5. **Não mergeie** na master. Só o Rick aprova e mergeia.
6. **Reporte** ao fim.

## Convenções

| Item | Convenção |
|---|---|
| Nome da worktree | `.worktrees/<id>-<slug>` |
| Nome da branch | `task/<id>-<slug>` |
| Base da branch | `master` (sempre) |
| Granularidade de commit | Um conceito atômico por commit. |
| Estilo de commit message | `feat: ...`, `fix: ...`, `refactor: ...`, `test: ...`, `docs: ...`, `chore: ...` |
| Hooks | Nunca pule (`--no-verify` proibido) |
| Push | Não pushe sem o Rick aprovar |

## Coordenação entre agentes paralelos

Se outro agente está atacando uma task com **interseção de arquivos**,
o brief avisa em "Conflito potencial com". Confirme com Rick antes
de começar, ou aguarde a outra task mergear.

## Quando o brief não cobre alguma situação

**Escopo do brief vence.** Se aparece algo fora dele, você NÃO faz.
Anota no relatório final e pergunta ao Rick depois.

## Cleanup ao terminar

Depois do PR mergeado:

```bash
cd /home/eliezer/llab/mmb-cockpit
scripts/task-end.sh <id>
```

Que automatiza:

```bash
git worktree remove --force .worktrees/<id>-<slug>
git branch -d task/<id>-<slug>
```
