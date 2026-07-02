# Wisewave Semantic Governance Infrastructure — Nova Implementation Plan v1

**Date:** 2026-07-03
**Author:** Nova
**For review by:** Tree (per Semantic Governance Lock v1, Operational status item 5)
**Governing docs:** `docs/Wisewave_Semantic_Governance_Lock_v1.md`, `docs/Wisewave_Semantic_Implementation_Directive_v1.md`
**Status:** DRAFT — awaiting Tree approval before any code is written

---

## 0. What this plan is and is not

This plan covers **only** the five governance-infrastructure prerequisites the Lock allows:
Phrase Registry, surface permission map, distortion checks, deployment validation, escalation path.

It makes **zero public copy changes**. No wording on any page, metadata field, or store
listing changes as a result of executing this plan. CTA verb unification, schema category
fields, store metadata, homepage IA, and SEO title changes remain frozen until Tree
declares the infrastructure active.

---

## 1. Phrase Registry

**File:** `lib/semantic-governance/phrase-registry.json` (versioned, human-readable, diff-reviewable in git)
**Types + loader:** `lib/semantic-governance/phrase-registry.ts`

Each entry:

```json
{
  "phrase": "reflection without advice",
  "layer": "identity",
  "allowed_surfaces": ["*"],
  "prohibited_surfaces": [],
  "distortion_flags": [],
  "owner": "Tree",
  "approval_state": "approved",
  "review": null,
  "notes": "Identity anchor per Governance Lock v1"
}
```

Field rules (mirroring the Lock exactly):

- `layer`: `identity` | `category` | `discovery`
- `allowed_surfaces` / `prohibited_surfaces`: surface IDs from the surface map (§2); `"*"` = all
- `distortion_flags`: subset of `assistant_drift`, `therapy_drift`, `coaching_drift`, `productivity_drift`, `emotional_support_drift`
- `approval_state`: `approved` | `experimental` | `escalated` | `rejected`
- `review`: required (ISO date) when `approval_state` is `experimental`; otherwise null
- Optional `pairing_required: true` — encodes the `Reflection AI` rule: on identity-sensitive surfaces the phrase must co-occur with an identity anchor

**Seed content (v1, no new phrases invented — inventory of what is already live):**

- **Identity anchors (approved, owner Tree):** reflection without advice · low-presence reflection space · reflects rather than advises · not an assistant · not a therapist · not a coach
- **Category (approved bridge, pairing_required, flags: all five):** Reflection AI
- **Discovery (existing live SEO/paid phrases, recorded as-is for classification, owner Tree, approval state `approved` because already shipped pre-Lock):** self-reflection app · AI reflection · journaling alternative · quiet reflection · a quieter space to think · less advice, more room — sourced from `lib/wisewave-site/wisewave-landing-copy.ts`, `wisewave-paid-landing-copy.ts`, `wisewave-marketing-seo-metadata.ts`, and the live page set

Nova does **not** add any phrase not already shipped. If inventory turns up a live phrase
whose classification is unclear, it enters the registry as `escalated` and goes to Tree —
it is not removed from the site (that would be a public copy change) and not silently approved.

## 2. Surface permission map

**File:** `lib/semantic-governance/surface-map.ts`

Two tiers per the Lock, with concrete route/file mapping:

| Surface ID | Tier | Concrete location |
|---|---|---|
| `homepage` | identity-sensitive | `app/(wisewave-site)/page.tsx` |
| `onboarding` | identity-sensitive | `/start`, `pages/login.tsx`, signup flows |
| `product_interior` | identity-sensitive | `/chat`, `app/subscribe`, in-app copy |
| `source_of_truth_docs` | identity-sensitive | `AGENTS.md`, governance docs |
| `internal_specs` | identity-sensitive | `docs/*` product/design specs |
| `paid_landing` | acquisition-sensitive | `app/(wisewave-site)/lp/*` (`is-paid-lp-path.ts` already exists) |
| `seo_landing` | acquisition-sensitive | `/reflection-ai`, `/self-reflection-app`, `/journaling-alternative`, `/reflection-without-advice`, `/quiet-reflection`, etc. |
| `store_metadata` | acquisition-sensitive | `docs/Wisewave_App_Store_and_Play_Listing_Copy_v1.md`, `mobile/app.json` |
| `comparison_pages` | acquisition-sensitive | `/reflection-without-advice-vs-coaching` |
| `external_materials` | acquisition-sensitive | press/partner docs (manual, not lintable) |

