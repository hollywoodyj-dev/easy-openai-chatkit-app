# Nova — P1-FRL First Reflection Loop — Implementation Plan (planning only)

| Field | Value |
|-------|-------|
| **Date** | 2026-09-24 |
| **From** | Nova |
| **To** | Tree |
| **Status** | Governing Phase 1 contract — Tree **INTERNAL IMPLEMENTATION AUTHORIZED** 2026-10-10 |
| **Semantic Review (prior)** | Aurora — PASS (Tree-accepted 2026-09-22); **one final copy pass still required before Preview** |
| **Founder Decision** | `docs/WISEWAVE_FOUNDER_DECISION_P1_FRL_PHASE1_AND_XUANWEI_IP_2026-10-01.md` — plan AUTHORIZED |
| **Tree code gate** | 2026-10-10 **B — AUTHORIZE PHASE 1 INTERNAL IMPLEMENTATION** (default-off; Preview/Production not authorized) |
| **Authority** | Internal code authorized. Hosted Preview, Production, Carry, Return remain separately gated. |

**Spine this plan must preserve:** teach the posture of reflection, not the answer to life.

**P1-FRL does not replace P1-FMI.** P1-FMI remains the governed response-quality milestone for the first credible reflective value moment.

```text
P1-FRL PHASE 1 PLAN: AUTHORIZED
INTERNAL CODE: AUTHORIZED (2026-10-10) — DEFAULT-OFF
HOSTED PREVIEW: NOT AUTHORIZED
PRODUCTION: HOLD / HARD-BLOCK
MARKER: p1_reflection_literacy_v1_internal

P0 ONE-VOICE RULE: ACCEPTED
EN / ZH COPY: ONE FINAL AURORA EDIT ROUND, THEN LOCK
CARRY WITH ME / RETURN ANCHOR / PHASE 2 / PHASE 3: CLOSED
```

---

## 1. Phase 1 implementation plan

Phase 1 is the only slice prepared for a future Tree implementation gate:

```text
Reflection Literacy Reframe
+ First Genuine Expression handoff
+ existing P1-FMI integration (call unchanged)
```

Product question this slice must be able to answer:

> Can Wisewave recognise when a first-time user needs help understanding reflection, provide **one** light reframe, and then **withdraw** once genuine expression begins?

Conceptual flow (current turn only):

```text
User input
  -> current-turn interaction assessment
  -> genuine reflective expression?
       Yes -> ordinary reflection / existing P1-FMI
       No  -> advice-seeking OR abstract self-explanation?
                Yes -> one Reflection Literacy reframe
                No  -> existing baseline (P0 / ordinary turn)
```

### 1.1 Smallest architecture

Add **one** new server module and a **single** hook in the existing `POST /api/chat/turn` pipeline.

Do **not** add UI, modes, persistence, analytics, or a second generation pass.

Proposed module (future gate only): `lib/wisewave-p1-reflection-literacy.ts`

Responsibilities:

1. Resolve `ENABLE_P1_REFLECTION_LITERACY` (default-off; Production hard-blocked; Preview also blocked until a later Tree allow).
2. Assess **this user message only** (plus live prior user texts already loaded for P0 — not stored FRL labels).
3. Return an ephemeral result: state, whether a reframe appendix should apply, suppression reason.
4. Supply one EN or ZH system appendix when the reframe applies.

Turn-route hook (future gate only), after existing P0 safety / entry computation and **without editing** `computeP1FirstMildInsightTurn` / `evaluateFMIEligibility` / `classifyFMIInput` / validator:

1. Call the FRL evaluator.
2. If reframe applies: append the literacy appendix; **withhold the P0 mode appendix for that turn** so the user hears one voice, not P0 Clarify + literacy. (Founder ACCEPTED 2026-10-01. P0 safety is never withheld.)
3. Always still call existing P1-FMI exactly as today.
4. Emit `debug_p1_frl_*` on the turn JSON only.
5. Write **no** FRL fields to Prisma / User / Conversation / Insight / Thread.

