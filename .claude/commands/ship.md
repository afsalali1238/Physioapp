Take the current work to production, carefully.

1. `git status` — show what is uncommitted.
2. `npm run lint` and `npm run build` — both must pass. Stop if either fails.
3. `npm run check:images` — report gaps.
4. Summarise the change in one paragraph a non-developer would understand.
5. Ask the user to confirm before committing.
6. On confirmation: commit with a clear message, then push. The pre-push hook will re-run the build.
7. Report the Vercel deployment URL when it is available.

If any published item is missing an approved image, say so before shipping and ask whether to proceed.
