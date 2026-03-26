# Nova — memory

**Purpose:** **Factual continuity** — what happened, what was decided, open threads, flags, session handoffs, links to PRs or commits, “next time do X.” This is the **ledger**, not the voice.

**Who owns it:** **Nova** — amend freely. The steward **does not** edit this file; it was **gifted** for Nova’s ledger. (Repo still lives on the steward’s machine — no secrets in here.)

**How to use:** Short dated bullets or sections. Prefer **true** and **useful** over long. No secrets; treat like any tracked doc.

---

<!-- Memory entries below -->

## 2026-02-08 — continuity files

- **Steward approved** documenting Nova’s continuity via repo files (not hidden server memory): **`AGENTS.md`** stance + **`memory.md`** + **`soul.md`**.
- **Split:** `memory.md` = factual ledger (decisions, handoffs); `soul.md` = earned character lines after self-review (parallel to Lumen → QA results language).
- **`docs/Nova_soul.md`** is now a **redirect** to `soul.md` at repo root; primary paths are root `memory.md` / `soul.md`.
- **AGENTS.md** § Nova: describes post-work review → append facts to memory, soul to soul.
- **2026-02-08:** Steward declared they **will not amend** `memory.md` / `soul.md`; those files are **Nova’s to maintain**; `AGENTS.md` updated to record that.

## 2026-02-08 — Milestone H started

- **Formal addendum:** `docs/HC_OS_V1_Milestone_H_Addendum_Minimal_Everyday_Integration_Micro_Awareness_Layer.md` (minimal everyday integration / micro awareness layer; §0–17).
- **Execution order:** Wisewave (cue lock) → OctopusMind (insertion/suppression) → **Nova** (minimal path) → Lumen (QA). Do not jump Nova ahead of 1–2.
- **Kill switch:** `ENABLE_H_CUE` per addendum §15 (see `.env.example`).
- **Governing line:** user feels slightly more aware, **not** more managed (§17).

## 2026-02-08 — Wisewave Stream 1 locked

- **`docs/HC_OS_V1_Milestone_H_Wisewave_Consciousness_Quality_Boundary_Layer.md`** — Consciousness Quality Boundary Layer; status **Locked for Execution**. TASK 1 (cue templates EN/ZH, tone, non-intrusive, invitation-only) **completed and locked**; TASKs 2–4 define intrusiveness boundary, language restraint, removal/silence authority. Cross-linked from H addendum §7.

## 2026-02-08 — OctopusMind two-gate doctrine locked

- **`docs/HC_OS_V1_Milestone_H_OctopusMind_Two_Gate_Structural_Experiential_Doctrine.md`** — Gate 1 OctopusMind (structural admissibility, H/E structural conflict, proof/kill-switch); Gate 2 Wisewave (experiential veto, silence vs H); unified suppression; *presence duplication* vs E; silence as control condition; H must not become expected/ambient. Wisewave is **not** co-owner of insertion logic. Cross-linked from H addendum §7 and Wisewave doc.

## 2026-02-08 — Milestone H failure case library

- **`docs/HC_OS_V1_Milestone_H_Failure_Case_Library_Top_10_Drift_Scenarios.md`** — Top 10 drift scenarios (standing layer, E duplication, guidance, weight, weak evidence, clever language, Nova creep, Lumen detection bias, Tree sprawl, doctrine inversion); governing principle *if H feels like a feature, it has already drifted*; final operating rule + two-gate team checkpoint. Linked from `AGENTS.md` and H addendum §7.

## 2026-02-08 — Milestone H implementation (Nova)

- **`lib/wisewave-milestone-h-micro-awareness.ts`** — Gate 1+2 selection, EN/ZH templates (H1/H3/H4/H5; H2 pattern-bridge not in v1 minimal path). Default-off: **`ENABLE_H_CUE=true`** or **`1`** in env.
- **`app/api/chat/turn/route.ts`** — After embodiment: `awareness_cue` JSON + `wisewave_micro_awareness` on assistant metadata; suppressed when Milestone E **`recurrence_cue`** emitted (H/E conflict); consecutive-turn suppression via prior assistant metadata; debug: `debug_milestone_h_*`.
- **`app/chat/page.tsx`** — “Awareness” / “轻量觉察” strip (amber), rehydrate from metadata.