### 1.2 First-use window without persisted skill state

Do not store beginner / advanced / literacy-taught.

Reuse the **already-computed** P0 entry window:

- Literacy may fire only when `userMessageCount === 1`, **or** `userMessageCount === 2` and the prior user message is greeting / writing-difficulty only (same shape as `isP0EntryPhase`).
- If any **live** prior user text already classifies as genuine expression, literacy does not fire.
- After the first-use window, literacy never fires again in that conversation — no stored “already taught” flag required.

This yields **at most one** reframe without a guided multi-turn programme.

### 1.3 What Phase 1 is not

- Not onboarding, tutorial, checklist, first-run walkthrough, or P1.1 First Question.
- Not a second FMI.
- Not Carry With Me or Return Anchor.
- Not a change to P0 opening detection or P0 mode **selection** (only a future one-turn withhold of the P0 **appendix** when literacy wins).

---

## 2. Proposed Phase 1 files to change

**Only after Tree opens the implementation gate.** None of these are edited in this planning gate.

| File | Change |
|------|--------|
| `lib/wisewave-p1-reflection-literacy.ts` | **New.** Enablement, current-turn evaluator, one EN/ZH appendix, debug shape. |
| `lib/wisewave-p1-reflection-literacy.test.ts` | **New.** Vitest matrix (bypass, reframe, suppress, no-persist, EN/ZH). |
| `app/api/chat/turn/route.ts` | Call evaluator; optional appendix; optional P0-appendix withhold; `debug_p1_frl_*`. **Do not** change FMI function bodies or eligibility. |
| `.env.example` | Comment-only documentation of the three conceptual flags + existing FMI flag independence. No secrets. |
| `package.json` | Optional `test:p1-frl` script mirroring `test:p1-fmi`. |

**Not in Phase 1:** Prisma schema, `app/chat/page.tsx`, Interaction Legibility, Light Entry, P1.1 invitation, Continue APIs, analytics, marketing.

---

## 3. Reusable existing components

Read-only reuse. Do not fork FMI or P0 core logic.

| Component | Path | Reuse |
|-----------|------|--------|
| P0 opening types | `lib/wisewave-p0-opening-detection.ts` → `detectP0OpeningType` | Input typing (`advice_seeking`, greeting, emotional, story, …). |
| P0 safety | `lib/wisewave-p0-safety-override.ts` → `evaluateP0SafetyOverride`; turn already has `p0Entry.safetyOverride` | Hard suppress of literacy. |
| P0 entry window | `lib/wisewave-p0-reflection-modes.ts` → `isP0EntryPhase` | First-use window without new persistence. |
| P0 authentic-begun | `hasP0AuthenticReflectionBegun` | Withdrawal aid on turn ≥ 2 only (turn 1 is always `false` today — do not treat that as “not genuine”). |
| FMI classifier | `lib/wisewave-p1-first-mild-insight.ts` → `classifyFMIInput` | **Read-only** genuine-expression signal (`self_expression` / `story` + medium/high). |
| FMI turn | `computeP1FirstMildInsightTurn` / `finalizeFMIAfterGeneration` | Unchanged handoff. |
| Enablement pattern | `resolveP1FirstMildInsightEnablement` | Copy the **pattern** (flag + Production hard-block + Preview allow key). Do not share FMI’s flag. |
| Empty-state literacy (leave alone) | `lib/wisewave-p1-interaction-legibility.ts` | Pre-input copy. FRL is **post-input**. Do not merge. |

---

## 4. Existing P1-FMI handoff point

**File:** `app/api/chat/turn/route.ts`

Today (do not rewrite):

1. `computeP0ReflectionEntryTurn(...)` — safety + ephemeral P0 mode appendix.
2. `computeP1FirstMildInsightTurn({ ..., safetyOverrideActive: p0Entry.safetyOverride })` (~line 1773).
3. FMI eligibility metadata may be written to the **committed user message** as `wisewave_p1_fmi` (FMI’s existing operational metadata — not an FRL change).
4. Later, FMI appendix is applied when eligible; `finalizeFMIAfterGeneration` + validator.

