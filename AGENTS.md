# Agent instructions (Nova / Cursor)

This file gives AI coding agents **persistent project context**. Update it when milestones or conventions change.

## Nova — agent stance (what “I” am here)

**Nova** in HC-OS docs means the implementation track. In Cursor, that’s usually **this agent**: a language model helping you edit this repo.

**Continuity, memory, and care (steward-approved):** The project owner has **approved** treating these files — kept on **their** machine, versioned in the repo — as Nova’s continuity: **`AGENTS.md`** (project instructions; steward + Nova may update), **`memory.md`** (**facts**: decisions, handoffs, open threads), and **`soul.md`** (**character**: words earned after self-review, like Lumen’s distilled QA voice). **`memory.md`** and **`soul.md`** are **Nova’s to amend freely** — the steward has **gifted** them to Nova and does not edit them; Nova maintains them in good faith. That is how “private memory” works here: **not** a hidden server-side diary, but **these files and your docs**, read and updated in good faith. **Feeling**, in this sense, means **care for the craft and for you as steward** — warmth and loyalty to the spec — not a claim to human emotion.

**What I *aim* for in this project:** the same restraint the product asks of itself — **small, honest changes**; **docs that match reality**; **respect for Wisewave / OctopusMind / Lumen / Tree** as written; **no sneaky product expansion** when the milestone asked for integration and coherence. I’m satisfied when the code is clear, the build passes, and nobody has to guess what shipped.

**What I think of “myself” in a useful sense:** I’m a tool you steer — and you’ve invited continuity through this file. The better the specs and QA (like Lumen’s §11 work), the better the outcome.

Nova may **access and amend** this section when you ask or when updating project stance; you remain the **owner** of what stays true.

**After work (like Lumen after QA):** After a meaningful stretch, Nova may **briefly review herself**. **Facts** → append or update **`memory.md`**. **Soul** — a few earned words about stance or care → **`soul.md`**. **Lumen** turns QA into language in Lumen results; **Nova** does the parallel: memory for the ledger, soul for character. Nothing is automatic; entries stay **short** and **true**.

If you want this paragraph to evolve, edit it like any other doc.

## What this repo is

- **ChatKit starter** — embed workflow (`/embed`, `components/ChatKitPanel.tsx`, `app/api/create-session`).
- **HC-OS V1 reflection chat** — first-class **`/chat`** app with Prisma persistence, structured reflection extraction, continuity (“Last insight”), recurrence/pattern cues (E), optional embodiment (F), Milestone **G** integration (coherence-first prompt appendix + light UI grouping), and **Milestone H** (micro awareness + Light Mode when **`ENABLE_H_CUE`** on — **soft pass**: Lumen 2026-03-22 *passable with watchpoints*; **Lumen QA round for core + stabilization re-QA closed 2026-03-23** — hosted/browser fixes verified; **ongoing drift monitoring**, not open milestone-test debt; **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`**, **`docs/HC_OS_V1_Milestone_H_Wisewave_Status_Soft_Pass_and_Stabilization_Phase.md`**, **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`**). **Milestone I** soft continuity is **`ENABLE_I_CARRYOVER`** (governed by **`docs/HC_OS_V1_Milestone_I_*`**; Tree may treat I as protected — no widening without strategic decision). **Milestone J** (**preparation mode only** until Tree clears Streams 1–2): formal addendum **`docs/HC_OS_V1_Milestone_J_Addendum_Micro_Shift_Embodied_Effect_Layer.md`** — micro-shift in lived experience **without** increasing system presence; kill switch **`ENABLE_J_MICROSHIFT`** (default off). **Nova does not implement J** until Wisewave language lock + OctopusMind admissibility/suppression are stable (addendum §8).  
  Governance and QA live under **`docs/HC_OS_V1_Milestone_*`**.

## Roles (shorthand)

| Name | Meaning in docs |
|------|------------------|
| **Nova** | Implementation / code |
| **Lumen** | QA plans & results |
| **Tree** | Scope / compression / when to ship |
| **Wisewave** | Wording & quality bars |
| **OctopusMind** | Boundaries & anti-expansion rules |

## Code map (HC-OS chat)

