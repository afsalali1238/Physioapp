#!/usr/bin/env bash
# PostToolUse: Write|Edit|MultiEdit
# Warns on diagnostic and outcome-claim vocabulary in the file just written.
# Non-blocking by design — it surfaces the problem while the agent still has context.
set -uo pipefail
payload="$(cat)"
path="$(printf '%s' "$payload" | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]+"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"//; s/"$//')"
[ -z "$path" ] || [ ! -f "$path" ] && exit 0
case "$path" in *.ts|*.tsx|*.astro|*.js|*.mjs|*.md|*.css) ;; *) exit 0 ;; esac

CONDITIONS='tendinopathy|tendinitis|sciatica|impingement|frozen shoulder|tennis elbow|golfer.s elbow|plantar fasciitis|slipped disc|herniat|trapped nerve|arthritis|bursitis|whiplash|spondyl'
CLAIMS='\bcure\b|\bcures\b|guaranteed|miraculous|\bsafest\b|\bthe best\b|\bproven to\b|will fix|permanently'
HEDGES='this could be|you may have|you might have|the cause is|likely caused by'

hits=""
for pat in "$CONDITIONS" "$CLAIMS" "$HEDGES"; do
  m="$(grep -niE "$pat" "$path" 2>/dev/null | head -5)"
  [ -n "$m" ] && hits="${hits}${m}"$'\n'
done

if [ -n "$hits" ]; then
  echo "⚠ CLINICAL LANGUAGE in $path — this app never names a condition or claims an outcome:" >&2
  printf '%s' "$hits" >&2
  echo "Remove it. The unified anatomy compliance check must fail builds on this vocabulary." >&2
  echo "only automated check on clinical language, and a PostToolUse hook cannot block." >&2
fi
exit 0
