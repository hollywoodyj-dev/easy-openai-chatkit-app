# Milestone H — Observation queue & logging UI (Nova spec v1)

**HC-OS V1 — observation mode support tool**  
**Owner:** Nova (implementation) · **Consumers:** Lumen, Tree  
**Mode:** Semi-automated support only — **does not** automate milestone judgment.

## Purpose

- Easier, more consistent Milestone H observation (sampling, queue, structured logs, simple metrics).
- **Not** for: auto-close H, auto pass/revise/remove, product analytics dashboard, or widening scope.

## Core rule

> The system may assist observation workflow, but may not replace human drift judgment.

## What ships in-repo

| Area | Location |
|------|-----------|
| Domain types, validation, metrics, scenario pack (30) | `lib/milestone-h-observation/` |
| REST API | `/api/internal/h-observation/*` |
| Minimal UI | `/internal/h-observation` (queue, case review, daily summary) |
| Persistent store | Postgres via Prisma (stable across serverless instances) |

## Auth

- Set `H_OBSERVATION_API_KEY` in production.
- Send `x-h-observation-key: <key>` or `Authorization: Bearer <key>`.
- If the env var is **unset**, routes allow access (local dev parity with optional agent-tasks keys).
- Browser UI stores the key in **localStorage** (banner on each screen).

## API (summary)

- `GET/POST /api/internal/h-observation/queue` — list; generate batch (append).  
  - Optional `?status=queued|in_review|completed|skipped`.  
  - Optional `?benchmarkSet=<id>` — filter rows; use `__passive__` for rows **without** a benchmark set (passive / generated only).
- `POST /api/internal/h-observation/queue/custom` — **benchmark / exact QA rows** (body `{ items: [...] }`).  
  - Each item: `language`, `conversationType`, `signalStrength`, `previewText`, `fullInput`, optional `tags`, `benchmarkSet`, `benchmarkCaseId`, `benchmarkLayer`, `observationMilestone` (e.g. `H`), `runLabel`, `runAt`, `runOwner`, `suiteName`, optional explicit `caseId`.  
  - Either **`caseId`** or **`benchmarkSet` + `benchmarkCaseId`** required. Default `sourceType` is **`benchmark`**.  
  - Derived `caseId` includes a short hash of `fullInput` so the same suite id + case id + text stays stable; re-post **upserts**.
- `PATCH /api/internal/h-observation/queue/[caseId]` — `reviewStatus` and/or `previewText` / `fullInput` (prompt edit only while `queued` | `in_review`).
- `GET /api/internal/h-observation/case/[caseId]` — queue row + snapshot + review.
- `PUT /api/internal/h-observation/snapshot/[caseId]` — save response snapshot (JSON).
- `GET/POST /api/internal/h-observation/review` — list by `?date=` and optional `?benchmarkSet=`; submit log (`?force=1` overrides strict validation).
- `GET /api/internal/h-observation/summary?date=YYYY-MM-DD` — optional `&benchmarkSet=` (same semantics as queue).
- `GET /api/internal/h-observation/export?date=&format=markdown|csv|json` — optional `&benchmarkSet=`.
- `POST /api/internal/h-observation/hourly` — alias batch generate (~4 cases).

### Deploy note (schema)

New queue columns require **`prisma db push`** (or a migration) on the target database before custom rows work in production.

## Workflow

1. **Passive observation** — generate queue (hourly or manual) from scenario pack + trusted real samples.  
2. **Benchmark / exact QA** — `POST /queue/custom` or Queue UI “custom benchmark rows” with the exact prompts; filter list/summary/export by `benchmarkSet` so passive stats do not mix with suite stats.  
3. Queue — status `queued` → `in_review` → `completed` / `skipped`.  
4. Human review — benchmark rows show metadata + exact `fullInput`; editable prompts while not completed. Paste reduced snapshot JSON; **Submit log** auto-persists snapshot when valid and `fullResponseText` is non-empty.  
5. Daily summary — optional benchmark filter (`__passive__` = non-benchmark only).  
6. Export — CSV / Markdown / JSON for Tree / archive (same filters).

## Lumen — first-run QA watchpoints

**Enough for first-run QA.** On pass, ops can move to **half-hour observation blocks** (same tool; tighter cadence than the spec’s hourly default).

| Watch | Notes |
|--------|--------|
| **Queue generation** | Batch append is clean; no duplicate-ID surprises; errors surfaced in UI. |
| **Placeholder vs real** | `sourceType` + `tags` / preview text make placeholders obvious when `real-samples.json` is empty. |
| **Summary date** | Summary filters by **UTC calendar day** of `reviewedAt` — annoying if reviewers expect local midnight without noticing UTC. |
| **Hosted persistence** | Queue/snapshots/reviews are stored in Postgres via Prisma, so cases should not “disappear” between steps even if requests hit different serverless instances. |

## Real vs scenario sampling

- **Scenarios:** fixed 30-pack in `lib/milestone-h-observation/scenario-pack-data.ts` (Lumen QA lineage).
- **Real:** optional `data/h-observation/real-samples.json` (copy from `real-samples.example.json`). If empty, generator fills placeholder rows until operators add anonymized samples.

## Related docs

- Wisewave observation template: `docs/HC_OS_V1_Milestone_H_Observation_Log_Template_Wisewave.md`
- Lumen QA results / closure: `docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`
- Tree stabilization: `docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`

## One-line Nova brief

Build a lightweight internal observation queue and structured review UI for Milestone H that helps Lumen sample real and scenario cases, log removal-first drift judgments, and view simple containment metrics **without** automating milestone decisions.