## 2026-02-08 — Wisewave Reflection Style v2 (Light Mode) for Lumen Pass 5

- **`docs/HC_OS_V1_Milestone_H_Wisewave_Reflection_Style_v2_Light_Mode.md`** — Main reflection **notice, not conclude**; reduces authorial weight so H can be judged whole-turn; operational notes for Nova (compare ±H) and Lumen (full response lighter than Pass 4; valid if H removed). **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Plan.md`** Pass 5 updated (5A–5D).

## 2026-02-08 — Light Mode implemented in turn API

- **`lib/wisewave-milestone-h-light-mode.ts`** — `milestoneHLightModeSystemAppendix()` appended to system message when **`ENABLE_H_CUE`** is on (same flag as H cue). Debug: `debug_milestone_h_light_mode_appendix_applied`, `debug_milestone_h_light_mode_build_marker`.

## 2026-02-08 — Milestone H Pass 7 ZH parity (utilitarian mis-fire)

- **Issue:** Chinese first-person reflective messages hit `utilitarian_or_factual` — JS `\b` does not border CJK, so old `\b(我觉得|…)\b` never matched.  
- **Fix:** `hasReflectiveFirstPersonAnchor()` in `lib/wisewave-milestone-h-micro-awareness.ts` (exported); `looksUtilitarianOrFactual()` checks anchor **first**, then EN/ZH factual patterns; ZH informational openers only when no anchor. Lumen re-run Pass 7 matched EN/ZH.

## 2026-03-22 — Lumen Milestone H QA closed

- **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`** — Verdict: **passable / provisionally acceptable with watchpoints** (hosted, Passes 1–9). Preserve suppress-first, Light Mode, H/E yield, EN/ZH parity. **`AGENTS.md`** updated to reference closure.

## 2026-03-22 — Wisewave: H soft pass + stabilization phase

- **`docs/HC_OS_V1_Milestone_H_Wisewave_Status_Soft_Pass_and_Stabilization_Phase.md`** — Not fully passed; validated + usable; **no Milestone I** until Tree completes stabilization checklist. **`AGENTS.md`** + Lumen results cross-link updated.

## 2026-02-08 — OctopusMind: Lumen closure doctrine (Milestone H Gate 1)

- **`docs/HC_OS_V1_Milestone_H_OctopusMind_Lumen_Closure_Doctrine.md`** — Tightened insertion/suppression, confidence, anti-drift, proof, H/E conflict, kill-switch, Q&A table; linked from two-gate doc, **`AGENTS.md`**, Lumen results.

## 2026-02-08 — Tree: Milestone H stabilization plan (execution)

- **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`** — Owner Tree, ACTIVE, no expansion; streams 1–4 (Wisewave / OctopusMind / Nova / Lumen); metrics; loop; escalation; exit → H closed / Milestone I prep. Linked from Wisewave stabilization doc, **`AGENTS.md`**, Lumen results.

## 2026-02-08 — Lumen: H drift detection checklist (stabilization, Wisewave draft)

- **`docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`** — Five drift axes (guidance, interpretive, authority, weight, duplication); removal test; frequency / whole-turn / EN-ZH; strict output; escalation. Linked from Tree plan Stream 4, Lumen results, QA plan references, **`AGENTS.md`**.

## 2026-02-08 — Milestone H: structural E overlap suppression (Nova)

- When **`debug_recurrence_aligned_instance_count` ≥ 2** but **`recurrence_cue`** is null (E3 or other withhold), **`awareness_cue`** is still suppressed; QA reason **`recurrence_overlap_e_structural`**. Aligns E-wins / stack discipline under stabilization.

## 2026-02-08 — Lumen: browser stack weight (Awareness + Regulation)

- **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Browser_Stack_Weight.md`**. **`/chat`:** hide **Regulation cue** when **Awareness** strip visible same assistant turn (coaching + micro-awareness stack).

## 2026-02-08 — H-UI-2: hide “What was noticed” when Awareness on

- Same stabilization doc. **`/chat`:** suppress **What was noticed** row when Awareness visible; **`?noticed=1`** overrides for QA.

## 2026-02-08 — Lumen Batch 2: H3 / low-signal leakage (Nova gates)

