#!/usr/bin/env bash
# PostToolUse on Write|Edit. Best-effort format of the edited file.
set -uo pipefail
INPUT=$(cat)
FILE_PATH=$(printf '%s' "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*:[[:space:]]*"//; s/"$//')
[ -z "$FILE_PATH" ] && exit 0
[ -f "$FILE_PATH" ] || exit 0

case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.mjs|*.astro|*.css|*.json|*.md)
    cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
    npx --no-install prettier --write "$FILE_PATH" >/dev/null 2>&1 || true ;;
esac
exit 0
