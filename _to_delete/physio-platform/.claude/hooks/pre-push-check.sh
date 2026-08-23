#!/usr/bin/env bash
# PreToolUse on Bash. Gate git push behind a passing build.
set -uo pipefail
INPUT=$(cat)
CMD=$(printf '%s' "$INPUT" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*:[[:space:]]*"//; s/"$//')
case "$CMD" in *"git push"*) ;; *) exit 0 ;; esac

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -f package.json ] || exit 0

echo "pre-push: building..." >&2
if ! npm run build >/tmp/physio-build.log 2>&1; then
  echo "Push blocked: 'npm run build' failed. Last 30 lines:" >&2
  tail -30 /tmp/physio-build.log >&2
  exit 2
fi
echo "pre-push: build OK" >&2
exit 0