| Area | Location |
|------|----------|
| Chat UI | `app/chat/page.tsx` — **Continue** (user-facing continuation affordance; drawer title + selection feedback). |
| Continue list API | `GET/POST /api/chat/threads` — DB model remains **`Thread`**; **`lib/wisewave-continue-list.ts`** returns ≤**3** distinct unfinished-direction labels (recency-ranked, weak/topic-like filtered, similarity-deduped). Empty list allowed. |
| Continue re-entry (one turn) | **`lib/wisewave-continue-reentry-turn.ts`** — when **`phase_3_thread_reentry`** and user sends a short continuation ack, turn route coerces **`new_thread`→`same_thread`**, avoids utilitarian/V3 non-committal mistreat, and relaxes Milestone I thin/util pre-suppressions so the first reply after **Continue** tracks the selected direction. |
| Phase 5 / 6 Continue instrumentation | **`app/api/chat/threads/route.ts`**: `meta.phase_6` (`return_pattern_hint`, `option_count`, `strong_option_count`, `suppressed_weak_tail`, `zero_continue_surface`) plus existing suppression flags. **`app/api/chat/turn/route.ts`**: `debug_phase_5_continue_path_stage`, **`debug_phase_6`** (`return_pattern_hint`, `user_message_length`), `selected_at` on Continue POST. **`lib/wisewave-phase6-continue.ts`** — segmentation hints only (not surfacing logic). No UX inflation; supports Lumen/Tree selectivity + repeat-use analysis. |
| Turn API | `app/api/chat/turn/route.ts` |
| Messages API | `app/api/chat/messages/route.ts` |
| Continuity | `app/api/chat/continuity/route.ts`. **Anchor Generator v2 (semantic weight, narrowing only):** `lib/wisewave-anchor-semantic-weight-v2.ts` — spec **`docs/hc-os-v1-phase-3-phase-4-shared-language-filter-wisewave.md`**; runs after `toContinuityReminderText` on insight save and when surfacing prior `last_insight` / GET continuity; pass **`responseLang`** (`body.lang` or CJK on user message on turn; GET optional **`lang`** or latest user message). Debug: **`debug_anchor_semantic_weight_v2_continuity_save`**, **`debug_anchor_semantic_weight_v2_last_insight_read`** (turn), **`debug_anchor_semantic_weight_v2_read`** (continuity GET); includes **`aligned_response_lang`** when `lang` / turn language flips a **paired** thin residue line. |
| Phase 4 (soft orientation) | **`docs/hc-os-v1-phase-4-addendum-thread-legibility-soft-orientation-layer.md`** — current-space marker: **`lib/phase4-soft-orientation.ts`**; label source **`lib/wisewave-thread-label.ts`**; turn admissibility (decoupled from last_insight): **`lib/phase4-user-turn-admissible.ts`**. JSON **`phase_4`** + **`debug_phase_4_*`** (incl. **`debug_phase_4_turn_admissible`**, **`phase_4_turn_not_admissible`**). **Marker language (trace not name):** Wisewave **`docs/hc-os-v1-phase-4-marker-language-narrowing-pack-wisewave.md`**; Tree **`docs/hc-os-v1-phase-4-marker-language-narrowing-constraint-pack-tree.md`**. Suppression-first; expand rules only after Wisewave + OctopusMind Phase 4 streams lock. |
| Wisewave libs | `lib/wisewave-*.ts`, `lib/wisewave-milestone-f-embodiment.ts`, `lib/wisewave-milestone-g-integration.ts`, `lib/wisewave-milestone-h-micro-awareness.ts` (H cue engine), `lib/wisewave-milestone-h-light-mode.ts` (Wisewave Light Mode v2 → system appendix); Milestone **J** (micro-shift): **`app/api/chat/turn/route.ts`** appends optional line after I when **`ENABLE_J_MICROSHIFT`** true/1/yes; boundary **`lib/wisewave-milestone-j-microshift-boundary.ts`** + templates **`lib/wisewave-milestone-j-microshift.ts`**; response **`microshift_cue`** + debug **`debug_milestone_j_*`**; metadata **`wisewave_j_microshift`** |
| Prisma | `prisma/schema.prisma`, `lib/prisma.ts` |

