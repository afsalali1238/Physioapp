#!/usr/bin/env bash
# PreToolUse on Read|Edit|Write. exit 2 = block, stderr goes back to Claude.
set -uo pipefail
INPUT=$(cat)
FILE_PATH=$(printf '%s' "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*:[[:space:]]*"//; s/"$//')
[ -z "$FILE_PATH" ] && exit 0

case "$FILE_PATH" in
  *.env|*.env.*|*/secrets/*|*.pem|*.key|*id_rsa*)
    echo "Blocked: $FILE_PATH holds credentials. Ask the user for what you need instead." >&2
    exit 2 ;;
  */src/data/*.json)
    echo "Blocked: src/data/*.json is generated from the Google Sheet. Edit the sheet, then run 'npm run sync:content'." >&2
    exit 2 ;;
esac
exit 0
