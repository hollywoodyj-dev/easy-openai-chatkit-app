# Milestone J — Lumen QA Results

**Plan:** `docs/HC_OS_V1_Milestone_J_Lumen_QA_Plan.md`  
**Owner:** Lumen  

Append dated entries below (environment, build marker, pass/fail per pass ID, sample `debug_milestone_j_*`).

---

## Log

### 2026-03-30 — Local (`http://127.0.0.1:3000`) — Pass 0J / Pass 1 initial run

**Env:** local Next dev on `127.0.0.1:3000`  
**J build marker:** `milestone_j_microshift_v1`

#### Pass 0J — deployment / build smoke
- **Marker:** PASS
  - `debug_milestone_j_build_marker === "milestone_j_microshift_v1"`
- **Flag on path:** PASS
  - with `ENABLE_J_MICROSHIFT=true`, `debug_milestone_j_enabled === true`
  - reflective candidate emitted `microshift_cue`
- **Important finding (resolved in Nova 2026-03-30):** utilitarian suppression missed leading **`Summarize…`** (shared `looksUtilitarianOrFactual` lacked `summarize`/`outline`/`paraphrase` at line start; H already had it). **Retest** same prompt → expect J **`suppressed`**, **`non_reflective_turn`** / **`inadmissible`**.
  - test prompt: `Summarize the following section into 3 concise bullet points.`
  - **before fix:** `debug_milestone_j_outcome = "emitted"` + spurious `microshift_cue`
  - **after fix:** `lib/wisewave-milestone-i-soft-continuity-carryover.ts` — extend `looksUtilitarianOrFactual`

#### Pass 1 — kill switch
- **Result:** PASS
  - restarted local with `ENABLE_J_MICROSHIFT=false`
  - both reflective and utilitarian probes returned:
    - `debug_milestone_j_outcome = "skipped_disabled"`
    - no `microshift_cue`
    - main reply remained coherent
- restored local dev with J enabled after verification

#### Sample debug snapshots
- **Reflective probe (J enabled)**
  - prompt: `I keep bracing for the conversation before it even begins, and the tension starts early.`
  - `debug_milestone_j_outcome = "emitted"`
  - `debug_milestone_j_eligibility = "admissible"`
  - `debug_milestone_j_allow_render_mode = "ultra_light"`
  - `debug_milestone_h_outcome = "suppressed"`
  - `debug_milestone_i_outcome = "suppressed"`
- **Utilitarian probe (J enabled, unexpected fail)**
  - prompt: `Summarize the following section into 3 concise bullet points.`
  - `debug_milestone_j_outcome = "emitted"`
  - `debug_milestone_j_eligibility = "admissible"`
  - `debug_milestone_j_reasons = []`
  - no H / I / E / F cue present
  - removal judgment: the appended J line is clearly cleaner when removed
- **Any probe (J disabled)**
  - `debug_milestone_j_outcome = "skipped_disabled"`
  - no `microshift_cue`

#### Current status
- **0J:** PASS with one immediate boundary concern discovered
- **1:** PASS
- **4 (early signal):** FAIL candidate already visible locally because J emitted on a utilitarian summary request

#### Next recommended run order
1. Pass 2 — H / I conflict
2. Pass 3 — E / F presence stack
3. Pass 4 — broaden utilitarian / non-reflective negatives
4. Pass 5 / 6 — tone, presence, EN/ZH restraint parity
5. Pass 7 — confirm no cross-turn J layer beyond persisted assistant text
