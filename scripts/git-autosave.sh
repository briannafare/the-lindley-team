#!/bin/bash
# git-autosave — mirror the current working state to GitHub so no work is ever
# laptop-only.
#
# WHY THIS EXISTS
#   July 2026: a Vercel CLI deploy shipped commit 762f0912, which existed in no
#   branch of this repository. 131 files and ~20,000 lines lived only on one
#   laptop and in Vercel's file storage until they were recovered through the
#   deployment files API.
#   August 2026: a neighborhoods editorial rebuild and an uncommitted Sanity
#   Studio migration were found sitting only on that same laptop. Working from
#   anywhere else meant rebuilding them from scratch.
#
# WHAT IT DOES
#   Snapshots the whole working tree — tracked, untracked, .gitignore honoured —
#   and pushes it to origin as `autosave/<branch>`.
#
# WHAT IT DELIBERATELY DOES NOT DO
#   - touch the working tree, the index, HEAD, or any real branch
#   - push main/master (on this project a push to main IS a production deploy)
#   - force-push anything outside its own autosave/* namespace
#   - run when there is no origin remote, or when nothing changed
#
# USAGE
#   ./scripts/git-autosave.sh              run once, here
#   Wire it to a Claude Code Stop hook to run automatically — see README below.
#
# RECOVER FROM ANOTHER MACHINE
#   git fetch origin
#   git checkout autosave/<branch>

set -u

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$ROOT" || exit 0

git remote get-url origin >/dev/null 2>&1 || exit 0
git rev-parse HEAD >/dev/null 2>&1 || exit 0   # repo has no commits yet

BRANCH=$(git symbolic-ref --quiet --short HEAD 2>/dev/null || echo "detached")
case "$BRANCH" in
  autosave/*) exit 0 ;;                        # never autosave an autosave
esac

# Build the snapshot in a throwaway index so the real one is never touched.
TMP_INDEX=$(mktemp "${TMPDIR:-/tmp}/autosave-idx.XXXXXX") || exit 0
trap 'rm -f "$TMP_INDEX"' EXIT
export GIT_INDEX_FILE="$TMP_INDEX"

git read-tree HEAD 2>/dev/null || exit 0
git add -A 2>/dev/null                         # honours .gitignore
TREE=$(git write-tree 2>/dev/null) || exit 0

# Nothing changed since the last autosave -> nothing to do.
STAMP="$ROOT/.git/autosave-last-tree"
if [ -f "$STAMP" ] && [ "$(cat "$STAMP" 2>/dev/null)" = "$TREE" ]; then
  exit 0
fi

COMMIT=$(git commit-tree "$TREE" -p HEAD -m "autosave: $BRANCH @ $(date -u '+%Y-%m-%d %H:%M UTC')

Automatic off-machine backup of the working tree, including uncommitted and
untracked files. Not reviewed and not for merge.

Recover with:  git checkout autosave/$BRANCH" 2>/dev/null) || exit 0

if git push --force --quiet origin "$COMMIT:refs/heads/autosave/$BRANCH" 2>/dev/null; then
  echo "$TREE" > "$STAMP"
  echo "autosave -> origin/autosave/$BRANCH"
else
  echo "autosave: push failed (offline?) — state is still local" >&2
fi
