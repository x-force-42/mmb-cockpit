#!/usr/bin/env bash
# Cleanup após uma task ser mergeada.
#
# Uso:
#   scripts/task-end.sh <task-id>

set -euo pipefail

TASK_ID="${1:-}"
if [ -z "$TASK_ID" ]; then
  echo "Uso: $0 <task-id>"
  exit 1
fi

if [ ! -f "CLAUDE.md" ]; then
  echo "ERRO: rode da raiz do mmb-cockpit."
  exit 1
fi

TASK_FILE=$(ls docs/tasks/${TASK_ID}-*.md 2>/dev/null | head -1 || true)
if [ -z "$TASK_FILE" ]; then
  echo "ERRO: task '$TASK_ID' não encontrada."
  exit 1
fi
SLUG=$(basename "$TASK_FILE" .md)

WORKTREE_PATH=".worktrees/${SLUG}"
BRANCH="task/${SLUG}"

if ! git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  echo "Branch $BRANCH não existe. Nada a limpar."
fi

# Confere mergeada (FF ou squash).
#
# Squash merges colapsam N commits em 1, então `git cherry` comparando a
# branch direto com master não casa patch-ids (cada commit individual da
# branch não tem equivalente em master). O truque: construir um commit
# hipotético "squash candidate" (tree da branch aplicado sobre o merge-base)
# e pedir pro git cherry comparar esse commit com master. Quando o squash
# foi feito, master tem um commit com patch-id equivalente — o cherry
# retorna `- <hash>` (e não `+`).
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  if git merge-base --is-ancestor "$BRANCH" master; then
    : # mergeada via FF/merge tradicional
  else
    MERGE_BASE=$(git merge-base master "$BRANCH")
    BRANCH_TREE=$(git rev-parse "${BRANCH}^{tree}")
    SQUASH_CANDIDATE=$(git commit-tree -m "_" -p "$MERGE_BASE" "$BRANCH_TREE")
    if git cherry master "$SQUASH_CANDIDATE" | grep -q "^- "; then
      : # mergeada via squash (patch-id equivalente já está em master)
    else
      echo "ERRO: branch $BRANCH não está mergeada em master."
      echo "Mergeie o PR primeiro, ou destrutivo manualmente:"
      echo "  git worktree remove --force $WORKTREE_PATH"
      echo "  git branch -D $BRANCH"
      exit 1
    fi
  fi
fi

if [ -d "$WORKTREE_PATH" ]; then
  git worktree remove "$WORKTREE_PATH"
  echo "✓ Worktree removida: $WORKTREE_PATH"
fi

if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git branch -D "$BRANCH"
  echo "✓ Branch apagada: $BRANCH"
fi

git worktree prune
echo "✓ Cleanup concluído pra task $TASK_ID."
