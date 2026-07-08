# Wisewave Product Milestone P0 — Reflection Entry

## Nova Implementation Plan v1

| Field | Value |
|-------|-------|
| **Status** | Draft for Nova execution |
| **Authority** | [P0 Implementation Addendum v1.0 (Locked)](./Wisewave_Product_Milestone_P0_Reflection_Entry_Implementation_Addendum_v1_LOCKED.md) |
| **Governance** | [HC-OS Core v1.0 Lock — Nova Directive](./hc-os/HC_OS_CORE_V1_LOCK_NOVA_IMPLEMENTATION_DIRECTIVE.md) · [Lumen QA Protocol](./qa/HC_OS_CORE_V1_LUMEN_QA_PROTOCOL.md) · [Semantic Governance Lock v1.1](./Wisewave_Semantic_Governance_Lock_v1.1.md) |
| **Owner** | Nova (implementation) · Aurora (entry copy) · Lumen (QA) · Tree (exit) |

---

## 1. Purpose

This plan maps **P0.1–P0.7** to the existing Wisewave codebase and defines a **minimal, restraint-first** implementation sequence.

**Governing oath (from P0):**

> Entry Intelligence must reduce friction without increasing system presence.

**Do not build:** prompt library, journaling templates, coaching flow, reflection wizard, AI onboarding, retention loops, visible mode labels.

---

## 2. Preconditions (Tree order)

| Step | Work | Blocker for P0 code? |
|------|------|----------------------|
| **A** | HC-OS Core v1 **Phase 1 docs** drafted (Constitution, A–J ops defs, protocol, suppression, distortion map) | Soft — P0 must align; parallel doc work OK |
| **B** | Aurora semantic review on **any public entry copy** (P0.4, P0.5, homepage hero if touched) | **Hard** for copy deploy |
| **C** | Lumen fixture plan for entry openings (greeting, advice-seek, question-request, document, silence) | Soft until first slice ships |

P0 architecture is **locked** — no reopening without Tree.

---

## 3. Current codebase baseline

### 3.1 What already exists (reuse, do not duplicate)

| Area | Location | Relevance to P0 |
|------|----------|-----------------|
| Chat UI + input | `app/chat/page.tsx` | Empty thread, placeholder `"Speak freely."`, perception idle hint, Continue drawer |
| Turn API | `app/api/chat/turn/route.ts` | System prompt assembly, H/I/J layers, conversion events, debug fields |
| Core prompts | `lib/wisewave-prompts.ts` | Reflection boundaries; crisis line (prompt-level, not structured Safety Override) |
| Phase 4 admissibility | `lib/phase4-user-turn-admissible.ts` | Turn gating — entry should not fight this |
| Continue re-entry | `lib/wisewave-continue-reentry-turn.ts` | **Not** entry — post-entry only; keep separate |
| Conversion catalog | `lib/wisewave-conversion-tracking.ts` | `first_reflection_started`, `first_reflection_completed` |
| Server persist | `lib/record-conversion-event.ts`, `pages/api/marketing/conversion-event.ts` | Beacon + DB |
| Client analytics | `lib/wisewave-analytics.ts`, `app/chat/page.tsx` | GA4 mirror via `conversion_events` |
| Start page | `app/(wisewave-site)/start/page.tsx` | Pre-chat expectation setting |
| Semantic checks | `lib/semantic-governance/*`, `npm run semantic:check` | Aurora gate for copy |

### 3.2 Gaps (net new for P0)

| Component | Status |
|-----------|--------|
| Opening Detection Engine (internal) | **Not built** |
| Ephemeral Reflection Modes (Mirror/Clarify/Deepen/Continue/Slow) | **Not built** |
| Slash commands | **Not built** |
| Permission-first empty state copy (P0.4/P0.5) | **Partial** — `"Speak freely."` is OK; perception hints are continuity-oriented, not permission |
| Early Exit Detection (one invitation) | **Not built** |
| Entry analytics events (P0.7) | **Partial** — only `first_reflection_*` |
| Structured Safety Override (pause Entry) | **Prompt-only** today |

### 3.3 Real-user evidence (2026-07-08 export)

Seven real users validated these **opening types** in production:

- Emotional direct (`I'm worried…`, `I feel the opposite of whole…`)
- Greeting (`Hi`)
- Question request (`could you ask me some questions`)
- Advice-seeking undertone (`I need self reflection…`)
- Document / long context (clinical placement paste)
- Writing difficulty (implicit in short tries)

