#!/usr/bin/env bash
# PreToolUse: Edit|Write|MultiEdit
# Blocks any write outside anatomy-explorer/. The live patient site lives next door
# and a clinician is entering content into it. Exit 2 blocks and returns stderr to Claude.
set -uo pipefail
payload="$(cat)"
path="$(printf '%s' "$payload" | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]+"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"//; s/"$//')"
[ -z "$path" ] && exit 0

case "$path" in
  */patient-library/*|*/pshyapp/src/*|*/pshyapp/docs/*|*/pshyapp/scripts/*|*/pshyapp/public/*)
    echo "BLOCKED: $path is in the live patient site. It is reference only — read it, never write to it." >&2
    echo "If this module genuinely needs a change there, stop and report it to Afsal instead." >&2
    exit 2 ;;
esac

case "$path" in
  */anatomy-explorer/*) exit 0 ;;
  /*)
    echo "BLOCKED: $path is outside anatomy-explorer/. All work happens inside this folder." >&2
    exit 2 ;;
esac
exit 0
