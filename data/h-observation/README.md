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