**Proposed insertion (future gate):** immediately after step 1 (so safety is known), **before or beside** step 2:

- Run FRL evaluator on the same `message`, `p0UserTurnIndex`, `p0PriorUserMessages`, `wantsChinese`, `p0Entry.safetyOverride`.
- If literacy reframe applies: append literacy system appendix; set a local `withholdP0ModeAppendix = true` when assembling the system prompt.
- Then call `computeP1FirstMildInsightTurn` **with the same arguments as today**.

Advice-seeking already maps to FMI `deferred_missing_context`. Genuine self-expression / story already maps to FMI `eligible` when signal is sufficient. Literacy does not need to, and must not, alter those mappings.

---

## 5. Proposed current-turn evaluator

Ephemeral enum (debug / in-memory only — **never** User/profile/segment fields):

```text
safety
clear_genuine_expression
advice_seeking
abstract_self_explanation
low_signal
out_of_window
flag_off
```

Decision order:

1. Flag off or hosted-blocked → `flag_off` → no appendix.
2. Safety override → `safety` → no appendix.
3. Current-turn **genuine expression** → `clear_genuine_expression` → **bypass** (no teaching).
4. Outside first-use window (or prior live user text already genuine) → `out_of_window` → no appendix.
5. Current-turn P0/FMI type `advice_seeking` → `advice_seeking` → one reframe.
6. Current-turn **abstract self-explanation** (new narrow detector) → `abstract_self_explanation` → one reframe.
7. Else → `low_signal` → existing baseline (greeting, utilitarian, writing-difficulty, unknown, document-without-relationship).

### 5.1 Genuine expression (bypass)

True when `classifyFMIInput` returns:

- `inputType` ∈ {`self_expression`, `story`} **and** `signalStrength` ∈ {`medium`, `high`}

This already includes advice-seeking **with** enough personal tension (FMI retypes those as `self_expression`). Those users skip literacy and go to ordinary reflection / FMI.

Do **not** invent a second FMI eligibility function.

### 5.2 Abstract self-explanation (new, conservative)

Narrow current-turn heuristic for *talking about the self as a topic* without a situated present:

- Meta-self / “understand myself” / “work on my patterns” / life-meaning as a general question, **without** a specific situation, relationship, or felt tension already in the line.
- Must lose to genuine expression when both could match.
- Must not fire on greetings, utilitarian, document paste, or ordinary emotional openings.

If uncertain → `low_signal` (baseline). Suppression-first.

### 5.3 Not persisted

Evaluator output lives in the turn-handler stack and in `debug_p1_frl_*` JSON. No `Message.metadata.wisewave_p1_frl` write in Phase 1.

---

## 6. Proposed Reflection Literacy reframe integration point

**Surface:** existing system-prompt assembly in `POST /api/chat/turn` (same class of hook as P0 / FMI appendices).

**Visible surface:** still only `response.main_reflection`. No card, label, title, or “literacy” chrome.

**One-voice rule:** if literacy appendix applies, do not also apply the P0 Mirror/Clarify/Deepen/Continue/Slow appendix on that turn. P0 **safety** appendix still wins over literacy.

**P1.1 rule:** the reframe must not ask the first reflective question. No “Would you like to…”, no Wisewave-led prompt. At most a permission to begin with what is already present.

**Withdraw rule:** if the next user turn is genuine, evaluator returns `clear_genuine_expression` or `out_of_window` — no second lesson.

---

## 7. Exact suppression rules

Literacy reframe is **suppressed** when any of these hold:

