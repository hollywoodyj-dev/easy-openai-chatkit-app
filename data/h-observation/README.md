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
