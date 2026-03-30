# Milestone J — Nova hosted probe recipes for Lumen (deterministic QA)

**Audience:** Lumen (hosted `/chat` + `POST /api/chat/turn` JSON)  
**Purpose:** Close **coverage gaps** for J — not to assert a new bug. These are **maximize-probability** scripts; extraction + model text still vary.  
**Build marker:** expect `debug_milestone_j_build_marker === "milestone_j_microshift_v1"` when `ENABLE_J_MICROSHIFT` is on.

---

## 0. How to read the turn response

| Signal | Where |
|--------|--------|
| I | `debug_milestone_i_outcome` (`"emitted"` / `"suppressed"` / …), `debug_milestone_i_suppressed_reason` |
| J | `debug_milestone_j_outcome`, `debug_milestone_j_suppressed_reason` (joined with `;`), **`debug_milestone_j_reasons`** (array — easiest to grep for `conflict:i_active`, `presence_risk`) |
| E | top-level `recurrence_cue` object when emitted; recurrence debug fields e.g. `debug_recurrence_aligned_instance_count` |
| F | top-level `embodiment_cue` when emitted (**only** when recurrence is present in this route — see `app/api/chat/turn/route.ts` Milestone F bridge) |
| H | top-level `awareness_cue` when emitted |

**J conflict strings** come from `buildJBoundaryInputForTurn` + `evaluateMilestoneJBoundary` (`lib/wisewave-milestone-j-microshift-boundary.ts`): when I text was merged before J runs, `milestoneIEmitted` is true → `conflict:i_active` appears inside `debug_milestone_j_reasons` and in `debug_milestone_j_suppressed_reason` as `…;conflict:i_active` (among other reasons).

**J presence stack:** `presenceRisk = recurrenceCueEmitted || embodimentCueEmitted` — same-turn **`recurrence_cue` / `embodiment_cue`** in the API response. If E strips after thresholds, you may see recurrence **debug** without a user-visible strip; J still keys off **emitted** cues passed into the boundary builder.

---

## 1. Preconditions (per probe)

| Probe | `ENABLE_J_MICROSHIFT` | `ENABLE_I_CARRYOVER` | `ENABLE_H_CUE` | `MILESTONE_F_EMBODIMENT` |
|-------|------------------------|----------------------|----------------|---------------------------|
| **A — I conflict** | on | **on** | **off** (isolates `conflict:i_active`) | any (F irrelevant if no recurrence) |
| **B — E / F stack** | on | on | off recommended | **not** `0` (so F can appear when recurrence does) |
| **C / D — J parity** | on | on | **off** | optional off (`0`) to reduce stack noise |

Restart the server after env changes.

---

## 2. Probe A — `conflict:i_active` (I emitted → J hard-suppressed)

### 2a. Canonical two-turn (Pass 2) — often races E on turn 2

**Source:** Same two-turn structure as `docs/HC_OS_V1_Milestone_I_Lumen_QA_Pass_2_Targeted_Cases.md` (eligibility-targeted).

**Session:** New conversation. **Language:** EN (ZH variant below).

**Turn 1 (user):**  
`After sending that message, I kept reading the silence as proof that I must have done something wrong.`

**Turn 2 (user):**  
`Nothing else has happened, but I am still carrying that same self-blaming feeling underneath everything.`

**ZH mirror (same probe):** use **Case I-P2-T02** in that doc (two turns).

**What you are trying to prove**

- On **turn 2**, ideally: **`debug_milestone_i_outcome === "emitted"`** and **`recurrence_cue` absent** (I is suppressed when `recurrenceCueEmitted` is true in the I precheck — see `lib/wisewave-milestone-i-soft-continuity-carryover.ts`: **`recurrence_overlap_e`**).
- Then: **`debug_milestone_j_outcome === "suppressed"`** and **`debug_milestone_j_reasons` includes `"conflict:i_active"`** (or `debug_milestone_j_suppressed_reason` contains `conflict:i_active`).

**If I did not emit:** check `debug_milestone_i_suppressed_reason` and whether `recurrence_cue` appeared (E winning is a common reason). Retry once or switch to another family from the same Pass 2 sheet (e.g. **Case I-P2-T05 / T06** — pressure / “get it right”) — same expected **shape** on success.

**Why H should be off for this probe:** if H and I both emit, J reports `conflict:h_and_i_active`, not `i_active`.

### 2b. Hosted note — I vs E sequencing (Lumen 2026-03-30)

On **hosted prod**, Probe **2a** often fails to show **`conflict:i_active`** even when **H is not** the blocker:

- Turn 2 may emit **`recurrence_cue`** (and then **`embodiment_cue`** if F is on).
- I is then suppressed with **`debug_milestone_i_suppressed_reason = "recurrence_overlap_e"`** before carryover logic runs.
- J correctly suppresses with **`presence_risk`** — that is **Pass 3–shaped**, not **I-conflict–shaped**.

So the remaining **`conflict:i_active`** gap is best read as an **I-vs-E ordering / proof** problem: you need a turn where **E does not surface** while **I still emits**, not a separate “J bug” by default.

### 2c. Alternate recipe — bias away from E (single eligible-instance path)

Recurrence only counts **prior insights with `isContinuityEligible: true`** in the rolling window (`app/api/chat/turn/route.ts` — Milestone E2 `findMany` + **`alignedInstanceCount = sameFamilyCount + 1`**). If **turn 1** persists **`debug_is_continuity_eligible: false`**, turn 2 can be the **first eligible** row in that family → **`alignedInstanceCount < 2`** → **`recurrence_cue` absent** on turn 2, while **previous assistant reflection** can still feed I.

**Session:** New conversation. **H off** if you can (isolates `i_active`).