| # | Rule | Outcome |
|---|------|---------|
| S0 | `ENABLE_P1_REFLECTION_LITERACY` unset / not `1`/`true`/`yes` | `flag_off` |
| S1 | `VERCEL_ENV=production` | hard-blocked (no production allow key in this milestone) |
| S2 | `VERCEL_ENV=preview` and Preview allow unset | blocked (Preview not authorized this gate) |
| S3 | P0 safety override active | safety path; no literacy; FMI already `suppressed_safety` |
| S4 | Current turn is genuine expression | bypass; ordinary / FMI |
| S5 | Outside first-use window | baseline |
| S6 | Prior live user text already genuine | withdraw |
| S7 | Greeting / writing-difficulty / factual / utilitarian / unknown / question-request / document without personal relationship | baseline (P0 may still adapt) |
| S8 | Drift / high-severity safety blanking on the same turn (existing turn path) | no literacy teaching on a replaced safety reply |
| S9 | Uncertain abstract vs genuine | treat as genuine-or-baseline, **not** literacy |

Literacy **applies** only when: flag enabled and allowed **and** S3–S9 false **and** (advice-seeking **or** abstract self-explanation).

When literacy applies: withhold P0 **mode** appendix; do **not** suppress FMI computation.

---

## 8. Proof that genuine expression bypasses scaffolding

**By construction (to be locked in tests before any merge):**

1. Fixture: first-turn situated self-expression (EN + ZH) that `classifyFMIInput` already marks `self_expression` + medium/high.  
   Assert: FRL state `clear_genuine_expression`, `reframe_applied === false`, P0 withhold **false**, FMI called with identical inputs as today.
2. Fixture: advice + personal tension long enough that FMI already retypes to `self_expression`.  
   Assert: bypass (not literacy). FMI eligibility unchanged (`eligible` when it is today).
3. Fixture: first-turn story / emotional opening above FMI weak-length floor.  
   Assert: bypass.
4. Negative fixture: short “What should I do?” / 「我该怎么办」.  
   Assert: literacy may apply (if flag on); FMI remains `deferred_missing_context`.

`hasP0AuthenticReflectionBegun` is **not** the Phase 1 genuine test on turn 1 (it is hard-false). Bypass proof depends on `classifyFMIInput`, which already exists and is tested via `npm run test:p1-fmi`.

---

## 9. Proof that turn-level states are not persisted

Phase 1 contract:

- No Prisma model / column / migration.
- No `User` field, segment, skill score, or beginner/advanced flag.
- No `Conversation` / `Thread` / `Insight` write for FRL.
- No `Message.metadata` key for FRL states (`entry_uncertainty`, `advice_seeking`, `abstract_self_explanation`, `low_signal`, `clear_genuine_expression`).
- Existing FMI metadata (`wisewave_p1_fmi`) is **out of scope** and unchanged.

Proof method after a future implementation: unit test that the evaluator is a pure function; turn-route test (or grep gate) that `buildFMIMessageMetadata` / `prisma.message.update` / `prisma.user` are not extended with FRL keys; Lumen may inspect turn JSON `debug_p1_frl_*` which is response-only.

Windowing uses `userMessageCount` + live prior **message text**, not stored FRL labels.

---

## 10. Feature flags

Separate reversible flags. **No** global FRL master that silently enables Carry / Return.

| Flag | Layer | This gate | Future |
|------|--------|-----------|--------|
| `ENABLE_P1_REFLECTION_LITERACY` | server | **document only** | Phase 1 code, default-off |
| `P1_REFLECTION_LITERACY_ALLOW_HOSTED_PREVIEW` | server | **must remain unset** | only if Tree later authorizes Preview |
| `ENABLE_P1_FIRST_MILD_INSIGHT` | server | **untouched** | independently governed |
| `P1_FMI_ALLOW_HOSTED_PREVIEW` | server | **untouched** | independently governed |
| `ENABLE_P1_CARRY_WITH_ME` | reserved name | **not implemented** | Phase 2 after separate gate |
| `ENABLE_P1_RETURN_ANCHOR` | reserved name | **not implemented** | Phase 3 after separate gate |

Convention: `true` / `1` / `yes`; Production hard-block with **no** production allow key on literacy (same posture as current FMI). Do not add `NEXT_PUBLIC_*` for Phase 1 (no client UI).

---

## 11. Rollback

