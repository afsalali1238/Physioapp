Run the module review packet and report the result.

```bash
echo "### CHANGED";           git -C .. status --short -- anatomy-explorer
echo "### DIFFSTAT";          git -C .. diff --stat HEAD -- anatomy-explorer
echo "### TYPECHECK";         npm run typecheck 2>&1 | tail -25
echo "### BUILD";             npm run build     2>&1 | tail -25
echo "### VALIDATION";        npm run check:anatomy  2>&1 | tail -40
echo "### FIXTURES";          npm run check:fixtures 2>&1 | tail -20
echo "### LIVE APP TOUCHED?"; git -C .. status --short -- ':!anatomy-explorer'
echo "### TREE";              find src -type f | sort
```

Then review the output against the module's acceptance criteria in `handoffs/`, plus these,
which apply to every module regardless of its brief:

- No condition or outcome-claim language anywhere, including comments and identifiers
- Nothing in `../patient-library/` touched — any output on LIVE APP TOUCHED? is stop-and-revert
- No new dependency without a stated bundle cost, licence and reason
- No analytics, no network call, no third localStorage key
- No path completable only by pointer
- No clinical row `published` without `reviewedBy` and `reviewedDate`
- No state held outside `machine.ts`
- No file edited that the module does not own

Report findings ordered by severity, with file paths and concrete fixes. Do not fix anything
until I say so.
