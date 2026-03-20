# Lumen QA results — Milestone E2

Plan reference: `docs/HC_OS_V1_Milestone_E2_Lumen_QA_Plan.md`

---

## Pass 1 — Recurrence credibility (local)

| Field | Value |
|--------|--------|
| **Environment** | Local E2 build, `http://127.0.0.1:3000` |
| **Result** | **Pass** |
| **Date** | (as reported by Lumen) |

### Confirmed behavior

1. **Fresh session, first strong continuity-eligible turn**
   - `recurrence_cue`: **null**
   - `debug_recurrence_aligned_instance_count`: **1**
   - Insight saved, `is_continuity_eligible`: **true** (example `continuity_key`: `rest_must_be_earned`)

2. **Second aligned same-family turn (passing run)**
   - `recurrence_cue.phase`: **`recurrence`**
   - `pattern_key`: **`self_worth_pressure`**
   - `confidence`: **`medium`**
   - `debug_recurrence_aligned_instance_count`: **2**
   - `debug_recurrence_e2_phase`: **`recurrence`**

3. **Weak control — `Not sure.`**
   - `recurrence_cue`: **null**
   - `debug_is_vague_source`: **true**
   - No inappropriate heavy cue

### Watch item (Nova / extractor alignment)

On an **earlier attempt**, the second user message was **semantically close** to the first, but the model’s `insight_candidate` / `core_pattern` wording led to:

- `continuity_key`: **`fallback_generic`**
- `is_continuity_eligible`: **false**
- **No** recurrence cue

**Interpretation:** Pass 1 **logic** is sound; **same-family alignment** can still fail when extraction phrasing misses the closed detector families. This is **eligibility + classification brittleness**, not weak-input suppression failure.

### Nova follow-up (implemented after this report)

- **Shared detector:** `lib/wisewave-continuity-family.ts` — `detectContinuityPatternFamily` used by **`/api/chat/turn`** and **`/api/chat/continuity`** (no drift).
- **Broader clusters (conservative):**
  - **Rest / recovery earnedness:** recovery lexicon (e.g. break, relax, downtime, recharge, pause, …) **and** worth/guilt/deserve/permission cluster — not only literal `rest` + small verb set.
  - **Earned value after effort:** added paraphrase path — “not enough / prove” style language **with** accomplishment/work/effort anchors — so borderline second turns are less likely to land in `fallback_generic` when meaning matches.

**Lumen retest suggestion:** Re-run the **borderline second message** that previously hit `fallback_generic`; expect stable `continuity_key` and eligibility when both clusters match. If it still fails, capture `debug_insight_core_pattern` for a targeted regex or extractor prompt tweak.

---

## Pass 2 — Persistence phase gates (local)

| Field | Value |
|--------|--------|
| **Result** | **Revise / partial pass** |

### What passed — Case A (full gates)

Fresh session, three substantive same-family turns (`rest_must_be_earned` path):

- Turn 1: `recurrence_cue: null`, `debug_recurrence_aligned_instance_count: 1`
- Turn 2: `phase: "recurrence"`, count **2**
- Turn 3: `phase: "persistence"`, count **3**, `debug_recurrence_e2_persistence_downgraded: false`

**Conclusion:** Persistence fires when count + present-relevance gates are clearly satisfied; wording shifts recurrence → ongoing presence.

### What did not yet prove — Case B (downgrade path)

**Intended:** Aligned count **≥ 3** but third user message short enough that **persistence** is **downgraded** to **recurrence** (`debug_recurrence_e2_persistence_downgraded: true`).

**Attempted third user line:** `Still not earned yet.`

**Observed:** `recurrence_cue: null`, `debug_recurrence_aligned_instance_count: 1`, `continuity_key: "fallback_generic"`, `debug_recurrence_e2_persistence_downgraded: false`.

**Interpretation:** The third turn **dropped out of the same family** in classification (extractor/core_pattern + detector), so the substrate never reached **count 3** for that turn — **persistence-downgrade logic was not exercised**.

### Nova / docs follow-up

- QA plan **Pass 2 Case B** updated with **scripted short lines** that keep **earn + rest** (or break/relax) in user text under 48 chars.
- Extraction prompt nudge: preserve explicit **rest/break/relax** in `insight_candidate` when the user continues a rest-as-earned theme.
- Detector: narrow **`not earned` + recovery noun** rule in `lib/wisewave-continuity-family.ts`.

### Lumen retest (exact next action)

Re-run Case B with a third message such as **`Still need to earn rest.`** (or another line from the QA plan list). Expect **`debug_recurrence_aligned_instance_count: 3`**, **`debug_recurrence_e2_persistence_downgraded: true`**, **`recurrence_cue.phase: "recurrence"`**. If not, paste **`debug_insight_core_pattern`** for Nova.

---

*Append Pass 3+ results below as Lumen completes them.*
