# Wisewave Semantic Governance Infrastructure — Nova Implementation Report

**Date:** 2026-07-03  
**Author:** Nova  
**For:** Tree (post-approval delivery per Governance Lock v1.1)  
**Approval:** Tree 2026-07-03 — infrastructure only; public language frozen

---

## 1. Files changed (new — no public copy modified)

| Path | Purpose |
|------|---------|
| `lib/semantic-governance/surface-map.ts` | Surface permission map (identity vs acquisition tiers) |
| `lib/semantic-governance/phrase-registry.json` | Phrase Registry seed (live inventory only) |
| `lib/semantic-governance/phrase-registry.ts` | Registry types + loader helpers |
| `lib/semantic-governance/distortion-check.ts` | EN distortion guardrail scan (negation/boundary-aware) |
| `lib/semantic-governance/distortion-check.test.ts` | Unit tests for distortion allowlisting |
| `lib/semantic-governance/validate-marketing-copy.ts` | Orchestrator: distortion + pairing + warnings |
| `lib/semantic-governance/semantic-governance-check.test.ts` | Live-site integration check (`semantic:check`) |
| `scripts/semantic-governance-check.cjs` | Standalone CLI wrapper (not build gate) |
| `docs/Wisewave_Semantic_Escalation_Path_v1.md` | Escalation procedure |
| `docs/Wisewave_Semantic_Governance_ZH_Parity_Followup.md` | ZH distortion placeholder (Tree condition 5) |
| `docs/Wisewave_Semantic_Governance_Infrastructure_Report_2026-07-03.md` | This report |
| `package.json` | `semantic:check`, `test:semantic-governance` scripts |
| `docs/Wisewave_Semantic_Governance_Infrastructure_Implementation_Plan_v1.md` | Status → approved / complete |

**Confirmation:** zero edits to `app/(wisewave-site)/**`, `lib/wisewave-site/*` marketing copy, store listing copy in repo pages, homepage IA, SEO titles, CTA verbs, or mounted schema.

---

## 2. Registry contents summary

### Identity anchors (3)

| Phrase | approval_state |
|--------|----------------|
| reflection without advice | approved |
| low-presence reflection space | approved |
| reflects rather than advises | approved |

### Misclassification boundaries (3)

| Phrase | approval_state |
|--------|----------------|
| not an assistant | approved |
| not a therapist | approved |
| not a coach | approved |

### Category bridge terms (1)

| Phrase | pairing_required | distortion_flags | approval_state |
|--------|------------------|------------------|----------------|
| Reflection AI | **yes** | assistant, therapy, coaching, productivity, emotional_support (all five) | approved |

### Discovery phrases — grandfathered live inventory (7)

| Phrase | approval_state | Notes |
|--------|----------------|-------|
| self-reflection app | approved | Grandfathered — not permanent endorsement |
| AI reflection | approved | Grandfathered |
| journaling alternative | approved | Grandfathered |
| quiet reflection | approved | Grandfathered |
| self reflection without guidance | approved | Grandfathered |
| reflection without guidance | approved | Grandfathered |

### Prohibited / rejected (0)

No entries in `rejected` state. Distortion patterns reject affirmative role framing at scan time; no phrase is permanently banned in registry yet.

### Escalated inventory (2)

| Phrase | Live location | Pending question |
|--------|---------------|------------------|
| A quieter space to hear your own thinking | Homepage hero (`wisewave-landing-copy.ts`) | Identity-adjacent vs discovery — layer classification |
| Reflection AI without taking over | `/reflection-ai` H1 | Category/discovery boundary variant |

---

## 3. Current `semantic:check` result

```
npm run semantic:check
```

**2026-07-03 run:**

- **Scanned:** 40 marketing copy files
- **Errors:** 0
- **Warnings:** 5
- **Result:** **PASS**

---

## 4. Warnings / escalated inventory

### Escalated (registry — Tree ruling required)

1. **A quieter space to hear your own thinking** — homepage hero; identity-adjacent wording not in the three approved identity anchors.
2. **Reflection AI without taking over** — `/reflection-ai` H1; category phrase variant.

### Acquisition identity-anchor gaps (warn-only v1)

Per Lock v1.1 (“where surface constraints allow, identity anchors should remain present”):

| File | Note |
|------|------|
| `app/(wisewave-site)/lp/ai-reflection/page.tsx` | Paid LP — category/discovery without identity anchor string in same file |
| `app/(wisewave-site)/self-reflection-without-guidance/page.tsx` | SEO satellite — same |
| `app/(wisewave-site)/terms/page.tsx` | Classified acquisition via SEO glob — same (informational; not a copy change target under freeze) |

These are **warnings only** in v1 — not failures — so they do not pressure copy edits.

---

## 5. Confirmation — no public copy changed

Nova implemented **governance infrastructure only**:

- No CTA verb unification
- No schema category fields mounted
- No store metadata changes
- No homepage IA / category copy edits
- No SEO title changes
- No public copy expansion

All live wording unchanged; registry records what is already shipped.

---

## 6. Build-gate promotion recommendation

**Recommendation: keep `semantic:check` standalone for at least one Tree review cycle after escalated inventory is resolved.**

| Factor | Rationale |
|--------|-----------|
| Escalated items | 2 live phrases need Tree layer rulings before registry is “settled” |
| Warn-only acquisition gaps | 3 files flagged — promoting to build gate could create pressure to edit copy for warnings |
| EN allowlist tuning | First pass needed boundary-context heuristics (comparison pages, FAQ negations, “what it is not” sections); stable but young |
| ZH not scanned | ZH parity not in v1 — build gate should wait until EN + registry + ZH scope are agreed |

**Suggested promotion criteria (for Tree):**

1. Escalated inventory entries resolved (`approved` or explicit grandfathered ruling).
2. One clean hosted observation cycle with no new distortion regressions.
3. Tree confirms warn-only acquisition warnings are acceptable as warnings or registry entries added without copy changes.
4. Optional: ZH v1.1 pass complete or explicitly deferred with EN-only gate documented.

Until then: **`npm run semantic:check` standalone; failures → escalation path; not wired into `npm run build`.**

---

## 7. How to run

```bash
npm run semantic:check          # full live marketing scan + report
npm run test:semantic-governance  # distortion unit tests only
```

Escalation: `docs/Wisewave_Semantic_Escalation_Path_v1.md`  
ZH follow-up: `docs/Wisewave_Semantic_Governance_ZH_Parity_Followup.md`

---

*Nova — Semantic Governance Infrastructure v1 delivered under Tree approval 2026-07-03.*

---

## Addendum — Tree acceptance + layer rulings (2026-07-05)

**Delivery accepted:** commit `4684b17` = Semantic Governance Infrastructure v1 **complete** (infrastructure only; no public copy changed).

**Layer rulings applied in `phrase-registry.json` v1.0.1:**

| Phrase | Tree ruling | Registry update |
|--------|-------------|-----------------|
| A quieter space to hear your own thinking | Meaning Layer / Public Positioning — **approved with watchpoint** | `approval_state: approved`; watchpoint flags: emotional_support, productivity; no copy edit |
| Reflection AI without taking over | Category Layer / Public Positioning — **approved with caution** | `layer: category`; `approval_state: approved`; all five distortion flags; no copy edit |

**Build gate:** remain **standalone** until (1) one clean observation cycle, (2) warn-only acquisition identity-anchor gaps reviewed, (3) EN registry stable, (4) ZH parity scoped or deferred.

**Escalated inventory:** **cleared** (0 entries in `escalated` state).
