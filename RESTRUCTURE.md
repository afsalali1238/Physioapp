# Restructure — separating the two apps

Moves the live patient exercise site into `patient-library/` so agent work on
`anatomy-explorer/` cannot reach it.

**Run every command yourself, in Git Bash, at the repository root.** Do not delegate this to an
agent, and do not run it through Claude's device bridge — git operations fail there
(`.git/index.lock` is not writable over the mount) and a half-finished `git mv` is a bad place
to be.

Read all of it before running any of it.

---

## Before you start

`astro.config.mjs` and `eslint.config.mjs` are currently deleted from the working tree but still
tracked. They carry the Vercel adapter and sitemap integration for the **live** site. Step 1
restores them. If you deleted them deliberately, stop and tell me before running this.

---

## Step 1 · Repair, then commit a clean baseline

```bash
cd /c/Users/HP/Desktop/antigravity/pshyapp

# restore the two configs that went missing
git checkout -- astro.config.mjs eslint.config.mjs

# confirm they are back and the live app still builds
ls astro.config.mjs eslint.config.mjs
npm run build

# record the deliberate deletions of the one-off content scripts
git rm -q add-hip.mjs add-knee.mjs add-lowerback.mjs add-more.mjs

git add -A
git commit -m "chore: restore configs, retire one-off content scripts"
```

If `npm run build` fails here, **stop**. Fix that before restructuring — you do not want a broken
build and a moved tree at the same time.

## Step 2 · Baseline the new app before it moves anywhere

```bash
git add anatomy-explorer
git commit -m "anatomy-explorer: baseline before restructure"
```

## Step 3 · Move the old app, with history

```bash
mkdir patient-library

git mv .claude .claudeignore .prettierrc \
       AGENTS.md BUILD-PLAN.md CLAUDE.md HANDOFF.md PRD.md README.md memory.md \
       astro.config.mjs eslint.config.mjs tsconfig.json \
       package.json package-lock.json \
       src public scripts docs prototype build-artifacts \
       add-lowerback.js test.csv \
       patient-library/
```

Then the untracked and ignored ones, which have no history to preserve:

```bash
mv .astro .env .env.local .vercel dist node_modules gen-desktop-csv.mjs patient-library/
```

## Step 3b · Put the new root boundary files in place

Three files are staged in `_new-root/`: a root `README.md` explaining the two apps, and
`AGENTS.md` / `CLAUDE.md` telling every agent that `patient-library/` is off limits. The old
copies of those three moved into `patient-library/` in Step 3, so there is nothing to overwrite.

```bash
mv _new-root/README.md _new-root/AGENTS.md _new-root/CLAUDE.md .
rmdir _new-root
```

## Step 3c · Retire the redundant snapshots

`_to_delete/` looks like several old versions of the app. It is not. I compared every file in it
against its live counterpart by content hash:

    57 files · 50 byte-identical to live · 7 older ancestors of live · 0 unique

The three folders inside it (`physio-platform/`, `stale-docs-dupes/`, `u/physio-platform/`) are
the same 23 August documentation snapshot copied three times, plus two zips (`_transfer.zip`,
`update.zip`) containing that same tree again. The 7 that differ are strictly older — the live
`memory.md` is 198 lines against their 119, the live `IMAGE-PIPELINE.md` gained a section, the
live `README.md` was renamed and expanded.

All 59 of those files are tracked in git, so **history is already your archive.** Keeping a copy
in the working tree buys nothing and guarantees an agent will one day read the stale one.

```bash
git rm -r --quiet _to_delete
git commit -m "chore: retire redundant 23 Aug doc snapshots (all recoverable from history)"
```

If you would rather keep them visible, do this instead and skip the `git rm`:

```bash
mkdir -p archive
git mv _to_delete archive/2026-08-23-doc-snapshot
```

Either way it does **not** move into `patient-library/` — remove it from the Step 3 `git mv` list
before running that step.

## Step 4 · Fix the CI working directory

`.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, `npm run sync:content` and
`npm run build` at the repository root. Add a `defaults` block to the job so they run in the new
folder, and point the npm cache at the moved lockfile:

```yaml
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
```

## Step 5 · Change the Vercel root directory — do this BEFORE your next push

Vercel dashboard → the project → **Settings → General → Root Directory** → set to
`patient-library` → Save.

**This is the step that breaks the live site if you skip it.** Vercel builds from the repository
root by default; after the move there is no app there. Change the setting first, then push.

## Step 6 · Verify both apps

```bash
cd patient-library  && npm run build && cd ..
cd anatomy-explorer && npm run build && cd ..
git status
```

`git status` should show renames, not deletions plus additions. If it shows deletions, the
`git mv` did not take and you should `git reset --hard HEAD` and start again from Step 3.

## Step 7 · Commit

```bash
git add -A
git commit -m "refactor: move patient exercise site into patient-library/"
```

Push only after Step 5 is done.

---

## What is left at the root afterwards

```
pshyapp/
├── .git/
├── .github/            CI, now scoped to patient-library
├── .gitignore          covers both apps — patterns match at any depth, no change needed
├── .vscode/
├── AGENTS.md           NEW — the boundary, read by every agent
├── CLAUDE.md           NEW — same, for Claude Code
├── README.md           NEW — what the two apps are
├── patient-library/    the live site. Off limits to agent work.
└── anatomy-explorer/   the new app. All development happens here.
```

Optionally `archive/2026-08-23-doc-snapshot/` if you kept the snapshots instead of removing them.

**What is NOT here, and should not be:** `~/Desktop/antigravity/physio` is **Med-Arabic-Hub**, a
completely separate product — a 12-week Medical Arabic course for physiotherapists, React +
TanStack Router, spaced repetition, Arabic TTS. It shares a clinical audience with this repo and
nothing else. It stays where it is.

## What this does not fix

Agents that ignore instructions. The boundary files at root help, and the `ROOT TOUCHED?` line in
the review packet catches it after the fact, but the only hard guarantee is that you check
`git status -- ':!anatomy-explorer'` after every module and revert anything that shows up there.
That is how `astro.config.mjs` went missing without anyone noticing.
