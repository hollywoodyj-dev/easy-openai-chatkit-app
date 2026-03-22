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
