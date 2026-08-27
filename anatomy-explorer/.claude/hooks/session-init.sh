#!/usr/bin/env bash
# SessionStart — stdout becomes context.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
echo "=== Anatomy Explorer ==="
echo "Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'not a repo')"
echo
echo "Read HANDOFF.md, then memory.md, then the active unified product documents. Archived plans are historical only."
echo "Write only files required by the current BUILD-PLAN.md phase."
echo "../patient-library/ is a LIVE patient site. Reference only. Never write to it."
echo
drift="$(git -C .. status --short -- ':!anatomy-explorer' 2>/dev/null | head -10)"
if [ -n "$drift" ]; then
  echo "!! UNCOMMITTED CHANGES OUTSIDE anatomy-explorer/ — investigate before starting:"
  printf '%s\n' "$drift"
  echo
fi
echo "Changed here:"
git status --short -- . 2>/dev/null | head -12 || true
exit 0
