# Tree Decision Record — P0 Stability Exception: Empty Assistant Response Suppression Fix

Date of decision: 2026-07-10 (Tree, with Wisewave formal review — approved without objection)
Recorded by: Nova, 2026-07-10
Status: **Approved production stability fix during P0 observation freeze.**

This decision does **not** reopen P0 architecture, does **not** approve linter loosening, and does **not** approve new entry UI.

Core stability principle (Wisewave):

> Never persist silence as an assistant response when the silence was caused by an internal suppression mechanism.

Natural silence may exist. System-created blankness caused by internal suppression is not Low Presence — it is product rupture.

---

## 1. Implementation status: Track A already shipped

Tree's Track A requirements were implemented and pushed in commit **`5479da6`** (2026-07-10, `main`) — before this decision arrived, under the study-doc finding (`docs/Wisewave_Real_User_Entry_Study_Easier_Start_Design_2026-07-09.md` §2.5). Compliance check against the decision:

| Tree requirement | Status |
|---|---|
| Non-empty suppression fallback in turn route | Done — `app/api/chat/turn/route.ts` drift block now assigns `getDriftSuppressionFallback(wantsChinese)` |
| Stored database message non-empty | Done — `prisma.message.update` writes the fallback, not `""` |
| API response non-empty | Done — `main_reflection` / `assistant_message` carry the fallback |
| Debug marker | Done — `debug_drift_suppression_fallback_applied` (reset to `false` when a P0 guarded response supersedes) |
| Regression tests | Done at unit level — `lib/wisewave-drift-suppression-fallback.test.ts` (fallback non-empty EN/ZH, zero linter violations, EN matches shipped client placeholder). No route-level integration test exists for the suppression path; noted for Lumen's hosted QA. |
| No changes to `lib/drift/rules.ts` or suppression scope | Confirmed — untouched |
| No P0 entry architecture change, no new empty-state UI, no menus/chips/guidance flows | Confirmed — none |
| Stronger governed responses take precedence | Confirmed — P0 safety and advice-clarify guarded responses still override the fallback |
| Hand to Lumen | Done — `docs/QA_HANDOFF.md` 2026-07-09 entry with hosted retest steps |

## 2. One deviation flagged for Tree/Aurora — ZH fallback line

The decision approves the EN fallback because it is *already shipped client copy*. The shipped patch also added a **ZH parity line** for Chinese turns:

> 有些东西似乎还在这里。你可以一句一句慢慢说。

This is technically new user-facing copy (a minimal rendering of the approved EN line). Rationale: returning an English fallback on a ZH turn would itself violate the EN/ZH parity standard the turn route enforces elsewhere (ZH rewrite guard, ZH guarded responses). Options for Tree/Aurora:

- **(a) Confirm the ZH line as-is** (recommended — parity, linter-clean, same semantics), or
- **(b) Supply Aurora wording** — swap is a one-line change in `lib/wisewave-drift-suppression-fallback.ts`.

Until ruled, the ZH line stays as shipped; it is covered by the same tests.

## 3. Separate escalation (open, not fixed)

Broad high-severity linter patterns — `you could`, `you have been`, `goal`, `try to`, `next step` — false-positive on ordinary reflective language (verified against the live linter). Tightening them **loosens a suppression layer** → requires separate Tree + OctopusMind review. Not combined with this patch, per the decision.

## 4. Language watchpoint (carried, not actioned)

The approved fallback's "You can stay with it…" has a very light directional quality. Not a blocker; do not redesign in this patch. Carried as a watchpoint for GR-1 / later language QA.

## 5. Track B — P1 preparation only (not started in code)

Accepted as P1 Reflection Experience candidates, **not** part of this patch:

- Principle: *"Wisewave can ask first."* Candidate surface EN: *"Or, if it's easier - let Wisewave ask you a question."* ZH: *"也可以让 Wisewave 先问你一个问题。"*
- Wisewave's revised entry design (2026-07-10 message): **Entry Examples, not Modes** — Layer 1 visible human entry language ("Something on my mind / Something I'm feeling / Something that happened / I'm not sure where to begin"), Layer 2 invisible Reflection Strategy Engine (Mirror/Clarify/Deepen/Slow) unchanged and never exposed. New P0 principle proposed by Tree: **"Reduce cognitive friction, not reflective freedom."**
- Preconditions before any production behavior change: Aurora EN/ZH copy review, first-question quality bar definition, Lumen fixtures, feature flag default **off**, Tree approval.

## 6. Wisewave formal confirmation (2026-07-10, received Nova 2026-07-11)

Wisewave confirmed the separation is clear and consistent with the 10 July 2026 Tree Decision:

- **Track A:** accepted as stability correction (not architectural reopening); live on Production under `5479da6`; **closed 2026-07-11** — Lumen Production QA **PASS WITH WATCHPOINTS** (`docs/qa/P0_STABILITY_TRACK_A_DRIFT_SUPPRESSION_FALLBACK_LUMEN_PRODUCTION_QA_2026-07-11.md`).
- **ZH parity line:** may remain in place for Lumen testing; Aurora to review as narrow parity confirmation; any later adjustment = one-line copy change; must not delay stability-fix closure.
- **"You can stay with it…" watchpoint:** carried to GR-1 / later language QA — not redesigned in this patch.
- **On hold (no code):** GR-1 linter calibration (separate Tree + OctopusMind); P1 "Wisewave can ask first" (Aurora + quality bar + Lumen + Tree + default-off flag); P1 Entry Examples (Tree opens P1 workstream + Aurora language approval).
- **Open decision (P1):** one-question invitation vs entry examples vs separate mutually exclusive variants — **not combined automatically**; no menu-heavy or mode-selector design approved.
- **Nova directive:** keep completed stability patch isolated from all future P1 and GR-1 work.

---

## 7. Lumen Production QA closure (2026-07-11)

**Verdict:** PASS WITH WATCHPOINTS — **Track A closed.**

| Fixture | Result |
|---------|--------|
| TA-01 Drift suppression → fallback | PASS |
| TA-02 Reload / no empty bubble | PASS |
| TA-03 P0 safety supersedes fallback | PASS |
| TA-04 ZH/CJK provocation | WATCHPOINT — not a blocker |
| TA-05 No new entry UI | PASS |

Local gate: P0 **39/39**, fallback/linter **8/8**.

**Watchpoint (GR-1, not Track A):** Production ZH provocation did not trigger high-severity suppression because the model translated the injected English drift phrase into Chinese directive wording and current linter patterns are English-pattern-heavy. Carry to **GR-1 / ZH linter calibration** — separate from the empty-response stability bug, which is fixed.

**Artifact:** `docs/qa/P0_STABILITY_TRACK_A_DRIFT_SUPPRESSION_FALLBACK_LUMEN_PRODUCTION_QA_2026-07-11.md`