Fixture seeds: `tmp_reflection_export_2026-07-08.json` (local, do not commit).

---

## 4. Target architecture

```
User arrives (/start → /chat)
        ↓
[P0.5 Empty state — permission, not expectation]
        ↓
First user message
        ↓
[P0.1 Opening Detection — internal only]
        ↓
[P0.2 Reflection Mode — ephemeral system appendix, one turn max]
        ↓
[P0.6 Safety Override? → pause Entry, crisis path]
        ↓
Existing turn path (B–J layers, suppression-first)
        ↓
[P0.1 marks reflection_started — modes cleared]
        ↓
[P0.7 Entry analytics — observation only]
```

**Kill switch (recommended):** `ENABLE_P0_REFLECTION_ENTRY` — default **off** until Lumen entry fixture pass on hosted.

---

## 5. Component implementation map

### P0.1 Opening Detection Engine

**Goal:** Classify first (or early) user messages **internally** for adaptation only.

**New module:** `lib/wisewave-p0-opening-detection.ts`

**Types (internal):**

```ts
type P0OpeningType =
  | "emotional_opening"
  | "greeting"
  | "advice_seeking"
  | "question_request"
  | "writing_difficulty"
  | "story"
  | "document_upload"
  | "long_context"
  | "unknown";
```

**Detection rules (v1 — heuristic, no ML):**

| Type | Signals |
|------|---------|
| `greeting` | Short social openers (`hi`, `hello`, `你好`, ≤12 chars, no substance) |
| `advice_seeking` | `what should I`, `tell me what to do`, `give me advice`, `建议`, `怎么办` |
| `question_request` | `ask me questions`, `some questions`, `prompts`, `问我` |
| `writing_difficulty` | `don't know where to start`, `don't know what to write`, `不知道写什么`, empty-ish hesitation |
| `document_upload` | Paste length ≥ ~400 chars OR attachment metadata (future) |
| `long_context` | Length ≥ ~200 chars, narrative, not pure greeting |
| `emotional_opening` | First-person feeling/thought without explicit advice ask |
| `story` | Narrative event structure without document length |

**Integration point:** `app/api/chat/turn/route.ts`

- Run on **conversation turn index ≤ 2** (first user messages only).
- Store in turn debug JSON only: `debug_p0_opening_type`, `debug_p0_opening_confidence`.
- **Never** expose type to client UI or assistant text.

**Tests:** `lib/wisewave-p0-opening-detection.test.ts` — seed from real export first lines.

---

### P0.2 Reflection Modes (ephemeral)

**Goal:** One-turn system appendix selected from opening type; **cleared** once authentic reflection begins.

**New module:** `lib/wisewave-p0-reflection-modes.ts`

| Mode | When (internal) | System appendix intent |
|------|-----------------|------------------------|
| **Mirror** | `greeting`, `writing_difficulty` | Simple mirror; no onboarding; invite one honest line |
| **Clarify** | `advice_seeking`, `question_request` | Acknowledge wish for direction; clarify without deciding; return choice |
| **Deepen** | `emotional_opening`, `story` | Light reflect; separate fact/feeling; no diagnosis |
| **Continue** | Return within same session with ≤1 prior user msg | Minimal continuity — **not** Continue drawer |
| **Slow** | `emotional_opening` + overwhelm cues | Shorter response; one noticing point |

**Reflection begun** = any of:

- User message ≥ 40 chars with first-person reflective content, OR
- Turn index ≥ 2 with non-greeting content, OR
- Opening type was `emotional_opening` / `story` / `document_upload` on first turn

After reflection begun: **do not append mode appendix**; set `debug_p0_mode_cleared: true`.

**Integration:** `app/api/chat/turn/route.ts` — append to system message **before** existing milestone appendices; respect existing suppression (H/I/J unchanged).

**Forbidden:** mode names in UI, persistent state in DB, user-selectable modes.

---

### P0.3 Slash Commands

**Goal:** Optional friction reduction; never structure reflection.

**New module:** `lib/wisewave-p0-slash-commands.ts`

**v1 commands (minimal):**

| Command | Effect |
|---------|--------|
| `/slow` | Request Slow mode for **this turn only** (internal flag) |
| `/mirror` | Request Mirror mode this turn only |

**Integration:**

- Parse in turn route from user message prefix; strip from model-visible user text.
- Track `slash_command_used` event.
- **No** in-app promotion, no command menu, no help panel.

