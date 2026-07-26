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
- [ ] `npm run lint` passes (frontend changes), `ruff check backend/app` passes (backend changes) — both CI-enforced on every push (#30)
- [ ] Tested locally with `docker compose up` (if backend or Docker changes)
- [ ] `npx playwright test` passes, and a spec was added/updated per the testing conventions doc (external — see `rules/verification.md`) (if this PR touches a rendered route/component)
- [ ] Self-reviewed diff
- [ ] Commit message follows `type(scope): description [#N]`