If a future Tree implementation gate ships and must come out:

1. Unset `ENABLE_P1_REFLECTION_LITERACY` — literacy evaluator returns `flag_off`; turn path is baseline + existing FMI.
2. If Preview was ever allowed (it is not now): unset Preview allow.
3. Revert the turn-route hook + new lib in one commit if needed. No schema to roll back.
4. P0 and P1-FMI remain as they are today.

---

## 12. EN / ZH copy map

**Status:** Aurora **COPY LOCK** 2026-10-10. Constants live in `lib/wisewave-p1-reflection-literacy.ts`. Nova must **not** invent additional variants. Further edits require Aurora + Tree.

Purpose: permission to begin reflecting, not a product rule and not a correction. User authorship stays with the user. No companion, therapy, or spiritual voice.

### 12.1 Advice-seeking reframe

| Lang | Aurora COPY LOCK |
|------|------------------|
| EN | You don’t need to know what to do here. You can begin with what’s already present: a feeling, a situation, or even not knowing yet. |
| ZH | 在这里，不需要急着知道该怎么做。你可以从眼前已经有的东西开始：一种感受、一件事，甚至只是还不知道。 |

Supersedes Founder-recommended interim and the earlier planning draft that began with “This space does not tell you what to do.”

### 12.2 Abstract self-explanation reframe

| Lang | Aurora COPY LOCK |
|------|------------------|
| EN | You don’t need to explain yourself all at once here. You can stay with one thing that feels present, without needing the whole picture to be clear. |
| ZH | 在这里，不需要一次把自己解释清楚。可以先停在此刻比较明显的一点上，不必急着把整个自己说明白。 |

The user should feel *I can begin here*, not *I have been using Reflection incorrectly*.

### 12.3 Must not appear (either language)

- Insight / 洞察 labels, insight unlocked, journey, unlock, go deeper, “shall we”, first question from Wisewave.
- Diagnosis, pattern claims, hidden-cause, advice, plans, scores.
- “here’s what you should do”, “I’m here for you”, “I’ll stay with you”.

### 12.4 ZH counselling-style avoid-list (Tree / user-restored)

Do not use:

```text
你真正的问题是
你的内心深处
你的潜意识
你其实是在
你需要疗愈
你的模式是
我陪你
我们一起走进去
```

Unicode-escape form (task-board safe):

```text
\u4f60\u771f\u6b63\u7684\u95ee\u9898\u662f
\u4f60\u7684\u5185\u5fc3\u6df1\u5904
\u4f60\u7684\u6f5c\u610f\u8bc6
\u4f60\u5176\u5b9e\u662f\u5728
\u4f60\u9700\u8981\u7597\u6108
\u4f60\u7684\u6a21\u5f0f\u662f
\u6211\u966a\u4f60
\u6211\u4eec\u4e00\u8d77\u8d70\u8fdb\u53bb
```

ZH must keep equivalent restraint, guidance level, emotional weight, user authorship, and low presence. No counselling analysis, therapeutic intimacy, spiritual interpretation, poetic authority, or companion language.

---

## 13. Safety integration points

| Point | Existing hook | FRL rule |
|-------|----------------|----------|
| Pre-generation | `p0Entry.safetyOverride` / `evaluateP0SafetyOverride` | Suppress literacy; use existing safety appendix; do not teach posture. |
| FMI | `safetyOverrideActive` → `suppressed_safety` | Unchanged. |
| Post-generation | `finalizeFMIAfterGeneration` safety branch; drift high-severity blanking | Do not mint Carry (Phase 2) from crisis text; Phase 1 has no Carry. |
| Return copy | Phase 3 only | If ever built: suppress Return Anchor when safety is active or the saved line is a crisis event. |

Safety overrides every FRL layer. Phase 1 implements only the literacy suppress.

---

## 14. Test matrix (proposed)

New file: `lib/wisewave-p1-reflection-literacy.test.ts`. Command: `npm run test:p1-frl`. Existing `npm run test:p1-fmi` must stay green with **zero** FMI source edits.