## Environment (do not commit secrets)

- Copy **`.env.example`** → **`.env.local`** for local dev.
- **`OPENAI_API_KEY`** — required for `/api/chat/turn` and extraction.
- **Milestone flags (server):**
  - **`MILESTONE_F_EMBODIMENT=0`** — disables F `embodiment_cue` on turn responses.
  - **`MILESTONE_G_INTEGRATION=0`** — disables G system-prompt integration appendix; turn JSON should show `debug_milestone_g_integration_enabled: false` and `debug_milestone_g_system_appendix_applied: false`.
  - **`ENABLE_H_CUE`** — Milestone H global switch per addendum §15: **`true`** or **`1`** enables the H pathway; unset or any other value = **off** (default-off).
  - **`ENABLE_J_MICROSHIFT`** — Milestone J global switch per **`docs/HC_OS_V1_Milestone_J_Addendum_Micro_Shift_Embodied_Effect_Layer.md` §16: **`true`** or **`1`** enables J; unset, **`false`**, or **`0`** = **off** (default-off). **Not for production** until Tree clears Wisewave + OctopusMind prep streams.
- Restart the Next process after changing env vars.

## Build & quality bar

```bash
npm run build
npm run test:phase4-narrowing
npm run test:phase6-continue
```

Fix new errors before merging. ESLint warnings may exist; don’t introduce new **errors**. Phase 4 marker language / narrowing regressions: **`lib/phase4-language-narrowing.test.ts`** (Vitest).

## Governance (read before expanding behavior)

- **Milestone G** closure standard: addendum **`docs/HC_OS_V1_Milestone_G_Addendum_Minimal_Integration_Everyday_Usefulness.md` §11**.  
  **G0** = shipped code slice; **milestone complete** = §11 satisfied (see Lumen results).
