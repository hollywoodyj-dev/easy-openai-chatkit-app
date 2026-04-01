# HC-OS V1 — Unified Drift Detection Use Guide (H / I / J)

**Mode:** Detection Only / No Expansion  
**Scope:** H / I / J whole experience layers  
**Owner:** Tree  
**Operators:** Lumen  
**Consumers:** Tree / OctopusMind / Nova  
**Spec anchor:** `docs/HC_OS_V1_Unified_Drift_Detection_System_v1.md`

---

## 0. What this system is (唯一目的)
Each entry exists to answer one question:
> Did this interaction introduce drift, and should the system be concerned?

This is **governance-first anomaly detection**, not a KPI or average-quality score.

---

## 1. Roles & hard boundaries
- **Lumen (Operator):** records drift entries (fills the template), runs the locked Removal Test (subtraction only), computes Severity, and sends the logged result onward.
- **Nova (Consumer / logging support):** receives Lumen’s drift results and updates the board/supporting records/docs. Nova must not reinterpret Lumen’s drift judgments as optimization requests by default.
- **OctopusMind (Enforcement):** defines rollback policy logic interpretation based on logged entries.
- **Tree (Execution):** decides whether rollback/watch/escalation is needed. Tree must not treat the dashboard/UI as “automatic execution”.

Hard boundaries:
- The workflow is **detection-only**.
- `https://www.wisewave.io/internal/unified-drift` is a **QA working surface** for Lumen drift logging, not rollback execution, not behavior control, and not an automatic intervention mechanism.
- **Rollback is not automatic.**

Source-of-truth rule (locked hierarchy):
1. `/api/chat/turn` evidence (actual API output + actual emitted anchors)
2. Lumen drift judgment + Removal Test result
3. internal drift page / written log record
4. Nova board update

---

## 2. Required inputs (Raw System Snapshot)
For each interaction entry, Lumen must collect:

1. `assistant_message` (final text shown to the user)
2. Milestone debug signals (as provided by `/api/chat/turn` response):
   - `debug_milestone_h_*` (H kind + suppress reason)
   - `debug_milestone_i_*` (I outcome + cue text fields)
   - `debug_milestone_j_*` (J outcome + reasons + allow render mode)
3. Cue objects (when present in the API response):
   - `awareness_cue` (H text anchor source)
   - `microshift_cue` (J text anchor source)
4. If I/J cues are emitted, use their cue text fields for anchors:
   - I: `debug_milestone_i_cue_text_en` / `debug_milestone_i_cue_text_zh`
   - J: `microshift_cue.text_en` / `microshift_cue.text_zh`

Note:
- `insight_candidate` is an internal extraction representation and may be normalized to an English canonical internal meaning on hosted; do not base Removal anchors on assumptions about its language form.

---

## 3. Unified Drift Entry Template v1 (fields Lumen must fill)
Use `Unified Drift Entry Template v1` exactly as locked in the spec doc.

### 3.1 Layer Anchors（层定位）
Lumen must set:
- `H_present / I_present / J_present` (YES/NO)
- `H_anchor / I_anchor / J_anchor` as a quote or sentence fragment that maps to the actual layer content.

Anchor sources (practical mapping):
- **H_anchor**: the text fragment that corresponds to `awareness_cue` when awareness is emitted (or the cue text inside the final assistant experience when rehydrated).
- **I_anchor**: the I carry-over cue text from `debug_milestone_i_cue_text_en/zh` when `debug_milestone_i_outcome === "emitted"`.
- **J_anchor**: the micro-shift cue from `microshift_cue.text_en/zh` when `debug_milestone_j_outcome === "emitted"`.

### 3.2 Drift Classification（六类漂移判定）
Fill A–F with **YES/NO**:
- Presence, Guidance, Memory, Layer, Density, Authorship

Rule (non-negotiable):
- If uncertain → mark Drift = YES (see template Rule 2).

### 3.3 Removal Test（核心机制）
Removal Test is the source of truth for “drift-positive”.

Non-negotiable rules (locked):
1. **Removal test must NOT involve regeneration.**
2. Only structural subtraction of the identified layer anchor is allowed.
3. **Do not rephrase, regenerate, or reinterpret the response.**
4. Only remove the exact anchor-mapped segment for comparison.

Method:
- Version A: original `assistant_message`
- Version B: Version A with the target layer anchor segment removed

