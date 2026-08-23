#!/usr/bin/env bash
# SessionStart — stdout becomes context.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

echo "=== physio-platform ==="
echo "branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'no git')"

CHANGED=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
echo "uncommitted files: ${CHANGED}"

if [ -f src/data/items.json ]; then
  PUB=$(grep -o '"status"[[:space:]]*:[[:space:]]*"published"' src/data/items.json 2>/dev/null | wc -l | tr -d ' ')
  echo "published items: ${PUB}"
  echo "content last synced: $(date -r src/data/items.json '+%Y-%m-%d %H:%M' 2>/dev/null || echo unknown)"
else
  echo "content: not yet synced (run: npm run sync:content)"
fi

echo ""
echo "Read memory.md before making decisions. Never hand-edit src/data/*.json."
exit 0