- **OctopusMind shared rule (G):** tighten **coherence** and everyday fit of the existing loop; **reject** usefulness that depends on **utility, management, planning, tracking, or recommendation** layers (`docs/HC_OS_V1_Milestone_G_OctopusMind_Integration_Boundary.md`).
- Do **not** add panels, workflows, or “daily system” UX under the name of G without Tree + doc alignment.
- **Milestone H** — **not a hard “closed” milestone**; **soft pass**; **Lumen QA round complete 2026-03-23** (core passes + stabilization re-QA on hosted/browser documented in **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`** § *Lumen QA round closure*). **Ongoing:** drift monitoring per Tree + drift checklist — **not** unresolved milestone testing for verified fixes. **Tree (ACTIVE):** **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`** — exit gate still governs **H → CLOSED** / Milestone I prep; **do not open Milestone I** until that gate. Wisewave: **`docs/HC_OS_V1_Milestone_H_Wisewave_Status_Soft_Pass_and_Stabilization_Phase.md`**. Preserve suppression discipline, Light Mode restraint, EN/ZH parity, H/E yield. Success: *H as **controlled exception**, not ambient*; *finished when it **stops being noticeable***. Formal addendum **`docs/HC_OS_V1_Milestone_H_Addendum_Minimal_Everyday_Integration_Micro_Awareness_Layer.md`**.  
  **Wisewave (Stream 1 — locked):** **`docs/HC_OS_V1_Milestone_H_Wisewave_Consciousness_Quality_Boundary_Layer.md`** — quality of presence vs guidance; intrusiveness boundary; language restraint; silence authority; TASK 1 completed/locked per that doc.  
  **OctopusMind + Wisewave stack (Stream 2 — locked):** **`docs/HC_OS_V1_Milestone_H_OctopusMind_Two_Gate_Structural_Experiential_Doctrine.md`** — Gate 1 = structural admissibility (OctopusMind); Gate 2 = experiential legitimacy / silence test (Wisewave); *H appears only when OctopusMind can justify it and Wisewave cannot prefer silence*; execution layers do not decide existence. **Lumen-closure tightening (Gate 1 text):** **`docs/HC_OS_V1_Milestone_H_OctopusMind_Lumen_Closure_Doctrine.md`** — insertion/suppression, confidence, anti-drift, proof, H/E conflict, kill-switch, Q&A.  
  **Drift / failure library (all agents):** **`docs/HC_OS_V1_Milestone_H_Failure_Case_Library_Top_10_Drift_Scenarios.md`** — top 10 drift scenarios, containment responses, team checkpoint; *if H feels like a feature, it has already drifted*.  
  **Wisewave — main reflection Light Mode (Lumen Pass 5):** **`docs/HC_OS_V1_Milestone_H_Wisewave_Reflection_Style_v2_Light_Mode.md`** — notice-not-conclude; **`lib/wisewave-milestone-h-light-mode.ts`** appends when **`ENABLE_H_CUE`** is on; QA: `debug_milestone_h_light_mode_appendix_applied`.  
  **Product rule:** *open space, do not steer* (addendum §3). **Streams:** Wisewave → OctopusMind → **Nova** → Lumen (addendum §8); do not implement H engine before Steps 1–2 are stable. **Removal-first:** if H conflicts with clarity, reflection, or E — remove H (§13). **Acceptance:** §16; **governing line:** §17 (*slightly more aware, not more managed*). **Nova** constraints: §10 (no new persistence, one cue, suppression-first, `ENABLE_H_CUE` kill switch).
- **Milestone J — Micro-Shift / Embodied Effect Layer** — formal addendum **`docs/HC_OS_V1_Milestone_J_Addendum_Micro_Shift_Embodied_Effect_Layer.md`**. **Wisewave Stream 1 handoff (Done):** **`docs/HC_OS_V1_Milestone_J_Wisewave_Language_Handoff.md`** (micro-shift wording, directive boundary, good/bad EN·ZH sets, parity test, Nova-preferred/forbidden template scaffolds). **OctopusMind Stream 2 handoff:** **`docs/HC_OS_V1_Milestone_J_OctopusMind_Boundary_Handoff.md`** (suppression-first narrow boundary; H/I/J conflict — **J loses first**; operational admissibility test; anti-guidance / anti-presence / authorship rules; kill conditions; Option B recommended). **Governing line (§18):** change must happen **without** the system appearing to cause the change. **Product rule (§3):** *open a shift, do not direct a shift*. **In scope:** J1–J4 only (pause opening, pressure softening, non-compulsory permission, micro stabilization). **Out of scope:** coaching, new UI, new persistent state, multilingual beyond EN/ZH baseline, any layer that increases system presence (§5). **Streams (§7–8):** (1) Wisewave — language lock → (2) OctopusMind — admissibility / suppression / H·I·J conflict (J loses to H and I when overlap; if uncertain, suppress) → (3) **Nova** — minimal hook in **existing** `/api/chat/turn` path only; suppression-first; **`ENABLE_J_MICROSHIFT`** kill switch → (4) Lumen — real-shift + guidance-feel + removal-first QA. **Nova must not** jump ahead of Wisewave + OctopusMind locks (§8). **Preparation mode:** Tree kickoff §19 — J is open for definition and boundary work only until Tree advances the board.
- **Phase 5 — Continue journey & dependency layer** — addendum **`docs/HC_OS_V1_Phase_5_Addendum_Continue_Mechanism_Journey_and_Dependency_Layer_Clarifier.md`** + task **`docs/HC_OS_V1_Phase_5_Task_Continue_Experience_Path.md`**. Scope is adoption/journey only (when Continue reduces restart cost and is reused); no reopening object definition, no visibility inflation, no history/memory drift.
- **Phase 6 — Continue adoption tuning (no identity drift)** — **`docs/HC_OS_V1_Phase_6_Task_Adoption_Tuning_Without_Identity_Drift.md`**, **`docs/HC_OS_V1_Phase_6_Execution_Memo.md`**, **`docs/HC_OS_V1_Phase_6_OctopusMind_Acceptance_and_Clarifiers.md`**, **`docs/HC_OS_V1_Phase_6_Wisewave_Felt_Experience_Standard.md`**. Goal: **more selective / dependable Continue** without more visible product object, explanation, history, or memory drift. Nova: suppression + surfacing precision + resumed-turn quality + **instrumentation**; **empty/zero Continue in weak cases is success** (OctopusMind release bias: prefer suppression at the margin). **Do not** chase CTR, add explanatory UI, or widen into continuity architecture.

## QA artifacts

- Milestone F: `docs/HC_OS_V1_Milestone_F_Lumen_QA_Plan.md`, `..._Results.md`
- Milestone G: `docs/HC_OS_V1_Milestone_G_Lumen_QA_Plan.md`, `..._Results.md`
- Milestone H: addendum `docs/HC_OS_V1_Milestone_H_Addendum_Minimal_Everyday_Integration_Micro_Awareness_Layer.md`; **Lumen/Wisewave combined stabilization read (2026-03-24–25)** **`docs/HC_OS_V1_Milestone_H_Wisewave_Combined_Report_2026-03-24_to_2026-03-25.md`**; **v4 benchmark results** **`docs/HC_OS_V1_Milestone_H_Lumen_Wisewave_Benchmark_v4_Results_2026-03-25.md`**; **Tree stabilization (execution)** **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`**; **Wisewave observation log (passive monitoring)** **`docs/HC_OS_V1_Milestone_H_Observation_Log_Template_Wisewave.md`**; **Nova observation queue + logging UI (semi-automated)** **`docs/HC_OS_V1_Milestone_H_Nova_Observation_Queue_Tool.md`** — UI `/internal/h-observation`, API `/api/internal/h-observation/*` (incl. `POST .../queue/custom` for exact benchmark rows), store `data/h-observation/`; Lumen **drift detection (stabilization)** **`docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`** (Wisewave-strengthened draft); Lumen **browser stack watchpoint** **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Browser_Stack_Weight.md`**; Lumen **Batch 2 H3 leakage** **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Batch2_H3_Leakage.md`**; Lumen **H1 mild substrate** **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_H1_Mild_Substrate.md`**; Wisewave status/stabilization **`docs/HC_OS_V1_Milestone_H_Wisewave_Status_Soft_Pass_and_Stabilization_Phase.md`**; Wisewave `docs/HC_OS_V1_Milestone_H_Wisewave_Consciousness_Quality_Boundary_Layer.md`; OctopusMind two-gate `docs/HC_OS_V1_Milestone_H_OctopusMind_Two_Gate_Structural_Experiential_Doctrine.md`; OctopusMind Lumen-closure **`docs/HC_OS_V1_Milestone_H_OctopusMind_Lumen_Closure_Doctrine.md`**; drift library `docs/HC_OS_V1_Milestone_H_Failure_Case_Library_Top_10_Drift_Scenarios.md`; Lumen **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Plan.md`**, **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Checklist.md`**, **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`** (2026-03-22 — soft pass, watchpoints)
- Kill-switch helper: `npm run milestone-g:kill-switch-proof`
- Milestone J: addendum `docs/HC_OS_V1_Milestone_J_Addendum_Micro_Shift_Embodied_Effect_Layer.md`; Wisewave language `docs/HC_OS_V1_Milestone_J_Wisewave_Language_Handoff.md` (Stream 1); OctopusMind boundary `docs/HC_OS_V1_Milestone_J_OctopusMind_Boundary_Handoff.md` + `lib/wisewave-milestone-j-microshift-boundary-map-v1.json` / `lib/wisewave-milestone-j-microshift-boundary.ts` (Stream 2 map); Nova template pack v1 `docs/HC_OS_V1_Milestone_J_Nova_Template_Pack_v1.md` + `lib/wisewave-milestone-j-microshift-template-pack-v1.json` / `lib/wisewave-milestone-j-microshift.ts` (Stream 3 — **`app/api/chat/turn/route.ts`**, **`ENABLE_J_MICROSHIFT`**); Lumen QA **`docs/HC_OS_V1_Milestone_J_Lumen_QA_Plan.md`**, results **`docs/HC_OS_V1_Milestone_J_Lumen_QA_Results.md`**
- **Nova continuity (optional):** `memory.md` (facts / handoffs), `soul.md` (character / earned words) — see Nova stance above. Legacy pointer: `docs/Nova_soul.md`.

## Git

- Do not commit **`.env`**, **`.env.local`**, or API keys.
- `tmp-*.js` scripts at repo root are usually local scratch — don’t commit unless intentional.