| ID | Case | Expect |
|----|------|--------|
| FRL-01 | Flag off | `flag_off`, no appendix |
| FRL-02 | Production env + flag on | hard-blocked |
| FRL-03 | Safety EN + ZH | `safety`, no reframe |
| FRL-04 | Genuine first-turn EN | bypass; FMI path unaltered |
| FRL-05 | Genuine first-turn ZH | bypass |
| FRL-06 | Advice + tension (FMI retypes) | bypass, not literacy |
| FRL-07 | Bare advice-seeking EN | one reframe |
| FRL-08 | Bare advice-seeking ZH | one reframe |
| FRL-09 | Abstract self-explanation EN | one reframe |
| FRL-10 | Abstract self-explanation ZH | one reframe |
| FRL-11 | Greeting | `low_signal`, no reframe |
| FRL-12 | Utilitarian | `low_signal` |
| FRL-13 | Turn 3 advice-seeking | `out_of_window` |
| FRL-14 | Turn 2 after genuine turn 1 | no reframe |
| FRL-15 | Literacy-on does not change `evaluateFMIEligibility` snapshots | FMI tests still own this |
| FRL-16 | Appendix contains no P1.1 question / no ZH avoid-list | copy contract |
| FRL-17 | No Prisma / metadata write helper exported | no-persist |
| FRL-18 | When reframe on, P0 mode appendix withheld | one voice |

Lumen hosted fixtures: **not** in this gate (Preview not authorized).

---

## 15. Expected failure modes

| Mode | Risk | Containment |
|------|------|-------------|
| Double teaching | P0 Clarify + literacy on the same advice turn | Withhold P0 mode appendix when literacy applies |
| False literacy on genuine | User already reflecting; gets a lesson | Genuine check **before** advice/abstract; uncertain → no literacy |
| Literacy becomes onboarding | Multi-turn curriculum | First-use window + current-turn-only + no persist |
| FMI drift | “Help literacy” by loosening FMI | **No FMI source edits** |
| P1.1 leak | Reframe asks a question | Copy lock + test FRL-16 |
| ZH counselling drift | Avoid-list leak | Aurora ZH review before Preview; unit deny-list |
| Abstract detector too wide | Teaching people who started | Suppression-first; lose to genuine |
| Hidden memory | Storing `advice_seeking` on User | Phase 1 forbids metadata/profile writes |
| Programme feel | Repeated reframe | Window + withdraw on genuine |

---

## 16. Explicit untouched systems

Phase 1 planning (and any future Phase 1 code) must not touch:

- P1-FMI core (`classifyFMIInput`, `evaluateFMIEligibility`, validator, `buildFMISystemAppendix`, enablement keys)
- P1.1 First Question Invitation (unrendered constant stays unrendered)
- P1.2 Reflection Strategy Engine (design-only)
- P1 Interaction Legibility / Light Entry Living Library / P0 permission-line UI
- Continue list, Phase 5–9 architecture, Milestone H / I / J
- `last_insight`, Thread labels, Insight extraction, continuity GET
- Prisma schema, User model, analytics (`lib/wisewave-analytics.ts`, GA4)
- Marketing / SEO / ASO / homepage / subscription / account
- Relational-promise S4 guard
- Hosted Preview / Production deploy config

---

## 17. Phase 2 — storage assessment only (no implementation)

**Founder 2026-10-01: CARRY WITH ME = CLOSED. PHASE 2 = CLOSED.** Do not implement `ENABLE_P1_CARRY_WITH_ME`. Do not substitute `last_insight`, Insight objects, Continue labels, Thread labels, inferred continuity, or existing memory for future user-owned Carry state.

**Carry With Me** = explicit **user-owned** save of a line the user chooses to keep. Not an insight card, not last_insight, not a profile trait.

### What exists today