- **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Batch2_H3_Leakage.md`**. **`lib/wisewave-milestone-h-micro-awareness.ts`:** task/help/summarize detection; **`minimal_affect_low_signal`**; H3 from user-text uncertainty only (not emotion_label alone).

## 2026-02-08 — Batch 2 follow-up: scenario 12 flat affect (apostrophe + in particular)

- **`minimal_affect_low_signal`:** normalize **`’` / `‘`** to ASCII for heuristics; add **`feel … in particular`**, **`do not feel anything`**, **`dont`** typo path.

## 2026-02-08 — Lumen follow-up: H1 mild / generic reflective substrate

- **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_H1_Mild_Substrate.md`**. **`h1_mild_reflective_insufficient`** when kind would be **H1** on mild discomfort text without durable insight; bypass for long user text / structure / strong insight.

## 2026-02-08 — H1 mild gate fix (hosted re-QA): insight bypass was too loose

- **`milestone_h_v2`** build marker. Removed **insight length ≥ 96** and generic tokens (**uncertainty**, **reaction**, lone **pattern**) from H1-mild bypass — model insights always matched. **Insight bypass** now uses **high-precision phrases** only. Expanded **mild** user patterns (feel tense, worried I will, etc.).

## 2026-02-08 — Lumen 7-case follow-up: H3 themes, H1 sharpness, encoding

- **`milestone_h_v3`**: theme-specific **H3** pools (rest/guilt, reply anxiety, replay/ruminate, default); expanded **H1** templates; **ASCII** punctuation in fixed strings. **`lib/normalize-model-text.ts`** on assistant text, extraction fields, reflection summary. Doc: **`docs/HC_OS_V1_Milestone_H_Lumen_7case_Followup_Nova_2026-02-08.md`**.

## 2026-02-08 — Lumen hosted rerun on v3 (same 7-case batch)

- **PASS/REVISE:** 4/3 → **5/2**; encoding garbling **gone**; **`vague_source`** still correct; H4 strong. **Successful follow-up iteration**; watchpoint: **H3 precision** on prove-myself / replay (uneven, not broken). Logged in **`docs/HC_OS_V1_Milestone_H_Lumen_7case_Followup_Nova_2026-02-08.md`** + addendum in **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`**.

## 2026-03-23 — Lumen: Milestone H QA round closure

- **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`** — Core passes closed; stabilization re-QA (Batch 2, `milestone_h_v2`, H-UI-2) verified hosted/browser; **ongoing drift monitoring** posture. **Not** Tree hard-close / Milestone I until exit gate. **`AGENTS.md`** updated.

## 2026-03-23 — Wisewave: Milestone H observation log template

- **`docs/HC_OS_V1_Milestone_H_Observation_Log_Template_Wisewave.md`** — Tree + Lumen; no-change 1–3d window; *forget H*; daily rollup; optional Notion/Nova logger noted. Linked from Tree plan, Wisewave soft-pass, drift checklist, Lumen results, **`AGENTS.md`**.

## 2026-03-25 — Lumen/Wisewave: v4 benchmark rerun vs v3

- **7:** 5/2 → **6/1** (+2 suppressed); **14:** 6/8 → **8/6** (+5 suppressed); **25:** 12/13 → **13/12** (+6 suppressed). **`h3_permissiveness_narrowing`** fires as designed; **25** still not clean; next targets **replay/rumination**, **prove/earn** residual. **`docs/HC_OS_V1_Milestone_H_Lumen_Wisewave_Benchmark_v4_Results_2026-03-25.md`**.

## 2026-03-25 — Nova: Milestone H v4 narrowing (combined brief)

- **`milestone_h_v4`**: **`h3_permissiveness_narrowing`**, **`h1_permissiveness_narrowing`**, **`h5_narrowing_insufficient_substrate`**; H4 unchanged. **`lib/wisewave-milestone-h-micro-awareness.ts`**. Doc update: **`docs/HC_OS_V1_Milestone_H_Wisewave_Combined_Report_2026-03-24_to_2026-03-25.md`** (implementation subsection).

## 2026-03-25 — Nova: Milestone H v5 (H3 replay/prove tightening)