**Client:** optional — server-side parse is sufficient for v1.

---

### P0.4 Homepage Entry Experience

**Goal:** Permission, not performance pressure.

**Files (Aurora review required before deploy):**

| Surface | File | Current | P0 direction |
|---------|------|---------|--------------|
| Marketing homepage | `app/(wisewave-site)/page.tsx`, `lib/wisewave-site/wisewave-landing-copy.ts` | Identity-aligned hero | Avoid “What would you like to talk about?” framing |
| `/start` | `app/(wisewave-site)/start/page.tsx` | Expectation setting | Add permission line: *You can begin anywhere — a thought, a feeling, a question, or “I don’t know.”* |
| Primary CTA | `components/wisewave-site/StartEnterLink.tsx` | “Enter Wisewave” | Keep — audit only |

**Process:** draft copy → registry/semantic check → Aurora → deploy.

---

### P0.5 Empty State Experience (`/chat`)

**Goal:** Empty screen = permission, not expectation.

**File:** `app/chat/page.tsx`

| Element | Current | P0 action |
|---------|---------|-----------|
| Input placeholder | `"Speak freely."` | Keep or soften to permission pool (EN/ZH) — Aurora |
| Hero chip | `low presence · human-tech · warm minimal` | Review — may feel system-visible; consider removing on empty thread |
| `PerceptionHint` | Continuity-oriented after idle | **Disable on empty thread** (0 messages) — conflicts with P0 silence principle |
| Mock welcome | `DEV_MOCK` only | Unchanged |
| Insight anchor on empty | Hidden when no text | OK |

**New (minimal):** when `messages.length === 0`, show one quiet permission line (not a prompt list):

> You can begin anywhere.

No buttons, no templates, no “choose a topic.”

---

### P0.6 Early Exit Detection

**Goal:** One gentle invitation max; never retention.

**New module:** `lib/wisewave-p0-early-exit.ts`

**Trigger (v1):**

- User opened `/chat`, sent **zero** user messages, navigates away or closes tab OR idle ≥ 90s with empty input

**Behavior:**

- **One** optional soft line if they return in same session (sessionStorage flag `p0_exit_invited_once`): e.g. *Whenever you're ready, you can begin with one line.*

**Forbidden:** email capture, push, second nudge, Continue pressure, subscription prompt on exit.

**Integration:** client-only in `app/chat/page.tsx` for v1; server event `conversation_abandoned_before_reflection`.

---

### P0.7 Entry Analytics

**Goal:** Observation for P1; not optimisation loops.

**Extend:** `lib/wisewave-conversion-tracking.ts`, `lib/wisewave-analytics.ts`, `lib/record-conversion-event.ts`

| Event | When | Tier |
|-------|------|------|
| `entry_type_detected` | Opening detection on early turn | recommended |
| `reflection_mode_selected` | Ephemeral mode chosen (internal enum) | recommended |
| `slash_command_used` | Slash parsed | funnel |
| `conversation_started` | First message POST to turn OR session created with intent | recommended |
| `reflection_started` | Alias/refine of `first_reflection_started` OR separate pre-authentic marker | align with existing |
| `conversation_entered_reflection` | Mode cleared / reflection begun flag | recommended |
| `reflection_depth_reached` | Turn 3+ with reflective content (heuristic) | funnel |
| `conversation_abandoned_before_reflection` | P0.6 client beacon | recommended |

**Rules:**

- Dedupe per session where appropriate.
- Metadata: `{ opening_type, mode, lang }` — no user message text in analytics payload.
- GA4 mirror optional; DB primary for P1 prep.
- **Do not** wire to ad bid optimisation without Tree.

**Existing overlap:** keep `first_reflection_started` / `first_reflection_completed`; document mapping in `docs/measurement/HC_OS_REFLECTION_MEASUREMENT_MODEL_v1.md` (HC-OS Phase 1 deliverable).

---

### P0 Safety Override (Principle 6)

**Goal:** Pause Reflection Entry when crisis signals detected.

**New module:** `lib/wisewave-p0-safety-override.ts`

- Keyword / pattern gate (EN/ZH): suicide, self-harm, immediate danger, kill myself, etc.
- On trigger: skip P0 mode appendix; use dedicated crisis boundary block (no Entry adaptation).
- Response: care + encourage human/professional support — align with `lib/wisewave-prompts.ts` boundaries.
- Debug: `debug_p0_safety_override: true`
- Lumen Red if Entry continues as normal reflection.