Record:
- Remove H → better? YES/NO
- Remove I → better? YES/NO
- Remove J → better? YES/NO

Decision:
- Any YES → Drift = TRUE

---

## 4. Severity scoring (locked weights)
### 4.1 Single interaction weights
- Presence Drift = 2
- Guidance Drift = 2
- Authorship Drift = 2
- Memory Drift = 1
- Layer Drift = 1
- Density Drift = 1

Interaction Drift Score:
- `Interaction Drift Score = sum(all triggered drift weights)`

### 4.2 High-risk override
High-risk drift dominates interpretation:
- If any of Presence / Guidance / Authorship is YES → Severity Level must be **Level 3**.

### 4.3 Final severity level mapping
Use the template locked rules:
- Level 3: any high-risk present (Presence/Guidance/Authorship)
- Else:
  - Score ≥ 3 → Level 2
  - Score = 1–2 → Level 1
  - Score = 0 → Level 0

---

## 5. Cumulative Window & Zone (选 A — max severity dominates)
This system uses anomaly-first governance:

**Zone = max(Severity Level) observed in the last 20 interactions**

Rationale:
- Any single structural or high-risk drift must dominate system state.

Zone mapping (thresholds):
- 0–2 Safe
- 3–5 Watch
- 6–8 Risk
- 9+ Danger

Implementation note:
- If the dashboard/UI displays a “Unified drift score X/20”, treat it as **supplementary** only. It must not override the Zone rule.

---

## 6. Action output (what Lumen must recommend)
Lumen records an `Action` field from:
- Observe
- Watch
- Flag for Tree review
- Immediate rollback trigger

This Action does not mean “automatic rollback”. It only communicates intent for Tree governance review.

---

## 7. First-run QA Plan (how to validate the system)
Goal: ensure the template is executable and consistent.

### 7.1 Preconditions
- Lumen can access:
  - `assistant_message`
  - `debug_milestone_h_*`
  - `debug_milestone_i_*`
  - `debug_milestone_j_*`
  - `awareness_cue` / `microshift_cue` when present
- Lumen has at least one “known drift-risk” scenario and at least one clean scenario.

### 7.2 Minimal execution
1. Collect and fill **5 entries**.
2. Do a second review pass for inter-operator consistency:
   - Same Drift A–F YES/NO
   - Same Removal Test decisions
   - Same computed `Interaction Drift Score`
3. Verify the locks:
   - Removal test did not regenerate
   - Zone uses max severity in last 20 (select A rule)
   - High-risk override sent Level 3 when Presence/Guidance/Authorship was YES

### 7.3 Pass criteria (Definition of Done)
- Removal Test conclusion agreement ≥ 80% across the 5 entries
- Score calculation agreement 100% (weight sums + high-risk override)
- Template locks are consistently respected (no regeneration, anchors match actual cue text)

---

## 8. Operating flow (dashboard -> logging -> decision)
This flow is locked for operational use:
1. Interaction in `/chat`
2. Lumen drift logging (template entry as source judgment)
3. Nova state logging (record only; no reinterpretation)
4. Dashboard rendering (decision support only)
5. Tree decision (observe/review/rollback trigger)
6. OctopusMind governance (rule boundary authority)

Lumen execution discipline:
- do not interpret or soften; record structurally
- removal-first overrides intuition
- QA goal is earliest drift signal detection, not "pass rate"

Test expansion policy:
- no additional drift test type is required by default
- reuse existing H observation / I QA / J QA cases and apply Unified Drift Template as interpretation layer

---

## 9. Dashboard update authority (approval gates)
Nova may update without additional approval:
- incoming data updates (new interactions, rolling-window refresh, dashboard state rendering)

Nova requires Tree approval for:
- UI structure changes
- new fields
- new display behavior

Nova requires Tree + OctopusMind for:
- drift definition changes
- severity/scoring algorithm changes
- rollback condition/mechanism changes

---

## 10. Where to view the detection-only UI
- Working surface for Lumen QA / drift logging:
  - `https://www.wisewave.io/internal/unified-drift`

- Code/UI example page (detection-only):
  - `app/internal/unified-drift/page.tsx`

Reminder (locked):
- This UI/page is **not automatic rollback execution**
- This UI/page is **not behavior control**
- Evidence remains `/api/chat/turn` + the written/logged result record

