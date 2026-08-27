#!/usr/bin/env bash
# PreToolUse: Bash — gate git push on a green build.
set -uo pipefail
payload="$(cat)"
cmd="$(printf '%s' "$payload" | grep -oE '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1)"
printf '%s' "$cmd" | grep -q 'git push' || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
echo "Running typecheck and build before push..." >&2

if ! npm run typecheck >/tmp/ae-tc.log 2>&1; then
  echo "BLOCKED: typecheck failed." >&2; tail -20 /tmp/ae-tc.log >&2; exit 2
fi
if ! npm run build >/tmp/ae-build.log 2>&1; then
  echo "BLOCKED: build failed." >&2; tail -20 /tmp/ae-build.log >&2; exit 2
fi
if npm run 2>/dev/null | grep -q 'check:anatomy'; then
  if ! npm run check:anatomy >/tmp/ae-chk.log 2>&1; then
    echo "BLOCKED: check:anatomy failed. Fix the content, never the check." >&2
    tail -30 /tmp/ae-chk.log >&2; exit 2
  fi
fi

# the backstop that matters most
drift="$(git -C .. status --short -- ':!anatomy-explorer' 2>/dev/null)"
if [ -n "$drift" ]; then
  echo "BLOCKED: files outside anatomy-explorer/ have changed:" >&2
  printf '%s\n' "$drift" >&2
  echo "Revert them before pushing. The live patient site must not move." >&2
  exit 2
fi
exit 0