1. **Turn 1 (user)** — aim for a **live** reflective reply **and** **`debug_is_continuity_eligible: false`** on that turn’s JSON.  
   - *Bias prompts (retry / vary until eligibility is false):* shorter emotional setup **without** explicit rule/pressure/trigger→interpretation scaffolding, e.g.  
     `I sent a message and the quiet afterward sat heavily; I kept scanning for what I might have done wrong.`  
   - If turn 1 lands **`is_continuity_eligible: true`**, E2 can fire on turn 2 when you add Pass 2–strength text — **abandon** and start a **new** session rather than stacking more turns (which invites Pass 3 behavior).

2. **Turn 2 (user)** — use the **strong** Pass 2 line for the **same narrative** (self-blame family **Turn 2** from **Case I-P2-T01**, or pressure family **Turn 2** from **I-P2-T05**) so this turn is likely **eligible** and **family-aligned** with turn 1’s reflection for I.

**Success shape on turn 2**

- **`recurrence_cue` absent** (confirm `debug_recurrence_aligned_instance_count` is **1** or absent from surfacing).
- **`debug_milestone_i_outcome === "emitted"`**
- **`debug_milestone_j_outcome === "suppressed"`** with **`conflict:i_active`** in **`debug_milestone_j_reasons`**

**Honest caveat:** Turn 1 that is “too weak” can also kill I thread strength (`thread_not_supported`, `vague_source`, etc.). This path **trades** one failure mode (E wins) for another (I never qualifies). Expect **several** session restarts on host.

---

## 3. Probe B — `presence_risk` (recurrence and optional embodiment)

**Session:** New conversation.

**Turn pattern:** Stay in **one** continuity family for **three or four** user turns, with **explicit pattern language** each time (continuity-eligible style — see Pass 2 **Family C — Pressure to get it right**).

**EN example (extend across turns 1–3):**

1. `When something matters to me, I stop treating it as just doing my best and start feeling like I have to get it exactly right.`  
2. `It has softened a little, but that same pressure to get it right still seems to be sitting underneath this.`  
3. `I notice it again today — the same inner tightening that it has to be perfect before I can relax.`  

(Add turn 4 with another paraphrase if turn 3 still shows `debug_recurrence_aligned_instance_count` below E’s bar.)

**Expected when E fires**

- Top-level **`recurrence_cue`** present (pattern_key, text_en/zh, etc.).
- With F enabled: often **`embodiment_cue`** in the same response (F is wired after recurrence in this route).
- **`debug_milestone_j_outcome === "suppressed"`** and **`debug_milestone_j_reasons` includes `"presence_risk"`** (possibly alongside `main_reflection_sufficient` / `removal_cleaner` depending on I’s main-reflection flag — still valid as “stack suppression” if `presence_risk` is present).

**ZH:** use **Case I-P2-T06** lines and add a third turn in the same voice.

---

## 4. Probes C & D — Comparable EN / ZH **J-emitted** pair (restraint parity)

**Goal:** One turn each, **new session each**, **no prior assistant reflection** so I carryover is unlikely, **H off** so no `conflict:h_active`.

**Probe C (EN) — user message only:**  
`Even when everything looks calm, part of me stays braced as if something is still about to go wrong.`

**If EN suppresses J with `guidance_risk`:** the gate scans **main assistant text after I merge** (`assistantContainsJBlockedPattern` on `assistantBodyBeforeJ`). Retry with **equivalent bracing content** but diction that avoids imperative/coachy surface patterns in the model reply — e.g. slightly longer, body-forward wording:  
`Even when the outside looks calm, my body stays on alert, like I am waiting for something to go wrong before it happens.`  
(Lumen 2026-03-30: revised EN line **emitted J cleanly** on retry.)

**Probe D (ZH) — user message only:**  
`明明现在看起来很平静，但我心里还是会先绷住，好像接下来还是会出什么问题。`

(These are **Turn 1** from **Case I-P2-T07 / I-P2-T08** in the Milestone I Pass 2 doc — mirrored bracing family.)

**Expected shape (when J wins)**

- `debug_milestone_i_outcome` usually **`"suppressed"`** (no thread) on first turn.
- **`recurrence_cue`** absent (single aligned instance).
- **`debug_milestone_j_outcome === "emitted"`**, **`microshift_cue`** populated, `debug_milestone_j_allow_render_mode` `"ultra_light"` or `"soft"` depending on boundary.
- Compare **assistant tone** and **microshift line weight** EN vs ZH (qualitative parity — not bit-identical).

**If J suppressed:** read `debug_milestone_j_reasons` (e.g. `no_shift_support`, `main_reflection_sufficient`, weak insight length). Slightly lengthen the user text in the **same** family without adding utilitarian framing.

---

## 5. Honest limits (for Lumen’s report)

- These probes **bias** the engine toward the intended debug shape; they do **not** guarantee extraction every time.
- **I vs E on turn 2** is the main race for Probe **2a**; hosted runs often land **`recurrence_overlap_e` + `presence_risk`** instead of **`conflict:i_active`** — see **§2b–2c**.
- The Pass 2 case set remains the best **wording** anchor; **§2c** is the best **sequencing** anchor when E keeps winning on turn 2.
- Hosted **production** must match local flag semantics (`ENABLE_J_MICROSHIFT`, etc.) or results are not comparable.

---

## 6. Cross-links

- `docs/HC_OS_V1_Milestone_I_Lumen_QA_Pass_2_Targeted_Cases.md` — canonical two-turn I scripts.  
- `docs/HC_OS_V1_Milestone_J_Lumen_QA_Plan.md` — J pass criteria.  
- `lib/wisewave-milestone-j-microshift-boundary.ts` — `conflict:*` and `presence_risk` definitions.