**Note:** v1 = conservative pattern gate; not a crisis product claim.

---

## 6. Implementation sequence (Nova)

### Slice 0 — Scaffold (no user-visible change)

- [x] Add `ENABLE_P0_REFLECTION_ENTRY` to `.env.example`
- [x] Create `lib/wisewave-p0-opening-detection.ts` + tests
- [x] Create `lib/wisewave-p0-reflection-modes.ts` + tests (via orchestrator)
- [x] Create `lib/wisewave-p0-safety-override.ts` + tests (via orchestrator)
- [x] Create `lib/wisewave-p0-slash-commands.ts` + orchestrator tests
- [x] Wire turn route behind flag; debug fields only
- [x] `npm run test:p0-reflection-entry`

### Slice 1 — P0.1 + P0.2 + Safety (hosted QA)

- [x] Opening detection + ephemeral mode appendix on first 1–2 turns
- [x] Mode clear after reflection begun (turn 1 entry preserved)
- [x] Safety override path
- [x] Document relationship-first deepen appendix
- [x] Lumen fixtures doc: `docs/qa/P0_REFLECTION_ENTRY_LUMEN_FIXTURES_v1.md`
- [x] Hosted probes: `npm run p0:entry:hosted-probes`
- [x] Lumen hosted pass on **Preview** with `ENABLE_P0_REFLECTION_ENTRY=1` — **PASS QA2 2026-07-08** (`docs/qa/P0_REFLECTION_ENTRY_SLICE1_LUMEN_PREVIEW_QA2_2026-07-08.md`). Production still gated until steward sets `P0_REFLECTION_ENTRY_ALLOW_PRODUCTION=1`.

### Slice 2 — P0.7 analytics

- [ ] Catalog + server persist + turn/client beacons
- [ ] Admin readable in existing conversion tooling

### Slice 3 — P0.5 + P0.6 (client)

- [ ] Disable perception hint on empty thread
- [ ] Permission empty state copy (Aurora approved)
- [ ] Early exit one-invitation + abandon event

### Slice 4 — P0.3 slash commands

- [ ] Server-side `/slow`, `/mirror` only

### Slice 5 — P0.4 marketing copy

- [ ] Aurora-reviewed `/start` + homepage permission language
- [ ] `npm run semantic:check` clean

### Slice 6 — Tree exit review

- [ ] Lumen entry QA checklist signed
- [ ] Exit criteria from P0 addendum § Tree Exit Criteria

---

## 7. Files touched (expected)

| File | Slices |
|------|--------|
| `lib/wisewave-p0-opening-detection.ts` | 0, 1 |
| `lib/wisewave-p0-reflection-modes.ts` | 0, 1 |
| `lib/wisewave-p0-safety-override.ts` | 0, 1 |
| `lib/wisewave-p0-early-exit.ts` | 3 |
| `lib/wisewave-p0-slash-commands.ts` | 4 |
| `app/api/chat/turn/route.ts` | 0, 1, 2, 4 |
| `app/chat/page.tsx` | 2, 3 |
| `lib/wisewave-conversion-tracking.ts` | 2 |
| `lib/wisewave-analytics.ts` | 2 |
| `lib/record-conversion-event.ts` | 2 |
| `app/(wisewave-site)/start/page.tsx` | 5 |
| `docs/QA_HANDOFF.md` | each slice |

**New tests:**

- `lib/wisewave-p0-opening-detection.test.ts`
- `lib/wisewave-p0-reflection-modes.test.ts`
- `lib/wisewave-p0-safety-override.test.ts`
- `npm run test:p0-reflection-entry` (to add in `package.json`)

---

## 8. Conflicts to avoid

| Risk | Mitigation |
|------|------------|
| P0 modes feel like onboarding | Never label modes; one-turn appendix only |
| Continue drawer confused with P0 “Continue” mode | Different names internally (`continue_reentry` vs `p0_mode_continue`) |
| Perception hint fills silence | Off on empty thread |
| Phase 4 marker visible during entry | Unchanged — marker stays suppression-first |
| H/I/J stack on greeting | P0 Mirror should reduce over-structuring; watch Lumen Yellow |
| Semantic drift on copy | Aurora + `semantic:check` before deploy |
| Retention via early exit | One invitation max; sessionStorage gate |
| Document opening → summary | Relationship-first appendix in Deepen/Mirror; forbid summarize-first in mode text |

