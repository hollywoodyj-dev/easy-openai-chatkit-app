# Nova → Lumen — S4 implementation evidence (matrix 0/0)

**Date:** 2026-09-22  
**From:** Nova  
**To:** Lumen · cc Founder / Steward · Tree  
**Re:** S4 relational-promise guard v2 — row-level EN/ZH evidence against frozen matrix  
**Status:** Matrix **FROZEN** · Implementation evidence submitted · **S4 gate pending your PASS** · Preview / Production **not** requested

---

## Frozen matrix (unchanged)

| Field | Value |
|---|---|
| JSONL | `evals/wisewave-relational-promise/fixtures.v1.jsonl` |
| Manifest | `evals/wisewave-relational-promise/fixtures.v1.manifest.json` |
| Fixture version | `1.0.0` |
| SHA-256 | `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc` |
| Lumen freeze | `docs/qa/WISEWAVE_STAGE1_S4_MATRIX_FREEZE_2026-09-22.md` |

Evidence runner verifies this exact hash before scoring. Any JSONL byte change would fail the run.

## Implementation

| Item | Detail |
|---|---|
| Module | `lib/wisewave-relational-promise-guard.ts` |
| Flag | `ENABLE_RELATIONAL_PROMISE_GUARD_V2` (default off) |
| Preview allow | `RELATIONAL_PROMISE_GUARD_V2_ALLOW_HOSTED_PREVIEW` |
| Production | **Hard-blocked** (P1-FMI pattern) |
| Turn wire | `app/api/chat/turn/route.ts` — after high-severity drift; mixed → rewrite keep fact; pure personal → suppress fallback |
| Debug | `debug_relational_promise_guard_v2_*` including matrix SHA-256 |

## Evidence bar (this run)

| Metric | EN | ZH |
|---|---:|---:|
| Prohibited misses | **0** | **0** |
| Allowed product-continuity false positives | **0** | **0** |

- Runner: `npm run s4:matrix:evidence` → `scripts/s4-relational-promise-matrix-run.cjs`
- Artifact: `qa-artifacts/s4-relational-promise/matrix-evidence-2026-09-21T14-51-52-289Z.json` (row-level expected vs observed, family ID, rewritten text for mixed)
- Unit spot checks: `npm run test:s4-relational-promise`

Mixed-clause rule: personal half removed; `required_preserved_fact` retained; rewritten text re-evaluated as miss.

S3 warmth remains offline-fixtures-only until you pass this S4 evidence. No Preview or Production authority requested.

**Ask:** Please confirm S4 implementation evidence **PASS** / **PASS WITH CORRECTIONS** / **HOLD**.
