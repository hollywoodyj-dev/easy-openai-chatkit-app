# Milestone H — observation tool (local workspace store)

**Nova v1 — internal only.** JSON files here are the default “Airtable-style” working store (collaborative workflows can copy/export to Notion later).

| File | Purpose |
|------|---------|
| `queue.json` | Queued cases (auto-created) |
| `snapshots.json` | Response + debug snapshots per `caseId` |
| `reviews.json` | Submitted `ObservationReviewLog` entries |
| `real-samples.json` | Anonymized real turns for sampling (optional) |

## Setup

1. Copy `real-samples.example.json` → `real-samples.json` and add anonymized rows (see schema in `lib/milestone-h-observation/storage.ts`).
2. Set `H_OBSERVATION_API_KEY` in production and paste the same value in the UI banner (browser localStorage).
3. Open `/internal/h-observation/queue`.

Committed **example** only; live `queue.json`, `reviews.json`, etc. are gitignored so they stay local/workspace.
