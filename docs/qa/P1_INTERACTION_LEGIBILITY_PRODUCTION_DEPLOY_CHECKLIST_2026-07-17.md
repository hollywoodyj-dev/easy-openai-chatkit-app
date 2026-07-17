# P1 Interaction Legibility — Production Deploy Checklist

**Date:** 2026-07-17  
**Authority:** `docs/Wisewave_Tree_Decision_P1_Interaction_Legibility_Production_Rollout_2026-07-17.md`  
**Observation window:** 2026-07-17 → 2026-07-31 review

---

## Nova pre-deploy confirmation

| # | Check | Status |
|---|--------|--------|
| 1 | Production env will contain **both** `NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY=1` and `NEXT_PUBLIC_P1_INTERACTION_LEGIBILITY_ALLOW_PRODUCTION=1` | Steward |
| 2 | P1.1 remains disabled (no P1.1 UI or invitation copy in codebase render path) | **Confirmed** — excluded constant only; not rendered |
| 3 | P1.2 unchanged | **Confirmed** — no P1.2 behaviour |
| 4 | GR-1 unchanged | **Confirmed** — no `lib/drift/rules.ts` changes in slice |
| 5 | Deployed commit matches Lumen-tested implementation | **Confirmed** — slice in `3a228eb` (`main`); Lumen PASS on `8b24d1a` (same client slice) |
| 6 | Rollback via flag removal only | **Confirmed** — client-only; no DB |

**Implementation files:**

- `lib/wisewave-p1-interaction-legibility.ts`
- `lib/wisewave-p1-interaction-legibility.test.ts`
- `app/chat/page.tsx` (`InteractionLegibilityPreview`)

**Not changed:** `app/api/chat/turn`, system prompts, analytics.

---

## Steward — Vercel Production env

Project → Settings → Environment Variables → **Production**:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY` | `1` |
| `NEXT_PUBLIC_P1_INTERACTION_LEGIBILITY_ALLOW_PRODUCTION` | `1` |

Do **not** set any P1.1 flags. Redeploy Production after saving.

`NEXT_PUBLIC_VERCEL_ENV=production` is normally injected by Vercel on Production builds.

---

## Post-deploy smoke (Production)

On `https://www.wisewave.io/chat` (fresh empty thread):

- [ ] `[data-testid="p1-interaction-legibility-preview"]` present
- [ ] Authorized EN or ZH static block above input
- [ ] No P1.1 invitation line
- [ ] Typing hides block
- [ ] After first user message, block stays gone

**Unit gate (local):** `npm run test:p1-interaction-legibility`

---

## Rollback

1. Remove or unset `NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY` on Production (and/or `ALLOW_PRODUCTION`)
2. Redeploy Production

No database or backend rollback required.

---

## Observation holds (until 2026-07-31)

- No copy changes
- No chips/buttons/interactions
- No P1.1
- No layer merge
- No click/session optimization
