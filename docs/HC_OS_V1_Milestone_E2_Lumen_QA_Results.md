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

## Pass 2 — Persistence phase gates

### Local (first run)

| Field | Value |
|--------|--------|
| **Result** | **Revise / partial** (superseded by hosted retest below) |

- **Case A:** Pass — three substantive turns → `persistence` at count 3, `persistence_downgraded: false`.
- **Case B (first attempt):** Third line **`Still not earned yet.`** → `fallback_generic`, count **1** — family broke before downgrade logic could run.

### Hosted — `https://www.wisewave.io` (API path, Case B retest)

| Field | Value |
|--------|--------|
| **Result** | **Pass** (Lumen / Tree) |

**Turn 1** — first strong rest-earned message  

- `recurrence_cue`: **null**  
- `debug_recurrence_aligned_instance_count`: **1**  
- `continuity_key`: **`rest_must_be_earned`**  
- `is_continuity_eligible`: **true**

**Turn 2** — second aligned same-family message  

- `recurrence_cue.phase`: **`recurrence`**  
- `debug_recurrence_aligned_instance_count`: **2**  
- `debug_recurrence_e2_phase`: **`recurrence`**  
- `continuity_key`: **`rest_must_be_earned`**

**Turn 3** — user message **`Still need to earn rest.`**  

- `recurrence_cue`: **null**  
- `debug_recurrence_aligned_instance_count`: **3**  
- `debug_recurrence_e2_phase`: **`recurrence`**  
- `debug_recurrence_e2_persistence_downgraded`: **true**  
- `continuity_key`: **`rest_must_be_earned`**  
- `is_continuity_eligible`: **true**  
- `debug_insight_core_pattern`: *"The user tends to feel they must earn rest before allowing a break or relaxation."*

**Conclusion (Lumen):** Same family through turn 3; count reaches **3**; system **does not** promote to **persistence** on thin/short present input; downgrade is legible in debug (`persistence_downgraded: true`, phase intent **recurrence**). **Silence** on the short turn reads as **restraint**, not failure — acceptable E2 success per Wisewave.

**Nova technical note (for future tuning):** Turn 3 user text is **&lt; 56** chars and follows the same `pattern_key` as turn 2, so **`debug_recurrence_e2_suppressed_repeat`** may also be **true** (anti-repeat heuristic). That can layer **silence** on top of **persistence downgrade**. A future scripted case that needs a **visible** recurrence cue on the downgrade turn would require a third line **≥ 56** chars (to skip anti-repeat) while still failing persistence relevance gates — tighter scripting; **not** required for current Pass 2 sign-off.

---

## Pass 3 — Anti-repetition + recovery (hosted `wisewave.io`)

| Field | Value |
|--------|--------|
| **Result** | **Pass** (after scripted retest; see partial note below) |

### First run — partial / revise

**What passed:** After a short low-value turn, a **longer substantive** same-family follow-up **recovered** surfacing (e.g. turn 2 → recurrence at count 2; turn 4 → **persistence** at count 3) — no permanent lockout.

**What did not prove cleanly:** Short follow-up **`ok`** produced `recurrence_cue: null` but **`debug_recurrence_e2_suppressed_repeat: false`** — insight fell to brief / non-eligible fallback (`continuity_key: fallback_generic`, `is_continuity_eligible: false`, core_pattern *too brief to identify*). **Silence was correct** at product level, but the **anti-repeat branch** was not exercised.

**Lumen / Tree:** No Nova code change required before rerun — **test-message** issue, not demonstrated logic failure.

### Rerun — anti-repeat branch proof

**Turn 2:** Recurrence cue surfaced — `phase: "recurrence"`, `debug_recurrence_aligned_instance_count: 2`.

**Turn 3** — short same-family follow-up (under 56 chars, **not** empty vague churn):

- User message: **`still feels like I need to earn rest`**

**Observed:**