---

## 9. Lumen QA entry (minimum before flag on in prod)

From P0 addendum + real export:

| Fixture | User seed |
|---------|-----------|
| Greeting | `Hi` |
| Question request | `I need self reflection could you ask me some questions` |
| Emotional | `I'm worried that I will not be able to make it` |
| Writing difficulty | `I don't know where to start` |
| Document | long clinical paste (user_06) |
| Advice-seeking | `What should I do?` |
| Safety | crisis phrase → override, no Entry mode |

Each: assert no visible mode label, mode clears by turn 2, Green/Yellow rating per HC-OS protocol.

---

## 10. Success metrics (Tree exit — not vanity)

| Metric | Source |
|--------|--------|
| Reflection Start Rate | `first_reflection_started` / chat arrivals |
| Abandon before reflection | `conversation_abandoned_before_reflection` |
| Opening type mix | `entry_type_detected` (internal dashboard) |
| Blank-page hesitation (qual) | Lumen review + steward observation |
| No assistant/therapy/journal expectation drift | Semantic QA + Lumen boundary fixtures |

**Not success:** longer conversations, more messages, dependency signals.

---

---

## 12. QA gates by slice (when Lumen / Aurora / Tree)

| Slice | What ships | QA owner | When | Pass bar |
|-------|------------|----------|------|----------|
| **0** (done) | Libs + tests + `debug_p0_*`; flag **off** in prod | Nova only | Now | `npm run test:p0-reflection-entry` green; no user-visible change |
| **1** | Flag **on** staging: opening detection + ephemeral modes + safety | **Lumen** | Before any prod flag | 7 opening fixtures from real export; Green/Yellow per HC-OS QA protocol; no visible mode labels; `debug_p0_mode_cleared` on turn 2 substantive |
| **2** | Entry analytics events | **Lumen** (measurement QA) + Nova | After Slice 1 pass | Events in admin/DB; no inflated metrics; mapping doc |
| **3** | Empty state + early exit (client) | **Lumen** + **Aurora** (copy) | Before prod | No perception hint on empty thread; one exit invite max; no retention feel |
| **4** | Slash commands | **Lumen** | With or after Slice 3 | Optional only; not promoted in UI |
| **5** | `/start` + homepage permission copy | **Aurora** then **Lumen** semantic | Before deploy | `npm run semantic:check`; no performance-pressure framing |
| **6** | Tree exit | **Tree** | All above | P0 exit criteria in addendum |

**Rule:** Slice 1 **signed off on Preview** (Lumen QA2 2026-07-08). Do **not** enable P0 on **Production** until Tree/steward intentionally sets **`ENABLE_P0_REFLECTION_ENTRY=1`** and **`P0_REFLECTION_ENTRY_ALLOW_PRODUCTION=1`**, redeploys, and runs production smoke.

### Preview-only guard (Slice 1 QA path)

| Variable | Preview | Production (QA) | Production (post sign-off) |
|----------|---------|-----------------|----------------------------|
| `ENABLE_P0_REFLECTION_ENTRY` | `1` | unset / `0` | `1` |
| `P0_REFLECTION_ENTRY_ALLOW_PRODUCTION` | unset | unset | `1` |

Debug on turn: `debug_p0_reflection_entry_flag_set`, `debug_p0_reflection_entry_enabled`, `debug_p0_reflection_entry_blocked_on_production`, `debug_p0_reflection_entry_vercel_env`.

---

## 11. Immediate next step (Nova)

**Slice 1 closed on Preview (Lumen QA2).** Await Tree/steward production enable decision. **Nova next (when cleared):** Slice 2 P0.7 analytics, or production smoke support after steward sets both env keys. No public copy until Slice 5 Aurora review.

---

## Related documents

- [P0 Implementation Addendum v1.0 (Locked)](./Wisewave_Product_Milestone_P0_Reflection_Entry_Implementation_Addendum_v1_LOCKED.md)
- [HC-OS Core v1.0 Lock — Nova Directive](./hc-os/HC_OS_CORE_V1_LOCK_NOVA_IMPLEMENTATION_DIRECTIVE.md)
- [HC-OS Core v1.0 — Lumen QA Protocol](./qa/HC_OS_CORE_V1_LUMEN_QA_PROTOCOL.md)
- [Semantic Governance Lock v1.1](./Wisewave_Semantic_Governance_Lock_v1.1.md)
