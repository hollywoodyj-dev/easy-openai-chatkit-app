# Milestone H — Lumen 7-case QA follow-up (Nova response)

**Date:** 2026-02-08  
**Context:** Today’s 7-case batch (PASS 4 / REVISE 3 / FAIL 0). Issues: H3 generic/repetitive across rest-guilt, no-reply anxiety, replay loops; H1 weaker than H4; encoding artifacts (`you’re`-style breakage).

## What Nova changed (code)

| Area | Change | Constraints respected |
|------|--------|------------------------|
| **H3 specificity** | Theme buckets (`rest_guilt`, `reply_anxiety`, `replay_ruminate`, `default`) with **3–4 EN/ZH pairs each** (~12 distinct H3 lines vs 2). Selection still deterministic from `seed` + theme. | H3 still only when **user text** shows uncertainty (unchanged). No H4/H5 routing changes. |
| **H1** | **5×5** EN/ZH templates (was 2×2); slightly sharper lines; **ASCII apostrophes** in EN templates. | Same gates (`h1_mild_reflective_insufficient`, kill-list linter, consecutive-turn, E overlap). |
| **Encoding** | New `lib/normalize-model-text.ts`: typographic quotes → ASCII; **U+FFFD contraction repair** (`you` + FFFD + `re` → `you're`). Applied to **assistant main text** (`/api/chat/turn`), **extraction JSON strings** (`wisewave-extract`), **reflection checkpoint summary** (`/api/chat/reflection`). | Does not alter user-supplied messages. |
| **QA marker** | `milestoneHBuildMarker()` → **`milestone_h_v3`**. | — |

## What we did **not** loosen

- Weak / ambiguous suppression, H vs E discipline, H4 lane selection and H4 templates (unchanged).

## Lumen / ops verification

1. Hosted env: confirm `debug_milestone_h_build_marker` (or equivalent) shows **`milestone_h_v3`** after deploy.  
2. Re-run a small set across **rest**, **no-reply**, **replay** user turns — H3 lines should **not** all read as the same “pause / room” generic.  
3. If `you’re`-style artifacts **persist**, capture whether they appear in **main reflection** vs **H line** vs **DB row** — fixes above cover server normalize; a client or export path would need a separate trace.

## Files

- `lib/wisewave-milestone-h-micro-awareness.ts` — H1/H3 v3  
- `lib/normalize-model-text.ts` — punctuation + FFFD repair  
- `app/api/chat/turn/route.ts` — assistant output normalize  
- `lib/wisewave-extract.ts` — extracted fields normalize  
- `app/api/chat/reflection/route.ts` — reflection summary normalize  
