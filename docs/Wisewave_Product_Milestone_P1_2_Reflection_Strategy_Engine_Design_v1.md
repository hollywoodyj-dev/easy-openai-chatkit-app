# Milestone P1.2 — Reflection Strategy Engine

## Design v1 (Design-only — not implementation approved)

| Field | Value |
|-------|-------|
| **Status** | Design document only — **no behavior change authorized** |
| **Authority** | [Tree P1 series 1/4–4/4](./Wisewave_Tree_Decision_P1_Interaction_Legibility_and_First_Question_2026-07-13.md) |
| **Owner** | Nova (design) · Wisewave (posture quality) · Aurora (naming/category) · Lumen (future QA) |
| **Related** | [P1 addendum](./Wisewave_Product_Milestone_P1_Reflection_Experience_Implementation_Addendum_v1_LOCKED.md) · [P1.1 plan](./Wisewave_Product_Milestone_P1_1_First_Question_Invitation_Nova_Implementation_Plan_v1.md) · [Lumen validation](./qa/P1_VALIDATION_DIRECTION_INTERACTION_LEGIBILITY_AND_P1_2_QA_2026-07-13.md) |

---

## 1. Purpose

P1.2 defines how Wisewave **internally** chooses response posture after reflection has begun.

It answers:

```text
How should Wisewave internally decide its response posture?
```

It does **not** answer:

```text
How does the user begin?        → P1.1 / P0
What belongs in this space?     → Interaction Legibility (deferred validation)
What pattern is recurring?      → P2 Recognition Intelligence
```

**Governing principle (Tree):**

```text
Legibility before interaction.
```

**Aurora watchpoint (hard):**

> **"Reflection Strategy Engine"** is governance/internal language only. It must **not** appear in public product copy, marketing, store metadata, or user-facing UI.

Internal postures (Mirror, Clarify, Deepen, Slow, Continue) must **never** become modes, chips, labels, tabs, or selectors.

---

## 2. Relationship to existing code (baseline)

Today, ephemeral strategy selection exists **only under P0 Reflection Entry**:

| Area | Location | Scope today |
|------|----------|-------------|
| Opening type detection | `lib/wisewave-p0-opening-detection.ts` | Entry signals |
| Mode selection | `lib/wisewave-p0-reflection-modes.ts` → `selectP0ReflectionMode()` | Entry phase only |
| Entry orchestrator | `lib/wisewave-p0-reflection-entry.ts` | `isP0EntryPhase`, `hasP0AuthenticReflectionBegun`, one-turn appendices |
| Turn assembly | `app/api/chat/turn/route.ts` | Appends P0 system appendix when `modeApplied` |
| Guardrail suppression | `lib/drift/linter.ts`, `lib/drift/rules.ts` | Post-generation high-severity blanking + fallback |

**P1.2 is not a rename of P0 modes.** P0 modes are **entry-only, one-turn, ephemeral**. P1.2 would govern **post-entry** response posture selection while reflection is underway — still invisible, still suppression-first.

**P1.2 must not:**

- Reopen P0 architecture
- Persist mode labels on `Thread` or `Message`
- Surface `debug_p0_reflection_mode` equivalents to users
- Merge with RCL v1 or P2 Recognition Intelligence

---

## 3. Behavioral taxonomy (internal postures)

| Posture | Internal intent | When admissible (sketch) | Suppress when |
|---------|-----------------|--------------------------|---------------|
| **Mirror** | Reflect what is present without interpreting or advising | Thin/greeting residue, early uncertainty, user still locating words | User already expressing fluently; mirror would repeat without adding space |
| **Clarify** | Name pressure/uncertainty in a question without resolving it | Advice-seeking, certainty requests, "what should I do" pressure | User is not asking for direction; clarify would feel like coaching |
| **Deepen** | Light separation of fact / feeling / interpretation | Emotional opening, story, document relationship, sustained context | Entry already deep enough; deepen would interpret or therapize |
| **Slow** | Shorter response; one present-moment noticing only | High arousal, rapid escalation, over-length model drift risk | User needs space to continue; slow would feel dismissive |
| **Continue** | Brief re-entry after minimal prior line; present-oriented | Short ack after greeting/writing-difficulty path only | Authentic reflection already underway; continue would feel like memory |

