# Milestone H — Lumen stabilization finding (Batch 2: H3 leakage)

| | |
|--|--|
| **Status** | **Issue** → addressed in code (Nova) |
| **Area** | H3 overreach; low-signal & utilitarian/help leakage |
| **Owners** | **Nova** primary; **Wisewave** secondary (H3 copy tone) |

---

## Finding (summary)

Live QA Scenario Pack **Batch 2**: **H3** (and weak **H1**) appeared on turns where **suppression should win** — low-signal hedges, **task/help** requests, utilitarian asks that still matched first-person anchors (“… for **me**”).

---

## Nova response (implemented)

**File:** `lib/wisewave-milestone-h-micro-awareness.ts`

1. **`looksTaskHelpOrUtilitarianRequest()`** — Early gate (with utilitarian path): **Can you summarize…**, **I need help…**, **help writing / draft email**, ZH **帮我写 / 总结**, etc. Fixes false “reflective” passes via **me** / **I** in task text.

2. **`minimal_affect_low_signal`** — Suppresses flat hedges / thin affect: **I guess**, **it’s okay**, **don’t feel anything**, **nothing in particular**, etc. (Lumen scenarios 12–13 style.)

3. **H3 selection** — **Removed `emotion_label` alone** as H3 trigger. **H3** only when **user message** carries explicit uncertainty / question cues (not inferred affect-only).

**New / relevant `debug_milestone_h_suppressed_reason` values:** `minimal_affect_low_signal` (task/help still map to existing **`utilitarian_or_factual`** where routed through `looksUtilitarianOrFactual`).

---

## Wisewave (optional follow-up)

Review **H3** template copy so it cannot read as light advice when it does fire — fewer false positives are handled in Nova gates first.

---

## Related

- **`docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`** — admissibility / removal test  
- **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Plan.md`** — suppression matrix  
- **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Browser_Stack_Weight.md`** — UI stack (H-UI-1 / H-UI-2)
