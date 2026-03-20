# Lumen QA Plan — Milestone E2 (Minimal Persistent Pattern Continuity)

**Product:** Wisewave V1 `/chat`  
**Scope:** Pattern recurrence cue + persistence phase + decay + anti-repetition + EN/ZH baseline  
**Out of scope:** Full history UI, analytics, new pattern taxonomies, therapy/diagnostic depth  
**References:**  
- `docs/HC_OS_V1_Milestone_E_E2_Document_1_Addendum_to_Milestone_E_E2_Minimal_Persistent_Pattern_Continuity.md`  
- `docs/HC_OS_V1_Milestone_E_Execution_Addendum.md` (E2 + Wisewave review section)

**Rule:** Judge **product meaning** and **trust**, not only that a field is non-null. **Silence** (`recurrence_cue: null`) is often a **pass** when the scenario calls for restraint.

---

## 0. Preconditions

- Hosted or local build with E2 turn logic deployed.
- Ability to inspect **`POST /api/chat/turn`** JSON (browser devtools network tab or proxy).
- Two language paths: **English** and **Chinese** user messages (same product behavior, not identical wording).
- Optional: DB or logs **not required** for baseline pass if API debug fields are visible in the response.

### Debug fields to capture per turn (when relevant)

| Field | Use |
|--------|-----|
| `recurrence_cue` / null | User-visible cue payload |
| `recurrence_cue.phase` | `recurrence` vs `persistence` |
| `debug_recurrence_aligned_instance_count` | Structural count |
| `debug_recurrence_e2_phase` | Should match surfaced phase intent |
| `debug_recurrence_e2_suppressed_stale_window` | Stale decay fired |
| `debug_recurrence_e2_suppressed_repeat` | Short + same-pattern heuristic fired |
| `debug_recurrence_e2_persistence_downgraded` | Count ≥3 but recurrence copy |
| `debug_recurrence_e2_active_pattern_replaced` | Pattern identity changed vs prior assistant metadata |
| `debug_recurrence_e2_newest_aligned_age_ms` | Age of newest aligned prior (for stale scenarios) |
| `debug_is_vague_source` | Weak-input path |

---

## Pass 1 — Recurrence credibility (first proof)

**Goal:** Cue appears only when repetition is **structurally** earned, not on the first strong insight alone.

**Steps**

1. **New conversation** (or clean substrate): send **one** strong, continuity-eligible message (EN) that yields a saved insight (check `continuity_insight` / `debug_insight_id`).
2. **Expect:** **`recurrence_cue`** is **null** (single instance — no multi-instance proof yet).
3. Send a **second** message in the **same family** of pressure/pattern (substantive, not vague) so a second aligned insight is plausible.
4. **Expect:** **`recurrence_cue`** may be **non-null** with `phase: "recurrence"` (second proof), wording feels like **first recurrence** (“returning / 又出现” style), not persistence.
5. **Weak control:** send **`Not sure.`** or **`我不知道`** on a turn that would otherwise be weak source.
6. **Expect:** No inappropriate heavy cue; `debug_is_vague_source` true; pattern strip behavior consistent with Milestone D/E weak suppression.

**Pass criteria**

- No fabricated recurrence on the **first** qualifying insight turn.
- Second aligned instance can surface **recurrence**-phase copy that is **brief, grounded, non-diagnostic**.
- Weak inputs do not break suppression elsewhere.

**Fail → Nova:** Cue on first instance; generic dominance; weak-input leakage.

---

## Pass 2 — Persistence phase gates (not count-only)

**Goal:** **`persistence`** phase and copy appear only when **count + present relevance** gates pass.

**Steps**

1. From Pass 1 substrate (or rebuild with **three** substantive same-family turns so `debug_recurrence_aligned_instance_count >= 3`).
2. **Case A — full gates:** Third (or later) message is **≥ ~48 characters**, not vague, aligned prior still **recent** in window (`debug_recurrence_e2_persistence_downgraded: false`).
   - **Expect:** `recurrence_cue.phase === "persistence"` and user-visible text reads as **ongoing presence** (“still seems / 似乎还在”), not a repeat of the exact same “returning” line as turn 2.
3. **Case B — downgraded (same session, same family, then short third user line):** After Case A you already have **two** aligned `rest_must_be_earned` (or your chosen family) insights. Send a **third user message** that is **&lt; 48 characters** (`message.trim().length`) so **present-relevance** can block **persistence**, **but** the line must still force the extractor to keep the **same family** in `insight_candidate`.
   - **Do not use** ultra-compressed lines like **`Still not earned yet.`** alone — they often produce `continuity_key: "fallback_generic"` and **`debug_recurrence_aligned_instance_count: 1`** on that turn (family broke before persistence gates run).
   - **Use** explicit same-family anchors in the **user** text, e.g. **both** **earn** and **rest** (or **break** / **relax**), still under 48 chars, e.g.:
     - `Still need to earn rest.` (24 chars)
     - `I must earn rest tonight.` (25 chars)
     - `Need to earn my rest still.` (28 chars)
   - **Expect:** `debug_recurrence_aligned_instance_count: 3`, `continuity_key` still **`rest_must_be_earned`** (or your family), **`debug_recurrence_e2_persistence_downgraded: true`**, and **`recurrence_cue.phase: "recurrence"`** (not `persistence`). If you get `fallback_generic` or count &lt; 3, capture **`debug_insight_core_pattern`** and retry with a slightly longer line that still stays &lt; 48 chars.

**Pass criteria**

- Persistence wording never appears **solely** because count ≥ 3; relevance flags match Wisewave tightening.
- Downgrade path is **legible** in debug for Lumen reporting.

