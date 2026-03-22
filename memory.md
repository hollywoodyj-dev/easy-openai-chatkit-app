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
