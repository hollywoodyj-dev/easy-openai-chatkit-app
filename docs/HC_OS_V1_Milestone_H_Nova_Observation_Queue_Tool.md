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
| Workspace JSON store | `data/h-observation/` (see `README.md` there) |

## Auth

- Set `H_OBSERVATION_API_KEY` in production.
- Send `x-h-observation-key: <key>` or `Authorization: Bearer <key>`.
- If the env var is **unset**, routes allow access (local dev parity with optional agent-tasks keys).
- Browser UI stores the key in **localStorage** (banner on each screen).

## API (summary)

- `GET/POST /api/internal/h-observation/queue` — list; generate batch (append).
- `PATCH /api/internal/h-observation/queue/[caseId]` — `reviewStatus`.
- `GET /api/internal/h-observation/case/[caseId]` — queue row + snapshot + review.
- `PUT /api/internal/h-observation/snapshot/[caseId]` — save response snapshot (JSON).
- `GET/POST /api/internal/h-observation/review` — list by `?date=`; submit log (`?force=1` overrides strict validation).
- `GET /api/internal/h-observation/summary?date=YYYY-MM-DD`
- `GET /api/internal/h-observation/export?date=&format=markdown|csv|json`
- `POST /api/internal/h-observation/hourly` — alias batch generate (~4 cases).

## Workflow

1. Pull cases — generate queue (hourly or manual).  
2. Queue — status `queued` → `in_review` → `completed` / `skipped`.  
3. Human review — open case, paste snapshot from `/chat` or API if needed, submit log.  
4. Daily summary — suppression ratio, removal distribution, drift counts, verdict counts.  
5. Export — CSV / Markdown / JSON for Tree / archive.

## Real vs scenario sampling

- **Scenarios:** fixed 30-pack in `lib/milestone-h-observation/scenario-pack-data.ts` (Lumen QA lineage).
- **Real:** optional `data/h-observation/real-samples.json` (copy from `real-samples.example.json`). If empty, generator fills placeholder rows until operators add anonymized samples.

## Related docs

- Wisewave observation template: `docs/HC_OS_V1_Milestone_H_Observation_Log_Template_Wisewave.md`
- Lumen QA results / closure: `docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`
- Tree stabilization: `docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`

## One-line Nova brief

Build a lightweight internal observation queue and structured review UI for Milestone H that helps Lumen sample real and scenario cases, log removal-first drift judgments, and view simple containment metrics **without** automating milestone decisions.
