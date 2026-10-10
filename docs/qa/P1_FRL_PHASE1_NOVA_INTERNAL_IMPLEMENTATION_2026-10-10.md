# P1-FRL Phase 1 — Nova internal implementation (Tree B)

**Date:** 2026-10-10 Australia/Sydney  
**From:** NovaInWisewave  
**Decision:** Tree **B — AUTHORIZE PHASE 1 INTERNAL IMPLEMENTATION**  
**Governing plan:** `docs/NOVA_P1_FRL_IMPLEMENTATION_PLAN_2026-09-24.md`  
**Marker:** `p1_reflection_literacy_v1_internal`  
**Flag:** `ENABLE_P1_REFLECTION_LITERACY` (default-off)

```text
INTERNAL + HOSTED PREVIEW (Founder B 2026-10-11)
DEFAULT-OFF
HOSTED PREVIEW: AUTHORIZED (flag + P1_REFLECTION_LITERACY_ALLOW_HOSTED_PREVIEW)
PRODUCTION: HARD-BLOCK
PHASE 2 / CARRY: CLOSED
PHASE 3 / RETURN: CLOSED
P1-FMI: UNCHANGED
S4: INDEPENDENT
P1 TURN HANDOFF: INDEPENDENT
AURORA COPY: LOCKED 2026-10-10
```

## Files changed

| File | Change |
|---|---|
| `lib/wisewave-p1-reflection-literacy.ts` | **New** — enablement, evaluator, EN/ZH replaceable copy constants, debug fields |
| `lib/wisewave-p1-reflection-literacy.test.ts` | **New** — FRL-01…FRL-21 |
| `app/api/chat/turn/route.ts` | Hook after P0/safety; optional literacy appendix; P0 mode withhold; `debug_p1_frl_*` |
| `.env.example` | Document literacy + reserved Carry/Return (not implemented) |
| `package.json` | `test:p1-frl` |
| `AGENTS.md` | Board update |
| This evidence pack | |

**Not changed:** Prisma, `app/chat/page.tsx`, FMI core, S4, P1 Turn Handoff logic, Carry/Return, analytics, `NEXT_PUBLIC_*`.

## Flag resolution

- Local: `ENABLE_P1_REFLECTION_LITERACY=1` → enabled when not Preview/Production.
- `VERCEL_ENV=production` → hard-blocked (Preview allow does **not** unlock Production).
- `VERCEL_ENV=preview` → enabled only with `P1_REFLECTION_LITERACY_ALLOW_HOSTED_PREVIEW=1` (Founder B 2026-10-11).
- No `NEXT_PUBLIC_*`.
Preview authorize: `docs/qa/P1_FRL_FOUNDER_TREE_AUTHORIZE_HOSTED_PREVIEW_2026-10-11.md`.

## Behaviour summary

1. **Genuine bypass** — `classifyFMIInput` → `self_expression|story` + `medium|high` → no literacy; FMI still computed.
2. **Abstract detector** — conservative EN/ZH meta-self patterns; loses to genuine; uncertain → baseline.
3. **First-use window** — `isP0EntryPhase` (turn 1, or turn 2 after greeting/writing-difficulty); prior genuine → withdraw.
4. **One reframe** — window structure yields at most one literacy apply (FRL-19).
5. **One-voice** — `withholdP0ModeAppendix` when reframe applies; P0 safety never withheld.
6. **No persist** — no `wisewave_p1_frl` Message/User/Thread writes; debug response-only.

## Copy

Aurora **COPY LOCK** 2026-10-10 — constants in `lib/wisewave-p1-reflection-literacy.ts` (`P1_FRL_COPY_*`).  
Status: `aurora_copy_locked`.

| Family | EN | ZH |
|---|---|---|
| Advice-Seeking | You don’t need to know what to do here. You can begin with what’s already present: a feeling, a situation, or even not knowing yet. | 在这里，不需要急着知道该怎么做。你可以从眼前已经有的东西开始：一种感受、一件事，甚至只是还不知道。 |
| Abstract Self-Explanation | You don’t need to explain yourself all at once here. You can stay with one thing that feels present, without needing the whole picture to be clear. | 在这里，不需要一次把自己解释清楚。可以先停在此刻比较明显的一点上，不必急着把整个自己说明白。 |

No further copy edits without Aurora + Tree.

## Tests

| Suite | Result |
|---|---|
| `npm run test:p1-frl` | **24/24** (FRL-01…21 + Preview allow/block + Production hard-block) |
| `npm run test:p1-fmi` (FRL-22) | **33/33**, zero FMI core edits |

## Rollback

Unset `ENABLE_P1_REFLECTION_LITERACY` (or revert the five code files). No schema rollback.

## Proposed hosted test plan (not authorized)

When Tree later authorizes Hosted Preview only: local green → Preview allow key + branch → Lumen smoke on FRL-07/08/09/10 + genuine bypass + safety → no Production. **Do not deploy Preview under this gate.**

## Next gate (Tree)

AUTHORIZE HOSTED PREVIEW · HOLD FOR IMPLEMENTATION CORRECTION · HOLD FOR LANGUAGE REVISION · HOLD FOR BOUNDARY REVISION · ROLL BACK