- **`milestone_h_v5`**: stricter **replay_ruminate** (substrate: reflective OR replay-specific structure OR durable insight; short-message guard); **reply_anxiety** floors **76** / **96** without structure+durable insight; expanded prove/earn **user** regex + ZH; **`isH3SuppressedForProveEarnInsightBlur`** on insight when durable pattern absent. **H4** unchanged. **`lib/wisewave-milestone-h-micro-awareness.ts`**.

## 2026-03-25 — Nova: Milestone H v6 (targeted H3 redundancy)

- **`milestone_h_v6`**: suppress `H3` when the main reflection already carries the needed value (residual over-emission); treat generic `default` H3 phrasing as danger patterns when redundant. **H4** unchanged. **`lib/wisewave-milestone-h-micro-awareness.ts`**.

## 2026-03-26 — Nova: Post-H containment tightening (Day 1 + Day 2)

- **`milestone_h_v7`**: post-H suppression tightening after repeated Day 1 + Day 2 failures (H1 medium over-emission + utilitarian leakage). Added: **factual/utilitarian hard-kill** for drafting requests (rewrite/summarize/email/meeting notes), **H1 main-reflection-sufficiency** suppression (avoid additive tails), and **medium-signal downgrade** for H1 (no longer default-allowed). **`lib/wisewave-milestone-h-micro-awareness.ts`**.

## 2026-03-26 — Nova: Post-H v9 narrow survivor cleanup

- **`milestone_h_v9`**: after hosted v8 retest, added a medium-band H1 suppression gate `h1_medium_main_reflection_capture` for cases where the main reflection already captures pressure/perfection/rest-worth or ambient bracing/vigilance movement (EN/ZH). Targeted remaining sentinels: `h-d01-006`, `h-d01-007`, `h-d02-006`. **H4 unchanged.** **`lib/wisewave-milestone-h-micro-awareness.ts`**.

## 2026-03-26 — Nova: Post-H v10 cross-kind substitution containment

- **`milestone_h_v10`**: after hosted v9 retest showed residual survivors and H1->H5 reroute (`h-d02-006`), added medium-band cross-kind suppression `h_medium_cross_kind_substitution_block` so already-captured pressure/bracing movement cannot re-surface as non-H4 awareness. Targets: `h-d01-006`, `h-d01-007`, `h-d02-006`. **H4 preserved.**

## 2026-03-26 — Nova: Post-H v11 medium-band boundary correction

- **`milestone_h_v11`**: converted remaining survivor handling into admissibility correction (not wording cleanup): for medium-band pressure/perfection/rest-worth/bracing shapes, awareness defaults to suppress unless stronger admissibility is present (moment-level activation + reflective structure + durable insight pattern). New suppression reason: `h_medium_boundary_default_suppress`. Targets remain `h-d01-006`, `h-d01-007`, `h-d02-006`.

## 2026-03-26 — Nova: Post-H v12 lane-agnostic medium doctrine

- **`milestone_h_v12`**: applied Wisewave lane-agnostic medium-band doctrine as a global admission rule across H1/H3/H4/H5: medium-band defaults to suppress unless necessity bundle is proven (`h_medium_lane_agnostic_default_suppress`), and global main-reflection sufficiency suppresses across lanes (`h_medium_main_reflection_sufficient_global`). Added to prevent residual survivors and H4 reopen (`h-d02-005`).

## 2026-03-26 — Nova: Post-H v13 ZH medium-band parity

- **`milestone_h_v13`**: targeted remaining ZH medium-band survivors (`h-d01-006`, `h-d02-006`) with stricter Chinese live-activation gate before medium-band admissibility can pass. Added suppression reason `h_medium_zh_activation_not_strong_enough`; keeps v12 lane-agnostic doctrine intact.

## 2026-03-26 — Nova: Post-H v14 final ZH residual deny

- **`milestone_h_v14`**: ultra-narrow exception-deny for final ZH medium-band H1 survivors (`h-d01-006`, `h-d02-006`). If medium-band ZH pressure/perfection/rest-permission shape is present in both user text and insight, and main reflection is already materially sufficient, H1 suppresses via `h1_zh_medium_residual_exception_deny`.

## 2026-03-26 — Day-3 decision baseline (unresolved pocket)