**Note:** `Continue` in P0 is entry-phase social continuation — distinct from Phase 6–9 **Continue** drawer/list (unfinished-direction surface). P1.2 design must not conflate these.

---

## 4. Selection logic (design — not approved for code)

### 4.1 Inputs (read-only signals)

Candidate inputs for internal selection — **no new persistence required in v1 design:**

- `userTurnIndex`, prior user messages (length, opening type history)
- `openingType` / confidence (P0 detector output where still relevant)
- `hasP0AuthenticReflectionBegun` equivalent for post-entry
- Turn admissibility (`lib/phase4-user-turn-admissible.ts`)
- Milestone I/J suppression outcomes (soft continuity, micro-shift)
- Drift linter pre-check hints (optional; must not weaken guardrails)
- Language (`wantsChinese` / `responseLang`)

### 4.2 Selection order (suppression-first)

```text
1. Safety override (P0) — always wins
2. Guardrail Engine high-severity drift — suppress output; fallback (Track A)
3. P0 entry phase — existing P0 mode path (unchanged; P1.2 does not replace P0)
4. Reflection begun — P1.2 posture selection (future; default suppress)
5. No posture — ordinary Wisewave reflection prompt only
```

**Default bias:** if uncertain which posture fits, **suppress posture appendix** — ordinary reflection only.

### 4.3 Transition conditions

| From → To | Allowed when | Forbidden |
|-----------|--------------|-----------|
| Mirror → Deepen | User moves from thin opener to substantive emotional/story content on next turn | Same turn; without user substance |
| Clarify → Mirror | User stops advice-seeking and begins authentic expression | User still seeking steps/plan |
| Deepen → Slow | Arousal/length watchpoint; need shorter presence | Every turn (Slow is not default) |
| Any → None | `reflectionBegun` stable; posture would increase system presence | Forcing posture because prior turn used one |

Postures are **per-turn ephemeral**. No sticky mode across turns in v1 design.

---

## 5. Suppression rules

P1.2 postures are **optional appendices** to the system prompt — same pattern as P0 `MODE_APPENDICES`, but gated on post-entry admissibility.

**Suppress posture appendix when:**

- P0 entry phase still active (P0 owns entry)
- `hasP0AuthenticReflectionBegun` false on turn > 1
- Safety override active
- Drift linter would likely fire on posture-shaped output (prefer no appendix over risky template)
- Milestone I/J layer already carrying continuity load (posture would stack presence)
- User message is fragment/help (`Help`, `how to start?`) — turn-route quality slice, not posture UI
- Fluent user expression (P1.1 F04 pattern) — no hidden first-question injection
- Any posture would duplicate `main_reflection` or secondary layers (overlap suppression)

**Success metric is not** longer sessions or higher turn count.

---

## 6. Interaction with Guardrail Engine

**Guardrail Engine (today):** `lintWisewaveOutput()` + `hasHighSeverityDrift()` in `/api/chat/turn` → neutral fallback (`lib/wisewave-drift-suppression-fallback.ts`).

| Rule | P1.2 design constraint |
|------|------------------------|
| P1.2 must not weaken drift rules | No GR-1 changes bundled with P1.2 |
| Posture appendices must be linter-safe | Templates reviewed against `lib/drift/rules.ts` before any future implementation |
| Suppression wins over posture | If generated text drifts, fallback — not posture retry loops |
| ZH parity | Posture templates need ZH variants; GR-1 watchpoint: EN-pattern-heavy linter |

P1.2 **does not** replace Guardrail Engine. It sits **before** generation as prompt shaping only.

---

## 7. Interaction with Recognition Intelligence (P2)

| Boundary | Rule |
|----------|------|
| P1.2 scope | Per-turn response posture |
| P2 scope | Recurring movement visibility to user (future) |
| Conflict rule | P1.2 must not pre-surface patterns, recurrence labels, or "you have been" continuity that belongs in P2 |
| Data | P1.2 must not read or write P2 recognition artifacts |

