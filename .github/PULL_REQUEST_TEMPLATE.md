## Summary
<!-- What does this PR do and why? 1-3 sentences. -->

## Changes
<!-- Bullet list of what changed. -->
-

## Closes
Closes #

## Test plan
<!-- How was this verified? What did you check? -->

## Pre-merge checklist
- [ ] No `console.log`, `print()`, or debug statements in diff
- [ ] No secrets or credentials in diff
- [ ] `npm run lint` (frontend) / `ruff check backend/app` (backend) pass — both CI-enforced (#30)
- [ ] Verified in-container with `docker compose up` (if backend, Docker, or dependency changes)
- [ ] `npx playwright test` passes (if this PR touches a rendered route/component)
- [ ] Live browser validation completed at relevant responsive breakpoints, with before/after screenshots or notes for rendered UI changes
- [ ] Self-reviewed diff
- [ ] Commit message follows `type(scope): description [#N]`

## Notes
<!-- Trade-offs, follow-ups, known gaps. Delete if empty. -->