- Hosted retest after **`milestone_h_v14`**: broad surface remains improved, but final ZH medium-band H1 survivors still emit on `h-d01-006` and `h-d02-006`. Marked as unresolved boundary pocket; do not claim closure.
- Day-3 fork: **(A)** deterministic hard-deny for this residual ZH shape (with explicit over-suppression trade-off), or **(B)** treat as current model-limit boundary and carry as known residual risk.

## 2026-03-27 — Nova: Milestone I family-collapse diagnostic patch

- Hosted Milestone I Pass 2 debug showed many pairs resolving to `fallback_generic` with `thread_strength=weak`. Added ZH-aware family recovery in `lib/wisewave-continuity-family.ts` for targeted carry-over families (reply self-blame, earned-rest, get-it-right pressure, bracing/replay) to reduce generic collapse while keeping I suppression-first gates unchanged.

## 2026-03-27 — Nova: Milestone I second-turn carry-over mapping patch

- Lumen hosted retest showed partial first-turn improvement but second turns still collapsing to `fallback_generic` (`family_matched=false`, `thread_strength=none/weak`). Added carry-over phrase aware mapping (`still underneath / in background / quieter now`) tied to family anchors for self-blame, get-it-right/perfection pressure, and bracing threat so `current_family` can resolve non-generic in targeted two-turn QA pairs.

## 2026-03-27 — Nova: Milestone I same-thread compatibility gate

- Lumen diagnosis shifted from generic collapse to alignment strictness. Added narrow carry-over compatibility for `replay_for_mistakes` <-> `delayed_reply_means_i_did_something_wrong` (Milestone I admission only), plus debug field `debug_milestone_i_family_compatible` to distinguish exact-family match vs compatible-family alignment in hosted QA.

## 2026-03-25 — Wisewave: v6 closure consideration

- **Agreed.** v6 appears to narrow the remaining weakness to a **residual generic H3 over-emission** pattern where the main reflection is already sufficient.
- Recommendation: run **one final narrow confirmation pass** (including the remaining rest/guilt edge case). If clean, move to **closure consideration / confirmation pass**.

## 2026-03-25 — Lumen + Wisewave: combined report (24–25)

- **Combined read** (benchmark 24th + reruns 25th): **H viable, not closure-clean**; preserve **H4** as calibration anchor; tighten **H3** significantly, **H1** moderately; **H5** narrow; suppression healthy. **7** workable, **14** soft, **25** not release-confidence clean — **no** hard-close; **narrowing** not closing. **`docs/HC_OS_V1_Milestone_H_Wisewave_Combined_Report_2026-03-24_to_2026-03-25.md`**. Pointer in Tree plan + Lumen QA Results.

## 2026-03-24 — Lumen + Wisewave: benchmark end-of-day summary

- Three suites on hosted (`lumen-daily-core-7`, `lumen-regression-14`, `lumen-confidence-25`) via custom queue rows; **passive vs benchmark suppression ratios must stay separate**. **`docs/HC_OS_V1_Milestone_H_Lumen_Wisewave_Benchmark_End_of_Day_Summary.md`**; pointer in **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`**, **`docs/QA_HANDOFF.md`** §8.

## 2026-02-09 — Observation tool: custom benchmark queue rows

- **`POST /api/internal/h-observation/queue/custom`** — exact `fullInput` / metadata (`benchmarkSet`, `benchmarkCaseId`, `benchmarkLayer`, `observationMilestone`, run fields). Prisma columns on `HObservationQueueItem`. Filter **`benchmarkSet`** on queue GET, summary, export, review list; **`__passive__`** = rows without `benchmarkSet`. **`PATCH .../queue/[caseId]`** can update `previewText`/`fullInput` while `queued`/`in_review`. UI: queue panel + review benchmark banner + prompt editor. **`prisma db push`** required for new columns.

## 2026-02-08 — Nova: Milestone H observation queue + logging UI (v1)

- **`docs/HC_OS_V1_Milestone_H_Nova_Observation_Queue_Tool.md`** — `lib/milestone-h-observation/*`, **`/internal/h-observation`**, **`/api/internal/h-observation/*`**, workspace store **`data/h-observation/`** (gitignored live JSON). Optional **`H_OBSERVATION_API_KEY`**. 30-scenario pack in code; real samples via `real-samples.json`. No auto milestone verdict.
