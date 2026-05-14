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

# Confere mergeada (FF ou squash)
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  if git merge-base --is-ancestor "$BRANCH" master; then
    : # mergeada via FF/merge tradicional
  elif [ -z "$(git cherry master "$BRANCH" | grep '^\+' || true)" ]; then
    : # mergeada via squash
  else
    echo "ERRO: branch $BRANCH não está mergeada em master."
    echo "Mergeie o PR primeiro, ou destrutivo manualmente:"
    echo "  git worktree remove --force $WORKTREE_PATH"
    echo "  git branch -D $BRANCH"
    exit 1
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
