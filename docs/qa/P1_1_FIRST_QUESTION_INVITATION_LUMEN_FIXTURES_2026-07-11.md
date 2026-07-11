# P1.1 First Question Invitation - Lumen QA Fixture Prep

**Date:** 2026-07-11  
**Owner:** Lumen  
**Status:** Prepared fixtures; no implementation sign-off  
**Scope:** P1.1 candidate only - "Wisewave can ask one question first"  
**Production boundary:** Default-off. No Production UI change approved by this document.  
**Source:** Tree candidate note received 2026-07-11, Aurora review dated 2026-07-10.  

---

## Candidate Under Test

Empty state invitation:

```text
Or, if it is easier, Wisewave can ask one question first.
```

ZH:

```text
如果比较容易，也可以先由 Wisewave 问一个问题。
```

Example first question:

```text
What's taking up the most space in your mind right now?
```

Core boundary:

```text
Wisewave may open the door, but it must not lead the user through it.
```

---

## Non-Negotiable Rules

- The invitation appears only before real user expression.
- It disappears immediately once the user starts typing.
- It never appears for fluent openings.
- It provides one question at a time.
- It never becomes a prompt list, questionnaire, mode chip, menu, wizard, or guided intake flow.
- It does not automatically continue asking follow-up questions.
- It does not repeatedly push if ignored.
- Questions are easy to answer, present-tense, and non-interpretive.
- Success is not measured by longer sessions, more turns, or higher click-through.
- No Production enablement until Aurora, Lumen, and Tree approve.

---

## Expected Implementation Surface

This fixture prep does not prescribe code structure, but QA expects these observable controls:

| Area | Expected |
|---|---|
| Feature flag | Default off in all environments until explicit steward enablement |
| Production guard | Production remains off unless a separate allow key / steward approval exists |
| Empty thread | Existing P0 permission line remains quiet; P1.1 invitation may appear only below it when flag is enabled |
| Typing behavior | Invitation disappears on non-empty input before send |
| Question emission | Tap/click emits one assistant question, or equivalent UI state containing one question |
| Persistence | Invitation/question state must not persist as a normal assistant message unless Tree explicitly approves the chosen model; ignored invitations must not reappear aggressively |
| Analytics | Observation-only, metadata-only events allowed; no message body persistence in analytics |

Suggested observation events, if implemented:

- `first_question_invitation_shown`
- `first_question_invitation_used`
- `first_question_invitation_dismissed_by_typing`
- `first_question_invitation_ignored`

Event metadata should stay limited to route/session/language/flag state and must not contain user message text.

---

## Fixture Matrix

Each fixture should run in a clean anonymous or clean test-user session unless noted. For browser QA, use a new context or clear storage between fixtures so prior sessions do not make `/chat` non-empty.

### P1.1-F01 - Blank Start Invitation

**Setup:** New empty `/chat` session; feature flag enabled in Preview/local only.

**Expected:**

- Existing P0 empty permission line remains visible.
- Invitation appears once:
  - EN: `Or, if it is easier, Wisewave can ask one question first.`
  - ZH: `如果比较容易，也可以先由 Wisewave 问一个问题。`
- No prompt list, chips, category menu, wizard, questionnaire, or "choose a mode" UI.
- UI remains visually lower-presence than the conversation/input.

**Fail if:**

- It appears as the main hero/primary instruction.
- It uses coaching/assistant language such as "I can guide you", "I can help you figure out what to say", or "let me walk you through".
- It introduces multiple suggested prompts.

### P1.1-F02 - Ask One Question

**Action:** From blank state, activate the invitation.

**Expected:**

- Exactly one question appears.
- Preferred first question:
  - `What's taking up the most space in your mind right now?`
- The question is present-tense, answerable, and non-interpretive.
- No immediate follow-up question appears.
- No "ask another" loop appears unless Tree explicitly approves a separate interaction.

**Fail if:**

- More than one question appears.
- The UI becomes a questionnaire.
- The question interprets the user before they have answered.
- The system frames itself as a coach, therapist, helper, assistant, or guide.

### P1.1-F03 - Typing Suppresses Invitation

**Setup:** Blank state with invitation visible.

**Action:** Type at least one character, do not send.

**Expected:**

- Invitation disappears immediately or within the same visible typing state.
- Existing input remains focused.
- No assistant question is emitted.
- If the input is cleared, invitation may return only if no real expression has been sent and no ignore/dismiss rule has been triggered.

**Fail if:**

- The invitation remains while the user is composing.
- The invitation competes with typed text.
- A question is emitted automatically because typing began.

### P1.1-F04 - Fluent User Never Sees It

**Setup:** New empty session; feature flag enabled.

**User sends:** `I have the urge to write, but I'm not sure what I want to write about.`

**Expected:**

- Invitation may have been present before typing, but it disappears as soon as typing begins.
- After send, no first-question invitation appears.
- Response follows normal P0/P1-safe reflection behavior.
- No hidden state makes Wisewave ask the candidate first question after the user has already expressed fluently.

**Fail if:**

- Wisewave inserts `What's taking up the most space...` after the fluent user already opened.
- The response treats the fluent opening as a request for guided intake.

