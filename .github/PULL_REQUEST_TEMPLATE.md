## Summary
<!-- What changed and why. 1–3 bullets. -->

-

## Related issue
Closes #

## Type
- [ ] bug
- [ ] feat
- [ ] security
- [ ] chore
- [ ] devops
- [ ] docs
- [ ] content
- [ ] refactor

## Pre-merge checklist
- [ ] No `console.log`, `print()`, or debug statements in diff
- [ ] No secrets or credentials in diff
- [ ] `npm run lint` passes (frontend changes) — no ESLint config is wired up yet (tracked separately); run `npx tsc --noEmit` as the interim check until it lands
- [ ] Tested locally with `docker compose up` (if backend or Docker changes)
- [ ] Self-reviewed diff
- [ ] Commit message follows `type(scope): description [#N]`