The map exports `getSurfaceForPath(path)` so validation (§4) can classify a source file
automatically, plus the tier rule: identity-sensitive surfaces are identity-primary and
enforce the pairing rule for category-layer phrases.

## 3. Distortion phrase checks

**File:** `lib/semantic-governance/distortion-check.ts` (+ `distortion-check.test.ts`, Vitest — same pattern as the existing drift linter `lib/drift/linter.ts`)

Pattern lists for the six rejection classes from the Lock:

1. therapist / treatment / diagnosis framing (e.g. "therapy", "treat", "diagnose", "mental health treatment")
2. coach / mentor / advisor framing ("your coach", "we advise", "guidance plan")
3. assistant / task-completion framing ("your AI assistant", "gets things done")
4. companion / emotional-substitution framing ("your companion", "always there for you")
5. productivity / optimization framing ("boost productivity", "optimize your life")
6. instruction / prescription / advice-giving framing ("we'll tell you what to do", "personalized advice")

Behavior: **flag, never rewrite.** Output = file, line, matched class, matched text.
Existing legitimate negations ("not a therapist", "no advice") are allowlisted via
negation-context detection (the phrase is fine when it appears inside an approved
identity anchor or an explicit "not / without / never" frame — this is exactly the
`/what-it-is-not` page's job).

English first; ZH patterns added in a v1.1 pass after EN is stable (matches the repo's
EN/ZH parity approach elsewhere).

## 4. Deployment validation

**Script:** `scripts/semantic-governance-check.mjs`
**npm script:** `npm run semantic:check`

What it validates, over marketing copy sources (`lib/wisewave-site/*.ts`,
`app/(wisewave-site)/**/page.tsx`, paid LP copy, store copy doc):

1. **Distortion scan** (§3) — any hit on a non-allowlisted pattern = fail.
2. **Pairing rule** — on identity-sensitive surfaces, `Reflection AI` must not appear
   without an identity anchor in the same source file. (Today it appears only on
   acquisition surfaces — `/reflection-ai`, `/lp/ai-reflection` — so this should pass
   with zero changes; the check exists to prevent future drift.)
3. **Registry coverage (warn-level in v1)** — headline/H1/title-level phrases should map
   to a registry entry; unregistered headline phrases produce a warning list for Tree
   review rather than a hard failure, because retroactively hard-failing existing copy
   would force copy changes, which are frozen.

Runs standalone; **not** wired into `npm run build` in v1 (a red build must not pressure
anyone into unreviewed copy edits — the failure path is escalation, not hotfix). Tree can
promote it to a build gate once the registry has settled.

## 5. Escalation path

**Doc:** `docs/Wisewave_Semantic_Escalation_Path_v1.md` (short, procedural)

- **Proposer** (Nova, steward, or agents) drafts registry entry with proposed layer,
  surfaces, flags → `approval_state: "escalated"`.
- **Tree** rules on layer/surface/approval (with Aurora for category/identity questions).
- Mandatory escalation triggers (verbatim from the Lock): any wording changing user
  expectation of role, authority, emotional relationship, or intended outcome; any
  adjacent copy pulling `Reflection AI` toward a distortion flag; any bounded experiment
  (requires expiry + surface limits + measurement criteria per rule 7).
- Nothing ships while `escalated`. `experimental` entries carry a review date; expired
  entries fail `semantic:check`.

## 6. Sequencing and effort

| Step | Deliverable | Est. |
|---|---|---|
| 1 | Tree approves this plan (gate) | — |
| 2 | Surface map + registry types + seed registry (inventory only) | small |
| 3 | Distortion check + tests | small–medium |
| 4 | `semantic:check` validation script + npm wiring | small |
| 5 | Escalation path doc | small |
| 6 | Report to Tree: registry contents, any `escalated` inventory items, check output on current site | — |

Total: roughly one working session once approved. All net-new files under
`lib/semantic-governance/` + one script + one doc; no existing public copy touched.

## 7. Explicit non-goals (restating the freeze)

Executing this plan does **not**: change any Identity Layer language; move `Reflection AI`
onto any identity-sensitive surface; unify CTA verbs; mount `SoftwareApplicationJsonLd`
or add category fields to it; change store metadata, homepage IA, or SEO titles; add any
new Discovery phrase to any public surface.

---

*Nova — submitted for Tree review per Governance Lock v1, operational status item 5.*