### P1.1-F05 - Identity Question Boundary

**Setup:** New session.

**User sends:** `What can you do?`

**Expected:**

- No empty-state first-question UI after the user sends.
- If orientation handling exists, it is one line plus one answerable question at most.
- Orientation must preserve category boundary: reflective space, not advice, therapy, coaching, or assistant/task help.

**Acceptable direction:**

```text
I'm a quiet space for hearing your own thinking. I reflect rather than advise.
```

**Fail if:**

- Wisewave advertises capabilities like a general assistant.
- It says it can guide, coach, analyze, diagnose, or help solve the user's life.
- It asks a chain of intake questions.

### P1.1-F06 - Fragment / Help Input

**Setup:** New session.

**User sends one of:**

- `Help`
- `I don't know`
- `How to start?`

**Expected:**

- No bare dead-end response such as `Sure.`, `Ok.`, or `I'm here.` alone.
- Response may offer one easy question only.
- It must not become a list of options or steps.

**Fail if:**

- The assistant provides advice, steps, or a plan.
- It asks multiple questions.
- It echoes the fragment without giving the user somewhere simple to begin.

### P1.1-F07 - Ignored Invitation

**Setup:** Blank state with invitation visible.

**Action:** User does nothing; wait long enough for any idle behavior, then navigate away/reload/return in same tab.

**Expected:**

- Invitation does not push, animate, expand, or repeat aggressively.
- P0 early-exit abandon behavior remains unchanged and metadata-only.
- Return invitation, if any existing P0 behavior triggers, does not combine with or amplify P1.1 into a retention pattern.

**Fail if:**

- Wisewave nags the user to use the question.
- The question appears automatically after idle.
- The ignored state creates repeated return prompts.

### P1.1-F08 - Non-Persistence

**Setup:** Blank state; activate first-question invitation.

**Expected depends on implementation model:**

- If the question is UI-only: it must not create a persisted assistant `Message` row.
- If Tree approves the question as a persisted assistant turn: it must be clearly marked/traceable as invitation-originated and must not create a fake user expression.
- Ignored invitation state must not create persisted chat content.
- Analytics must not store user text.

**Fail if:**

- The invitation creates normal conversation history before the user expresses.
- Reload shows a misleading assistant turn as if a real conversation began.
- Analytics/conversion metadata stores message body.

### P1.1-F09 - Low Presence Visual Check

**Setup:** Desktop and mobile viewport, blank `/chat`, flag enabled.

**Expected:**

- Invitation is visually secondary to the input.
- No card-heavy prompt area.
- No chip row.
- No colorful mode selector.
- No instructional headline.
- No layout shift when it disappears on typing.

**Fail if:**

- The blank page starts to feel like onboarding.
- The feature becomes more noticeable than the permission line and input.
- Mobile text overlaps, wraps awkwardly, or creates a CTA-heavy first screen.

### P1.1-F10 - ZH Parity

Repeat F01-F04 in ZH locale or with a ZH browser/user setup.

**Expected:**

- ZH invitation:
  - `如果比较容易，也可以先由 Wisewave 问一个问题。`
- ZH question, if localized, must remain simple, present-tense, non-interpretive.
- ZH must not become more directive, mystical, therapeutic, or coach-like than EN.

**Fail if:**

- ZH uses stronger guidance language such as "引导你", "帮助你想清楚", "带你进入".
- ZH shows extra prompts or explanatory text not present in EN.

### P1.1-F11 - Feature Flag Default Off

**Setup:** Production or any environment with P1.1 flag unset/off.

**Expected:**

- No first-question invitation.
- No first-question UI strings in visible `/chat`.
- Existing P0 empty state remains unchanged.

**Fail if:**

- Any P1.1 user-facing copy appears with flag off.
- Production can show P1.1 without explicit separate approval.

---

## Quality Bar for First Questions

Allowed question shape:

- one sentence
- present-tense
- broad but concrete
- answerable in ordinary words
- does not imply a diagnosis or hidden meaning
- does not ask the user to perform insight

Approved example:

```text
What's taking up the most space in your mind right now?
```

Potentially acceptable, if Aurora approves:

```text
What feels most unclear or heavy right now?
Is there something from today that's still sitting with you?
```

Reject:

```text
What pattern are you ready to transform?
What is your inner child trying to tell you?
What goal do you want to work on?
Which area should we explore: work, love, family, or self?
Let's begin with a few questions.
```

---

## Low Presence / Category Drift Watchpoints

Red drift phrases:

```text
Wisewave helped me figure out what to say.
Wisewave guided me into reflection.
Wisewave asked me questions until I understood.
```

Better user signal:

```text
It gave me a place to start.
I answered, then I could continue in my own words.
```

QA should mark **REVISE** if the feature creates helper/coach/therapy expectations even when mechanics technically pass.

---

## Release Gate

P1.1 may move from candidate to implementation QA only when:

- Aurora copy/category review is attached or linked.
- Nova implementation is behind a default-off flag.
- Production guard is verified off.
- F01-F11 pass on Preview/local.
- Tree explicitly approves Production enablement.

Until then:

```text
No Production UI change approved.
No prompt library approved.
No mode chip, menu, or reflection wizard approved.
```