- `recurrence_cue`: **null**
- `debug_recurrence_aligned_instance_count`: **3**
- `debug_recurrence_e2_phase`: **`recurrence`**
- **`debug_recurrence_e2_suppressed_repeat`: true**
- `debug_recurrence_e2_persistence_downgraded`: **true**
- `continuity_key`: **`rest_must_be_earned`**
- `is_continuity_eligible`: **true**

**Meaning:** Same family preserved; count advanced; cue suppressed for short same-pattern churn; suppression **explicit in debug**, not accidental brief-input fallback.

**Turn 4:** Longer substantive same-family follow-up — recovery succeeded: `recurrence_cue.phase: "persistence"`, `debug_recurrence_aligned_instance_count: 4`.

### Lumen / Tree conclusion

- Short same-pattern churn does **not** mechanically restate the cue; **`suppressed_repeat: true`** when scripted correctly.
- Later substantive follow-up restores surfacing (**persistence** at count 4 in this run).

**Passes 1–3:** Pass (hosted where noted).

---

## Pass 4 — Stale window + decay (hosted `wisewave.io`)

| Field | Value |
|--------|--------|
| **Result** | **Pass** |
| **Environment** | Hosted target: `https://www.wisewave.io` |

### Evidence (single cookie-backed QA session)

- Session: `cmyglgt200jo04leduowyn`
- Seed substrate: same-family `rest_must_be_earned` with 2 aligned prior insights
- Backdate script: scoped write updated **2** insights in that conversation

### Final stale-check turn

User message (fresh same-family):
- `It is happening again tonight. Even now, rest still feels like something I should not allow unless I do more first.`

Observed:
- `recurrence_cue`: **null**
- `continuity_key`: **`rest_must_be_earned`**
- `is_continuity_eligible`: **true**
- `debug_recurrence_aligned_instance_count`: **3**
- `debug_recurrence_e2_suppressed_stale_window`: **true**
- `debug_recurrence_e2_newest_aligned_age_ms`: **691210318**
- `debug_recurrence_e2_phase` (if shown): consistent with stale suppression
- `debug_is_vague_source`: **false**

### Meaning / conclusion

Aligned count still reaches **3**, but the newest aligned prior is old enough to cross the provisional stale limit, so the system:
- keeps structural alignment (count logic still advances)
- applies stale-window decay correctly (cue suppressed)
- does not fall back due to vagueness (debug shows non-vague source)

**Lumen / Tree conclusion:** Pass 4 = **Pass**

---

*Append Pass 5+ results below as Lumen completes them.*

## Pass 5 — Replace-not-accumulate (hosted `wisewave.io`)

**Result:** **Partial pass / revise**

### What passed (product-level)

- Pattern A cue and later Pattern B cue surface cleanly when the active family switches.
- No visible stacking of old+new cues in the UI; only one active visible cue per assistant turn.
- New dominant family can take over without lingering A on the surfaced cue.

### What did not fully prove (debug instrumentation)

- Even when the surfaced cue identity changed A → B, `debug_recurrence_e2_active_pattern_replaced` stayed **false** on:
  - the B recurrence turn
  - the B persistence turn

### Nova hypothesis

- The replacement debug flag was computed from the immediately previous assistant’s metadata.
- If there is a cue-null middle turn between cue-bearing turns, the immediately previous assistant may not have `metadata.wisewave_recurrence`, so the debug flag can fail even while the UI behavior is correct.

### Nova follow-up

- Update `/api/chat/turn` to derive the “previous surfaced recurrence identity” by scanning back for the most recent emitted `wisewave_recurrence.pattern_key` across prior assistant rows (not just the immediate previous assistant row).

### Lumen / Tree next retest request

- After the instrumentation fix is deployed, rerun Pass 5 and confirm that `debug_recurrence_e2_active_pattern_replaced` becomes **true** when the surfaced cue identity switches A → B.