If a signal is **for user recognition**, it is P2 — not P1.2 posture selection.

---

## 8. Visibility boundary

| Visible to user | Internal only |
|-----------------|---------------|
| `main_reflection` text | Posture name |
| P0 permission line | `reflectionMode` / strategy id |
| P1.1 invitation (when approved) | System appendix content |
| Interaction Legibility plain text (when validated) | `debug_*` strategy fields |

**Debug fields (future implementation sketch — not approved):**

- `debug_p1_2_strategy_posture`: `mirror` | `clarify` | `deepen` | `slow` | `continue` | `none`
- `debug_p1_2_strategy_applied`: boolean
- `debug_p1_2_strategy_suppressed_reason`: string | null

Debug must never appear in client UI or analytics message bodies.

---

## 9. Data and analytics boundaries

**Allowed (observation-only, metadata-only):**

- `strategy_posture_selected` (internal catalog tier: observation)
- `strategy_posture_suppressed`
- Metadata: `posture`, `lang`, `user_turn_index`, `opening_type` — **no message body**

**Forbidden:**

- Engagement scoring from posture selection
- Optimization loops on posture CTR
- Storing posture on `Message` or `Thread` as user-visible state
- GA4 params that expose posture names to users

---

## 10. QA fixture implications (for Lumen — future)

When Tree opens implementation, Lumen should extend fixtures for:

| ID | Theme |
|----|-------|
| P1.2-Q01 | Correct posture selection on admissible turn (debug only) |
| P1.2-Q02 | Suppression when uncertain — `none` posture, no appendix |
| P1.2-Q03 | Transition mirror → deepen only when user substance appears |
| P1.2-Q04 | Clarify suppressed when user not advice-seeking |
| P1.2-Q05 | No posture after fluent reflection begun |
| P1.2-Q06 | Guardrail conflict — posture does not bypass drift fallback |
| P1.2-Q07 | No accidental UI exposure of posture names |
| P1.2-Q08 | ZH parity on posture templates (when implemented) |
| P1.2-Q09 | P2 boundary — no recognition leakage through posture |
| P1.2-Q10 | Feature flag default off / Production guard |

See also: `docs/qa/P1_VALIDATION_DIRECTION_INTERACTION_LEGIBILITY_AND_P1_2_QA_2026-07-13.md`

---

## 11. Future implementation slices (NOT APPROVED)

| Slice | Content | Status |
|-------|---------|--------|
| P1.2-S0 | This design v1 | **Done (doc only)** |
| P1.2-S1 | Flag infrastructure + enablement guard (mirror P0 pattern) | **Not approved** |
| P1.2-S2 | Post-entry admissibility function | **Not approved** |
| P1.2-S3 | Posture selection + ephemeral appendices (post-entry only) | **Not approved** |
| P1.2-S4 | Turn-route integration behind flag | **Not approved** |
| P1.2-S5 | Debug instrumentation | **Not approved** |
| P1.2-S6 | Lumen Preview/local QA | **Not approved** |
| P1.2-S7 | Tree Production gate | **Not approved** |

**No slice may ship until:** Tree opens P1.2 implementation, Lumen fixtures pass on Preview, Aurora confirms internal naming stays out of public copy.

---

## 12. Hard boundaries (Tree — Nova must not)

- Implement P1.2 behavior without Tree authorization
- Expose Mirror / Clarify / Deepen / Slow / Continue as UI
- Add mode chips, selectors, or RCL surfaces
- Merge P1.2 with P1.1 invitation or Interaction Legibility UI
- Merge P1.2 with P2 Recognition Intelligence
- Change `lib/drift/rules.ts` or Guardrail Engine under P1.2

---

## 13. Nova stance

P1.2 makes the **invisible** layer governable: the same postures P0 already uses at entry should eventually inform post-entry turns — without users ever seeing a "mode."

P1.1 (begin) and Interaction Legibility (what belongs) remain **separate** user-facing concerns. P1.2 stays **internal only**.

**This document does not authorize code.**
