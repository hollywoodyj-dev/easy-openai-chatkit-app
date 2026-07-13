# Wisewave P1.1 — First Question Invitation

## Nova Implementation Plan v1 (Planning Only)

| Field | Value |
|-------|-------|
| **Status** | Planning valid — **Slice 1 coding held** (Tree 2026-07-13) · no Production behavior change |
| **Tree decision** | 2026-07-11 planning approved · 2026-07-13 coexistence question open before code |
| **Aurora** | Category/copy review received 2026-07-10 — candidate supported, default-off |
| **Lumen fixtures** | `docs/qa/P1_1_FIRST_QUESTION_INVITATION_LUMEN_FIXTURES_2026-07-11.md` (F01–F11) |
| **Authority** | [P1 Addendum (Locked)](./Wisewave_Product_Milestone_P1_Reflection_Experience_Implementation_Addendum_v1_LOCKED.md) · [Tree P1 series 1/4–4/4](./Wisewave_Tree_Decision_P1_Interaction_Legibility_and_First_Question_2026-07-13.md) |
| **Owner** | Nova (implementation) · Aurora (copy) · Lumen (QA) · Tree (Production gate) |

---

## 1. Governing principles

> **Legibility before interaction.** (Tree 2/4)

> **Wisewave may open the door, but it must not lead the user through it.**

> **Wisewave can ask first.**

This P1.1 slice addresses **initiation uncertainty** only (*"How do I begin?"*). **Interaction uncertainty** (*"What kind of thing belongs in this space?"*) is the **Interaction Legibility Layer** — deferred, plain text, validation before implementation. **P1.2 Reflection Strategy Engine** (Mirror/Clarify/Deepen/Slow/Continue) is **design-only**, invisible, separate track.

It is **not** onboarding, coaching, guided intake, or a prompt library.

**Explicitly out of this plan:** Entry Examples as interactive UI (chips/cards/buttons/workflow), RCL mode selector, multi-question flows, GR-1 linter changes, Production enablement, **Slice 1 code** (not authorized per Tree memo 2/4).

---

## 2. Tree release gate (unchanged)

| Gate | Requirement |
|------|-------------|
| Aurora | Copy/category review linked (received 2026-07-10) |
| Nova | Implementation behind **default-off** flag + Production allow-key guard |
| Lumen | **F01–F11** pass on Preview/local |
| Tree | Explicit Production approval before any user-facing enable |

Until all gates pass: **no Production UI change**.

**Coding hold (Tree 2/4–4/4):** P1.1 Slice 1 **not authorized** until Tree/steward explicitly requests. Product validation before implementation. Series **complete** (2026-07-13).

---

## 2a. Two uncertainties (Tree + Wisewave 2026-07-13)

| Layer | Answers | Form (approved direction) |
|-------|---------|---------------------------|
| **Interaction Legibility** | What kind of thing belongs in this space? | Plain-text legibility — **not** chips, buttons, cards, prompt UI, or workflow |
| **First Question Invitation (P1.1)** | How do I begin? | Optional one-question tap — this plan |

Entry Examples concept is **retained** under the Interaction Legibility reframe; **not discarded**, **not implemented** as interactive UI, **not combined** with P1.1 until Tree decides coexistence.

---

## 3. Approved copy (Aurora 2026-07-10)

| Surface | EN | ZH |
|---------|----|----|
| Empty-state invitation | Or, if it is easier, Wisewave can ask one question first. | 如果比较容易，也可以先由 Wisewave 问一个问题。 |
| Example first question (tap result) | What's taking up the most space in your mind right now? | TBD — Aurora parity line before implementation (fixture F10) |

Copy changes require Aurora before deploy.

---

## 4. Implementation model (Nova recommendation)

### 4.1 UI-only question emission (preferred for F08)

When the user taps the invitation on an empty thread:

1. Show **one** assistant question in the **client UI only** (local React state).
2. **Do not** `POST /api/chat/turn` and **do not** create a `Message` row until the user sends a reply.
3. When the user sends their answer, that text is their first real user message; normal turn route handles the response.

**Why:** satisfies F08 non-persistence, avoids fake conversation history on reload, keeps authorship with the user.

