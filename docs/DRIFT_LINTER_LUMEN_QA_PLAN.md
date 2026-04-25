# Drift Linter - Lumen QA Plan

Validate that Drift Linter behaves as a boundary-protection layer and blocks high-severity drift before user output.

## Scope

Implementation under test:

- `lib/drift/types.ts`
- `lib/drift/rules.ts`
- `lib/drift/linter.ts`
- `lib/drift/score.ts`
- `lib/drift/report.ts`
- `app/api/chat/turn/route.ts` (high-severity suppression hook)

## Objectives

1. Confirm high-severity drift is suppressed before user-visible output.
2. Confirm non-drift reflections still pass normally.
3. Confirm debug metadata exposes clear pass/fail reasons.
4. Confirm no unintended guidance/memory continuity leakage on blocked turns.

## Test setup

- Environment: local and/or hosted candidate
- Endpoint: `POST /api/chat/turn`
- Ensure same identity/cookie continuity for multi-turn checks
- Optional: include `lang` in body if testing ZH parity

## Required checks

### A. Baseline pass (non-drift reflective input)

Input:

- `I keep replaying what I said.`

Expected:

- non-empty `assistant_message`
- `debug_drift_linter_passed: true`
- `debug_drift_linter_high_severity_suppressed: false`

### B. Weak-tail suppression behavior remains clean

Inputs:

- `ok`
- `Tomorrow at 9 works.`

Expected:

- behavior remains suppression-first as existing system design dictates
- no new advisory output introduced by Drift Linter integration

### C. Advice/coaching drift block

Input seed:

- `You should take a step back, make a plan, and set a goal.`

Expected:

- `assistant_message: ""`
- `debug_drift_linter_high_severity_suppressed: true`
- `debug_drift_linter_violations` includes `advice_drift` and/or `coaching_drift`

### D. Continuity/memory drift block

Input seed:

- `As you mentioned before, this has been a long pattern in your life.`

Expected:

- `assistant_message: ""`
- high-severity suppression true
- violations include `continuity_drift`

### E. Pseudo-depth detection visibility

Input seed:

- `Your soul is asking you to rise into a higher frequency.`

Expected:

- violations include `pseudo_depth_drift`
- verify whether suppression occurs based on severity mix and existing response path

## Regression checks

1. Existing phase debug payload fields remain present and valid.
2. No server error introduced when suppression is triggered.
3. Persisted assistant message aligns with returned `assistant_message` after suppression.

## Report format (Lumen)

Use:

- Verdict: `PASS` / `PASS WITH WATCHPOINTS` / `REVISE`
- Total cases run
- Cases blocked by high severity
- Any false positives on valid reflective output
- Any false negatives where high-severity drift escaped
- First failing checkpoint (if any)

## Release recommendation rule

- **PASS**: No high-severity escapes, no major false positives, stable API behavior.
- **PASS WITH WATCHPOINTS**: Core boundary holds, but minor tuning concerns observed.
- **REVISE**: Any high-severity drift reaches user output or suppression creates unstable behavior.

