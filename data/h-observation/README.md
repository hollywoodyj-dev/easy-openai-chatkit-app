# Milestone H — observation tool (real samples + DB-backed workflow)

**Nova v1 — internal only.** Queued cases, snapshots, and review logs are stored in the app’s **Postgres** database (via Prisma) so they persist across serverless instances.

The JSON files in this folder are mainly for **sampling inputs** (optional).

| File | Purpose |
|------|---------|
| `real-samples.json` | Optional anonymized real turns for sampling |

## Setup

1. Copy `real-samples.example.json` → `real-samples.json` and add anonymized rows.
2. Set `H_OBSERVATION_API_KEY` in production and paste the same value in the UI banner (browser localStorage).
3. Open `/internal/h-observation/queue`.

## “Real” row trust rule (important)

The queue generator only treats a `real-samples.json` row as `sourceType: "real"` when its `fullInput` looks like actual anonymized user text.

If a row still contains placeholder/template strings (for example the defaults in `real-samples.example.json`), it is considered untrusted and will be excluded from `sourceType: "real"` sampling. In that case, the queue fills the remaining slots with `sourceType: "scenario"` cases.

## Benchmark / exact QA rows (no JSON file required)

For **fixed prompt sets** (e.g. daily-7 / regression-14 / confidence-25), use **`POST /api/internal/h-observation/queue/custom`** or the **Custom benchmark rows** panel on `/internal/h-observation/queue`. Rows are stored in Postgres with `sourceType: benchmark` and optional `benchmarkSet`, `benchmarkCaseId`, `benchmarkLayer`, `observationMilestone`, run metadata, etc. Summary and export accept `benchmarkSet` (or `__passive__` to exclude benchmark rows).