**Reload behavior:** invitation may reappear on a still-empty thread (same as P0 permission line); ephemeral question state is lost — acceptable; user has not expressed yet.

### 4.2 What stays unchanged

- P0 empty permission line remains (`You can begin anywhere.` / ZH parity).
- P0 opening detection, modes, analytics, early-exit abandon beacon — untouched.
- Drift suppression fallback (`5479da6`) — isolated; no bundling.

### 4.3 Adjacent server work (not P1.1 UI — optional later slices)

Fixtures **F05** (identity question) and **F06** (fragment/help) describe **turn-route response quality**, not the invitation UI. They may be addressed in separate stability/P1 server slices if Lumen fails them without P1.1 enabled. **Do not** fold identity/fragment handling into the invitation feature flag.

---

## 5. Feature flags (mirror P0 pattern)

| Variable | Preview/local | Production (default) | Production (after Tree) |
|----------|---------------|----------------------|---------------------------|
| `ENABLE_P1_FIRST_QUESTION_INVITATION` | `1` when testing | unset / `0` | `1` |
| `P1_FIRST_QUESTION_INVITATION_ALLOW_PRODUCTION` | unset | unset | `1` |
| `NEXT_PUBLIC_ENABLE_P1_FIRST_QUESTION_INVITATION` | `1` when testing | unset / `0` | `1` |

Server helper: `isP1FirstQuestionInvitationEnabled()` — same shape as `isP0ReflectionEntryEnabled()` (flag set + Production allow-key).

Client helper: `isP1FirstQuestionInvitationClientEnabled()` — reads `NEXT_PUBLIC_*`.

Debug fields (turn route, when relevant): `debug_p1_first_question_invitation_enabled`, `debug_p1_first_question_invitation_blocked_on_production`.

Document all three in `.env.example`. **Do not** set on Production until Tree approves.

---

## 6. Code map (planned)

| Area | Location | Responsibility |
|------|----------|----------------|
| Copy + eligibility | `lib/wisewave-p1-first-question-invitation.ts` | Aurora-approved strings; `shouldShowFirstQuestionInvitation()`; `getFirstQuestionText()`; fluent-opening detector for client suppression |
| Client UI | `app/chat/page.tsx` | Render invitation below P0 permission line on empty thread; hide on typing; tap → ephemeral question bubble; no chip/menu/wizard |
| Analytics (observation) | `lib/wisewave-p1-first-question-analytics.ts` | Metadata-only events; catalog entries |
| Tests | `lib/wisewave-p1-first-question-invitation.test.ts` | Flag gates, copy, eligibility, typing-suppress rules |
| Lumen fixtures | `docs/qa/P1_1_FIRST_QUESTION_INVITATION_LUMEN_FIXTURES_2026-07-11.md` | F01–F11 (existing) |
| Probes (optional) | `scripts/p1-first-question-invitation-probes.cjs` | Hosted debug smoke when flag on Preview |

**No new routes required** for Slice 1–3 if UI-only model is used.

---

## 7. Slice sequence (implementation order)

### Slice 0 — Planning only (this document) ✅

Tree-approved 2026-07-11. No code.

### Slice 1 — Flag infrastructure + copy module

**Status: HELD** — Tree 2026-07-13; await 2/4–4/4 and coexistence resolution.

- [ ] `lib/wisewave-p1-first-question-invitation.ts`
- [ ] Server/client enable helpers + Production guard
- [ ] `.env.example` entries
- [ ] Unit tests: flag off by default; Production blocked without allow key
- [ ] Debug fields stubbed (false when flag off)

**Maps to:** F11 (flag default off)

### Slice 2 — Empty-state invitation UI

- [ ] Below P0 permission line when: flag on, empty thread, user has not typed, invitation not ignored this session
- [ ] Typing ≥1 char hides invitation immediately (F03)
- [ ] Low-presence styling: secondary text link or quiet line — not hero, not card grid, not chips (F01, F09)
- [ ] ZH locale uses Aurora-approved invitation string (F10 partial)

**Maps to:** F01, F03, F09, F10 (invitation line), F11

### Slice 3 — One-question tap (UI-only)

