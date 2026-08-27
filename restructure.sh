#!/usr/bin/env bash
# Split pshyapp into patient-library/ and anatomy-explorer/
#
# RUN THIS YOURSELF, IN GIT BASH, AT THE REPOSITORY ROOT.
# Do not run it through an agent or the Claude device bridge — git write
# operations fail on that mount (.git/index.lock is not writable).
#
# Read STOP NOTES below before running. Then run step by step, not all at once.

set -euo pipefail
cd "$(dirname "$0")"

# ---------------------------------------------------------------------------
# STOP NOTES — read before running
# ---------------------------------------------------------------------------
# 1. astro.config.mjs and eslint.config.mjs are deleted deliberately (your call,
#    2026-08-26). This script RECORDS those deletions rather than restoring them.
#    Consequences you are accepting:
#      - No @astrojs/vercel adapter  -> Astro builds plain static output.
#        Confirm your Vercel project still deploys correctly without it.
#      - No @astrojs/sitemap         -> no sitemap.xml on the live site.
#      - Vercel webAnalytics was enabled in that config; removing it actually
#        brings the app back in line with D-007 (no analytics, no tracking).
#      - npm run lint NOW FAILS: "ESLint couldn't find an eslint.config.* file".
#        CI runs `npm run lint`, so CI is red until you either restore the
#        config or drop the lint step. Step 4 below flags it; decide there.
# 2. Step 5 (Vercel root directory) is a dashboard change and MUST happen
#    before your next push, or the live site breaks.
# ---------------------------------------------------------------------------

step0_unblock() {
  echo "== Step 0 · clear the stale lock and stray file =="
  # A crashed git process left a 0-byte lock on 26 Aug 10:17. Nothing is running.
  [ -f .git/index.lock ] && rm -f .git/index.lock && echo "removed stale .git/index.lock"
  # Stray probe file left by the bridge session; it could not delete it itself.
  [ -f .git-probe-test.txt ] && rm -f .git-probe-test.txt && echo "removed .git-probe-test.txt"
  git status --short
}

step1_baseline() {
  echo "== Step 1 · record deliberate deletions, commit a clean baseline =="
  git rm -q --ignore-unmatch astro.config.mjs eslint.config.mjs
  git rm -q --ignore-unmatch add-hip.mjs add-knee.mjs add-lowerback.mjs add-more.mjs
  git add -A
  git commit -m "chore: retire astro/eslint configs and one-off content scripts"
}

step2_baseline_new_app() {
  echo "== Step 2 · baseline anatomy-explorer before it moves =="
  git add anatomy-explorer
  git commit -m "anatomy-explorer: baseline before restructure"
}

step3_move() {
  echo "== Step 3 · move the live app, with history =="
  mkdir -p patient-library

  git mv .claude .claudeignore .prettierrc \
         AGENTS.md BUILD-PLAN.md CLAUDE.md HANDOFF.md PRD.md README.md memory.md \
         tsconfig.json package.json package-lock.json \
         src public scripts docs prototype build-artifacts \
         add-lowerback.js test.csv \
         patient-library/

  # Untracked / ignored — no history to preserve, plain mv.
  for p in .astro .env .env.local .vercel dist node_modules gen-desktop-csv.mjs; do
    [ -e "$p" ] && mv "$p" patient-library/ && echo "moved $p"
  done

  echo "== Step 3b · new root boundary files =="
  mv _new-root/README.md _new-root/AGENTS.md _new-root/CLAUDE.md .
  rmdir _new-root

  echo "== Step 3c · retire the redundant 23 Aug snapshots =="
  # 57 files, 50 byte-identical to live, 7 strictly older, 0 unique.
  # All tracked, so history is already the archive.
  git rm -r --quiet _to_delete
  git commit -m "chore: retire redundant 23 Aug doc snapshots (recoverable from history)"
}

step4_ci() {
  echo "== Step 4 · point CI at patient-library =="
  echo "EDIT .github/workflows/ci.yml BY HAND:"
  cat <<'YAML'
  jobs:
    build-and-test:
      runs-on: ubuntu-latest
      defaults:
        run:
          working-directory: patient-library
      steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: patient-library/package-lock.json
      # ...rest unchanged
YAML
  echo
  echo "ALSO: the 'Lint' step runs 'npm run lint', which fails with no"
  echo "eslint.config.mjs. Either restore that file or remove the Lint step."
}

step6_verify() {
  echo "== Step 6 · verify both apps =="
  ( cd patient-library  && npm run build )
  ( cd anatomy-explorer && npm run build )
  echo "--- git status: expect RENAMES (R), not deletions + additions ---"
  git status
}

step7_commit() {
  echo "== Step 7 · commit =="
  git add -A
  git commit -m "refactor: move patient exercise site into patient-library/"
  echo "DO NOT PUSH until the Vercel Root Directory is set to 'patient-library'."
}

case "${1:-}" in
  0|step0) step0_unblock ;;
  1|step1) step1_baseline ;;
  2|step2) step2_baseline_new_app ;;
  3|step3) step3_move ;;
  4|step4) step4_ci ;;
  6|step6) step6_verify ;;
  7|step7) step7_commit ;;
  *)
    echo "Run one step at a time:"
    echo "  ./restructure.sh 0   clear stale lock + stray file"
    echo "  ./restructure.sh 1   record deletions, clean baseline commit"
    echo "  ./restructure.sh 2   baseline anatomy-explorer"
    echo "  ./restructure.sh 3   the move (+ boundary files, + retire _to_delete)"
    echo "  ./restructure.sh 4   prints the CI edit to make by hand"
    echo "  -- Step 5 is the Vercel dashboard. Do it before pushing. --"
    echo "  ./restructure.sh 6   build both apps, check for renames"
    echo "  ./restructure.sh 7   final commit"
    ;;
esac