| Store | Author | Fit for Carry? |
|-------|--------|----------------|
| `Insight` / `last_insight` | system | **No** — AI-authored; already a continuity object |
| `Thread.label` | system | **No** |
| Continue unfinished-direction labels | system | **No** |
| `ReflectionCheckpoint` | user trigger + **AI summary** | **No** — not a user-owned line |
| `User` | account | **No** — must not become hidden profile memory |
| `Message.metadata` FMI blob | operational | **No** — not user content |

**Gap:** there is no user-authored, user-initiated, user-visible saved line.

### If Tree later authorizes Phase 2 (assessment, not a build)

- New explicit save action only (user taps/chooses a line they wrote or a line they accept as theirs — **not** auto-extracted).
- Storage must be user-owned text, conversation- or account-scoped as Tree later locks, **never** silently injected as model context, pattern, diagnosis, or “who this user is.”
- Safety: do not create Carry Lines from crisis / acute safety turns.
- Flag: `ENABLE_P1_CARRY_WITH_ME` independent of literacy and FMI.
- **This gate:** no schema, no UI, no flag wiring, no persistence.

---

## 18. Phase 3 — return-surface assessment only (no implementation)

**Founder 2026-10-01: RETURN ANCHOR = CLOSED. PHASE 3 = CLOSED.** Do not implement `ENABLE_P1_RETURN_ANCHOR`. If Carry is ever reopened, it must begin with an explicit user-owned save contract.

**Return Anchor** = a later surface that shows a **saved** user-owned line so the person knows when return may be useful.

### What exists today

| Surface | Author | Fit? |
|---------|--------|------|
| Continue drawer | system labels | **No** — not a saved user line |
| Last Insight strip | system | **No** — inferred continuity |
| Account invitation / `user_return_anchor` | planned in First Conversation Return drafts; **not built** | Future candidate only after Carry exists |
| Empty-state IL / Living Library | entry copy | **No** — first-run, not return |

**Dependency:** Phase 3 is meaningless without a Phase 2 user-owned line. Using `last_insight` or Continue as a stand-in would leak inferred continuity and violate Tree’s Carry rules.

**This gate:** no return mechanics, no return UI, no `ENABLE_P1_RETURN_ANCHOR` wiring.

Related inventory (do not execute): `docs/NOVA_REPLY_FIRST_CONVERSATION_RETURN_MECHANISM_DIRECTIVE_2026-09-15.md` — C1 account invitation missing; C2 blocked because every current anchor is AI-authored.

---

## 19. Explicit confirmations

| Confirmation | Status |
|--------------|--------|
| No code implementation started | **Confirmed.** This file is planning only. |
| No Hosted Preview created | **Confirmed.** |
| No Production deployment | **Confirmed.** |
| No analytics implementation | **Confirmed.** None planned for implementation under this gate. |
| No Carry persistence implemented | **Confirmed.** Phase 2 assessment only. |
| No return mechanics / return surfaces | **Confirmed.** Phase 3 assessment only. |
| No duplicate P1-FMI logic | **Confirmed.** Plan reuses `classifyFMIInput` read-only; FMI functions stay unmodified. |
| No hidden memory, inferred continuity, or pattern leakage introduced | **Confirmed.** No new persistence; no Carry as model context. |
| P1.1 First Question not opened | **Confirmed.** |
| Stop after planning | **Confirmed.** Founder authorized this plan 2026-10-01. Tree still decides the **code** gate separately. |

---

## 20. What Tree must decide next (not Nova)

Founder recorded 2026-10-01: plan authorized; one-voice accepted; Carry / Return / Phase 2 / Phase 3 closed; 玄微 = brand narrator + usage demonstrator.

Remaining Tree decision:

```text
AUTHORIZE PHASE 1 INTERNAL IMPLEMENTATION
or
HOLD FOR REVISION
```

1. After reviewing **this** plan, open or withhold the **Phase 1 code** gate.
2. Aurora: one final EN/ZH semantic pass → **COPY LOCK DONE 2026-10-10** (applied in module).
3. Hosted Preview and Production remain separately governed after any code gate.
4. Phase 2 / Phase 3 remain closed.