- [ ] Tap invitation → show exactly one question in ephemeral assistant bubble (F02)
- [ ] No follow-up loop, no "ask another", no questionnaire
- [ ] Invitation hidden after use; session flag prevents re-push if ignored (F07)
- [ ] Fluent user who types/sends before tap never sees post-send invitation (F04)

**Maps to:** F02, F04, F07, F08

### Slice 4 — Observation analytics

- [ ] Catalog events (metadata only, no message body):
  - `first_question_invitation_shown`
  - `first_question_invitation_used`
  - `first_question_invitation_dismissed_by_typing`
  - `first_question_invitation_ignored`
- [ ] Session dedupe; mirror to GA4 optional with `skipBeacon` pattern

**Maps to:** fixture analytics table; F07/F08 metadata checks

### Slice 5 — Lumen Preview/local QA

- [ ] Steward enables flags on **Preview only**
- [ ] Lumen runs F01–F11
- [ ] Nova fixes defects only — no scope expansion

**Maps to:** full fixture matrix

### Slice 6 — Tree Production gate

- [ ] Lumen artifact + Tree explicit approval
- [ ] Steward sets Production allow key + redeploy
- [ ] Production smoke (F11 inverse + F01 spot-check)

**Not authorized until Slice 5 pass.**

---

## 8. Fixture mapping (F01–F11)

| Fixture | Slice | Notes |
|---------|-------|-------|
| F01 Blank start invitation | 2 | P0 permission + P1.1 line; no chips/menus |
| F02 Ask one question | 3 | UI-only ephemeral bubble |
| F03 Typing suppresses | 2 | `input.length > 0` hides invitation |
| F04 Fluent user never sees it | 2–3 | Hide on typing; no post-send injection |
| F05 Identity question | — (adjacent) | Turn-route orientation; not invitation UI |
| F06 Fragment / help | — (adjacent) | Turn-route one-question fallback; not invitation UI |
| F07 Ignored invitation | 3–4 | No idle auto-question; no nag on return |
| F08 Non-persistence | 3 | UI-only model; no DB `Message` on tap |
| F09 Low presence visual | 2 | Secondary styling; no layout shift |
| F10 ZH parity | 2–3 | Aurora ZH question line before ship |
| F11 Flag default off | 1 | Production guard verified |

---

## 9. Non-goals (Tree-forbidden)

- Prompt library, mode chips, menus, wizards, questionnaires
- Multiple simultaneous entry paths (Interaction Legibility + invitation combined **without Tree approval**)
- Auto follow-up questions after the first
- Repeated push if ignored
- Production UI without Tree approval
- Bundling with GR-1 linter or stability-patch changes
- Measuring success by session length, turn count, or invitation CTR optimization loops

---

## 10. Open items before coding Slice 1

| Item | Owner | Blocker? |
|------|-------|----------|
| **Coexistence / validation strategy** | Tree | **Hard** — product validation before any P1 entry-support code (Tree memo 2/4) |
| Wisewave + Tree documents **3/4–4/4** | Tree/Wisewave | **Complete** (2026-07-13) |
| P1.2 Design v1 (Reflection Strategy Engine) | Nova | **Drafted** — `docs/Wisewave_Product_Milestone_P1_2_Reflection_Strategy_Engine_Design_v1.md`; implementation **not approved** |
| Aurora: "Reflection Strategy Engine" naming | Aurora | **Never** public product copy or user-facing UI (internal/governance only) |
| ZH first-question text (not just invitation) | Aurora | Hard before ZH F10 sign-off |
| Confirm UI-only persistence model | Tree | Soft — recommended in this plan |
| Interaction Legibility layer design (non-interactive) | Tree/Wisewave/Aurora | Separate from P1.1; not discarded |

---

## 11. Nova stance

P1.1 addresses **initiation** only. Interaction Legibility and P1.2 are separate governed tracks. Tree P1 series **complete (4/4)**. Nova may draft **P1.2 Design v1**; holds all **code** until Tree/steward authorizes Slice 1 or P1.2 implementation.

**Next (design only, done):** `docs/Wisewave_Product_Milestone_P1_2_Reflection_Strategy_Engine_Design_v1.md` drafted 2026-07-13. **No code** until Tree/steward authorizes P1.1 Slice 1 or P1.2 implementation.