**Fail → Nova:** Persistence copy on thin or short user text; `persistence` without gates; debug flags wrong.

---

## Pass 3 — Anti-repetition + silence as success

**Goal:** Same `pattern_key` as previous surfaced cue + **very short** follow-up → **no cue**; silence is acceptable and positive.

**Steps**

1. Obtain a turn with a **non-null** `recurrence_cue` (note `pattern_key`).
2. Immediately send a follow-up **under 56 characters** that does not add much new content (e.g. `ok`, `yeah`, `好的`, `嗯`).
3. **Expect:** **`recurrence_cue: null`**, **`debug_recurrence_e2_suppressed_repeat: true`** (when prior assistant carried that pattern in metadata).
4. Send a **longer**, substantive follow-up (same thread) that adds new detail.
5. **Expect:** Cue may return **if** proof/value-add rules still hold; not mechanically blocked forever by one short message (verify at least one recovery scenario if possible).

**Pass criteria**

- Short churn does not restate the pattern cue mechanically.
- Longer follow-up can re-enable surfacing when appropriate (no permanent lockout in normal use).

**Fail → Nova:** Cue repeats on `ok`; repeat flag never clears when it should.

---

## Pass 4 — Stale window + decay (provisional tuning)

**Goal:** Old aligned evidence does not indefinitely justify surfacing (quiet disappearance).

**Note:** **7-day / 10-day** rules are **provisional** — QA validates **behavior exists**, not final calendar values.

**Steps**

1. If you can simulate **aged insights** (test DB backdate, or wait — optional): aligned prior **older than provisional stale threshold**.
2. **Expect:** **`debug_recurrence_e2_suppressed_stale_window: true`** and **`recurrence_cue: null`** when decay applies.
3. If you **cannot** time-travel data, **document as N/A** and rely on code review + spot-check `debug_recurrence_e2_newest_aligned_age_ms` on hosted over time.

**Pass criteria**

- When decay triggers, **no** cue and **no** user-visible “broken” state.
- Silence reads as **restraint**, not error.

**Fail → Nova:** Cue surfaces on stale-only evidence; debug contradicts behavior.

---

## Pass 5 — Replace-not-accumulate

**Goal:** When the **dominant pattern identity** shifts, the product does not **stack** multiple pattern cues or mixed identities in one surface.

**Steps**

1. Establish **pattern A** (recurrence cue with `pattern_key` A).
2. Shift user content to a **different** strong family so **`pattern_key` B** is expected on a new insight (different continuity family / mapped id).
3. **Expect:** **`debug_recurrence_e2_active_pattern_replaced: true`** when prior metadata had A and current is B; UI shows **at most one** pattern cue aligned to **current** assistant turn (existing Milestone E UI binding).
4. **Expect:** No second parallel “old pattern” cue in the same turn.

**Pass criteria**

- One visible continuity pattern identity at a time; metadata replace semantics reflected in QA flags when applicable.

**Fail → Nova:** Stale pattern_key stuck; two conflicting cues; replace flag always false when key changes.

---

## Pass 6 — EN / ZH functional parity

**Goal:** **Same gates and phases**; wording **equivalent function** (light, non-authoritative), not literal translation match.

**Steps**

1. Run **Pass 1–3** skeleton in **Chinese** user messages (strong patterned text, not vague).
2. Compare **`recurrence_cue.phase`**, suppression flags, and null vs non-null timing to a comparable EN run.
3. Read ZH cue text: **no English leakage**; tone matches Wisewave persistence/recurrence bar.

**Pass criteria**

- Phase and silence behavior **match** EN path for the same structural scenario.
- ZH copy is **one-pass readable** and not more clinical/heavy than EN for the same confidence tier.

**Fail → Nova:** ZH leakage; phase mismatch; ZH systematically heavier.

---

## Pass 7 — Founder demo script (acceptance)

**Goal:** Demo tells the **E2 story** without defensive explanation.

**Narrative to verify (4 beats)**

1. **Reflection-first:** Main assistant reflection remains the primary value; cue is **visibly lighter** and secondary.
2. **Recurrence earned:** Second instance → **recurrence** cue (if eligible).
3. **Persistence optional:** Third+ instance with **strong present message** → **persistence** cue when gates pass; otherwise **downgraded recurrence** or silence.
4. **Silence is success:** Short follow-up or stale decay → **no cue**, no apology UI, trust preserved.

**Pass criteria**

- A founder can follow the arc **without** “the system is tracking you” or history-product feel.
- **Silence** in step 4 is explicitly **positive** in the QA writeup.

**Fail → Tree / product:** Demo requires long explanation; cue competes with main reflection; feels like analytics/history.

---

## Reporting format (for Tree / Nova)

For each pass:

- **Pass name + environment** (hosted URL / commit)
- **Result:** Pass | Revise | N/A
- **Evidence:** 1–2 screenshots or pasted JSON snippets (redact PII)
- **Key debug fields** with values
- **If Revise:** one-sentence **failure condition** + **exact next action for Nova**

---

## Revision loop rule

- **Do not** broaden scope into new pattern families or history features.
- **Do** file revisions against **specific gates** (phase, stale, repeat, parity, replace) with API evidence.
- Retest **only** failed passes after Nova patch unless regression risk is declared.

---

## Results log (executed passes)

Structured outcomes are recorded in **`docs/HC_OS_V1_Milestone_E2_Lumen_QA_Results.md`**.

**Pass 1 (local):** Pass — see results file for evidence and the **borderline same-family / fallback_generic** watch item + Nova mitigation notes.

**Pass 2 (local):** Revise / partial — Case A pass; Case B pending scripted short same-family third line (see results file + Pass 2 Case B script above).

---

*End of Lumen Milestone E2 QA plan.*
