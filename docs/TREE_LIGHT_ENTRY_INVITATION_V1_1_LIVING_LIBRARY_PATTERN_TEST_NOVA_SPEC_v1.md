# TREE TO NOVA

# Wisewave Light Entry Invitation v1.1
## Living Library Pattern Test
### Nova Implementation Specification v1.0

**Date:** 2026-08-09  
**Product:** Wisewave  
**Track:** Entry Legibility / Light Entry  
**Document Type:** Narrow Experiment Specification  
**Status:** DESIGN LOCK CANDIDATE — PLANNING AUTHORIZED  
**Owner / Execution Authority:** Tree  
**Product Authority:** Wisewave  
**Implementation:** Nova  
**Semantic Review:** Aurora  
**QA:** Lumen  

**Canonical filename:**  
`TREE_LIGHT_ENTRY_INVITATION_V1_1_LIVING_LIBRARY_PATTERN_TEST_NOVA_SPEC_v1.md`

**Nova planning reply:**  
`docs/NOVA_PLANNING_REPLY_LIGHT_ENTRY_V1_1_LIVING_LIBRARY_2026-08-09.md`

---

# 0. Executive Decision

Authorize a narrow entry-legibility experiment inspired by the interaction pattern of The Living Library:

> one primary action + a small number of natural-language examples

Do NOT copy its product behavior, visual identity, content model, guidance framing, or library metaphor literally.

Wisewave should borrow only the interaction principle:

> **Show the user what a valid first move can feel like, without making them choose a mode.**

This experiment must remain:

- lightweight
- optional
- default-off
- entry-only
- non-persistent
- non-directive
- non-classifying
- fully removable

---

# 1. Purpose

Current Wisewave entry preserves openness, but some users may not immediately understand what kind of expression belongs in the space.

The purpose of v1.1 is to test whether a small set of realistic first-sentence examples can reduce entry uncertainty without:

- teaching reflection
- structuring reflection
- turning reflection into selection
- making Wisewave speak first
- increasing product presence

The user must continue to author the first genuine message.

---

# 2. Primary Proof Target

This test passes only if:

> **A new user can more easily understand how to begin, while still feeling that the first real sentence belongs entirely to them.**

The proof is NOT:

- more clicks
- more messages
- longer sessions
- higher engagement
- more example usage

The proof is:

- lower blank-state uncertainty
- clearer understanding of what may be brought into Wisewave
- preserved authorship
- preserved Low Presence
- no menu feeling
- no onboarding feeling
- no guidance feeling

---

# 3. Core Interaction Principle

The Living Library pattern being borrowed is:

```text
Primary action
+
small number of concrete examples
```

Wisewave translation:

```text
Open composer
+
small number of natural first-sentence examples
```

Do NOT translate this into:

> Choose a reflection type

or:

> Select what you want to reflect on

The examples are legibility aids only.

---

# 4. Product Rule

Examples may demonstrate how reflection can begin.

They must never decide what the reflection is about.

The feature should communicate:

> “You can say something like this.”

It must not communicate:

> “Choose one of these paths.”

---

# 5. User-Facing Structure

The composer remains the primary visual and interaction anchor.

Recommended hierarchy:

```text
Wisewave

[ composer ]

Or begin with something like…

Example 1
Example 2
Example 3
Example 4
```

Alternative approved intro:

> You can begin anywhere.

Aurora should choose the final line after semantic review.

Do not show both unless specifically approved.

---

# 6. Example Sentence Set — v1.1

Use natural first-person language rather than abstract categories.

Initial English test set:

```text
I keep thinking about something that happened.

Something felt off today.

I don't quite know what I'm feeling.

I don't know where to begin.
```

Initial Chinese functional equivalents:

```text
我一直在想着刚刚发生的一件事。

今天有件事让我觉得哪里不太对。

我还不太知道自己现在是什么感受。

我不知道该从哪里开始。
```

EN / ZH parity should preserve:

- naturalness
- openness
- incompleteness
- low-pressure entry

Do not optimize for literal translation.

---

# 7. Why Sentence Examples Replace Category Labels

Previous entry concepts included labels such as:

- Something on my mind
- A feeling I can't quite name
- Something that happened
- I'm not sure where to begin

These remain valid conceptually.

v1.1 tests whether direct natural-language examples create better interaction legibility.

The intended shift is:

```text
category description
↓
human example
```

The user should think:

> “Oh, I can just say something like that.”

Not:

> “Which category am I in?”

---

# 8. Interaction Contract

## 8.1 On Example Click

Clicking an example must NOT submit that sentence as the user's message.

Preferred behavior:

- focus composer
- optionally use the clicked sentence as a temporary composer placeholder / ghost example
- keep actual input value empty
- allow the user to write in their own words
- send no backend request
- create no conversation
- create no draft
- assign no category
- persist no selection

The preferred v1.1 posture is:

> inspire, do not prefill

## 8.2 Explicitly Forbidden

Example click must never:

- automatically send a user message
- insert fixed text as authored user content
- call `/api/chat/turn`
- call the model
- trigger Entry Intelligence
- trigger an opening type
- trigger P1.1
- trigger First Mild Insight
- trigger Recognition
- alter reflection strategy
- alter future responses
- save a psychological category
- save analytics tied to inferred inner state
- become continuity state
- become memory
- become transcript content

---

# 9. Optional Alternative Interaction — Requires Separate Tree Approval

Nova may describe, but must NOT implement without approval, an alternate variant:

```text
click example
→ copy example into composer as editable draft
```

This variant carries greater Authorship risk because system-provided wording becomes user-visible authored text.

Therefore:

**NOT approved in v1.1 baseline.**

Baseline remains:

> focus / placeholder / ghost-example only.

---

# 10. Visibility Conditions

Show only when ALL are true:

```text
ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST = true
AND
new blank conversation = true
AND
message_count = 0
AND
composer_value = empty
AND
no restored draft
AND
no active error state
AND
no safety override
AND
no other entry experiment is active
```

---

# 11. Mutual Exclusion

This experiment must remain mutually exclusive with:

- P1.1 First Question Invitation
- older Entry Legibility variant
- prompt-chip experiments
- starter-card experiments
- any guided-entry system

At most one entry experiment may be visible at a time.

Rule:

```text
if living_library_entry_test:
    suppress all other entry experiments
```

---

# 12. Feature Flag

Implement behind a dedicated flag:

```text
ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST
```

Requirements:

- default OFF
- Preview-only until Tree approval
- Production blocked by default
- easy rollback
- no schema migration required

---

# 13. Visual Design

The visual treatment should borrow the restraint of a curated library interface without literally appearing as a library.

Desired character:

- editorial
- quiet
- spacious
- text-first
- low contrast relative to composer
- human
- non-productized

The examples should feel closer to:

> lines one might notice on a page

than:

> controls in an app

---

# 14. Do Not Use

Do not use:

- cards
- colored chips
- pill buttons
- icons
- illustrations
- categories
- numbered paths
- tabs
- carousel
- horizontal scrolling
- hover theatrics
- selected states
- checkmarks
- mode labels

Do not visually imply:

> “pick one.”

---

# 15. Semantic Component Form

Use accessible `<button type="button">` elements styled as quiet textual examples.

Conceptual structure:

```html
<section aria-label="Examples of ways to begin">
  <p>Or begin with something like…</p>

  <button type="button">
    I keep thinking about something that happened.
  </button>

  <button type="button">
    Something felt off today.
  </button>

  <button type="button">
    I don't quite know what I'm feeling.
  </button>

  <button type="button">
    I don't know where to begin.
  </button>
</section>
```

Accessibility semantics must not describe these as:

- reflection modes
- categories
- recommended topics

---

# 16. Composer Relationship

The composer remains visually dominant.

Preferred hierarchy:

```text
Composer
↓
small invitation line
↓
examples
```

Examples should sit far enough below the composer that they feel optional.

They must never visually compete with:

- text input
- send control
- main reflection
- active conversation

---

# 17. After User Starts Typing

Once the user types:

- placeholder / ghost example disappears naturally
- examples may fade or remain quietly visible until first send
- no active selection state remains
- no example should follow the user into conversation

Preferred behavior:

> Once authentic expression begins, Entry Legibility becomes less relevant.

Nova should recommend whether immediate hide-on-type or hide-on-send produces the lighter experience.

Do not implement both as experimentation infrastructure yet.

---

# 18. After First Genuine Message

Immediately after the first genuine user message:

- hide entire Living Library Pattern Test surface
- clear all local feature state
- restore standard Wisewave conversation experience
- never show the entry examples again inside that active conversation

This feature belongs only to arrival.

---

# 19. Refresh / Persistence

All interaction state is ephemeral.

Do not persist:

- clicked example
- selected example
- placeholder choice
- entry choice
- browser-local state
- database state
- user profile state
- conversation metadata

On refresh:

> return to clean default blank-entry state.

---

# 20. Analytics Boundary

This test does NOT authorize behavioral optimization.

If analytics are already permitted under current governance, only minimal technical events may be proposed.

Possible:

- `living_library_examples_visible`
- `living_library_example_clicked`
- `first_message_submitted`

Do not store:

- inferred emotion
- inferred issue category
- example meaning as user psychology
- "user selected feeling"
- "user selected relationship"
- any psychological classification

Analytics must not feed response generation.

If existing Wisewave governance currently prohibits new analytics for this slice, implement none.

Nova must report the current governance conflict before adding events.

---

# 21. Relationship to Reflection Entry

This experiment does not replace Reflection Entry.

It exists only at the surface-legibility level:

```text
Arrival
↓
Light Entry Legibility
↓
User-authored first expression
↓
Existing Wisewave runtime
```

The feature must disappear before deeper reflection behavior begins.

---

# 22. Relationship to ZPD / Scaffolding

Internally, this may be understood as a minimal entry scaffold:

> a user who does not yet know how to begin is shown what a plausible first sentence can look like.

However:

Do NOT expose terms such as:

- scaffolding
- ZPD
- developmental reflection
- psychological development

in the public UI.

The user experiences only:

> a slightly easier beginning.

---

# 23. Relationship to Seven Layers / Compass

None in v1.1.

This experiment must NOT:

- detect Seven Layers stage
- route examples by layer
- expose SeeSoul Compass
- personalize examples based on developmental stage
- infer psychological readiness

Those concepts belong to separate internal capability discussions.

This test is purely entry-legibility.

---

# 24. Relationship to First Mild Insight

None.

Light Entry Invitation v1.1 must not:

- increase FMI eligibility
- change FMI wording
- influence pattern recognition
- influence insight generation
- alter post-generation validators

Entry and insight remain separate governed layers.

---

# 25. Safety Boundary

Existing safety behavior remains dominant.

If any safety or crisis surface is active:

> suppress the Living Library Pattern Test.

Do not use entry examples as safety guidance.

Do not add crisis-related examples.

No safety logic changes are authorized.

---

# 26. Copy Guardrails

Examples should be:

- ordinary
- unfinished
- emotionally plausible
- non-clinical
- non-diagnostic
- non-dramatic
- non-therapeutic
- non-guiding

Good:

> Something felt off today.

Bad:

> I think my childhood trauma is affecting my relationships.

Bad:

> Help me understand my attachment style.

Bad:

> I need to heal my inner child.

The examples must not teach users how to psychologically interpret themselves.

---

# 27. Example Diversity Rule

Examples should represent different forms of incomplete human expression without becoming taxonomy.

Across four examples, aim for natural variety such as:

- something happened
- a vague feeling
- repetitive thinking
- uncertainty about beginning

Do not expand into:

- work
- relationships
- family
- anxiety
- trauma
- identity
- spirituality

as visible categories.

---

# 28. No Prompt Library Drift

Four examples must not become:

- 8 examples
- 20 examples
- rotating suggestions
- prompt library
- topic browser
- category page
- personalized prompt engine

If more examples seem necessary:

> stop and return to Tree.

The experiment tests whether less is enough.

---

# 29. No Living Library Product Drift

The reference product is inspiration only.

Do not copy:

- branding
- wording
- layout exactly
- visual system
- "ask X" interaction
- guidance behavior
- conversational metaphor
- content-object selection model

Wisewave remains Wisewave.

The principle being tested is generic:

> clear primary action + a few concrete examples.

---

# 30. QA Questions

Lumen should evaluate:

- Does the user understand more easily what can be said here?
- Does the interface still feel open?
- Do examples feel optional?
- Does anything feel like a mode selector?
- Does anything feel like onboarding?
- Does anything feel like prompting?
- Does clicking preserve authorship?
- Is the composer still dominant?
- Does the feature disappear cleanly?
- Is the experience lighter than simply explaining Wisewave?

Critical removal test:

> If removing the examples makes the entry cleaner without meaningfully reducing legibility, remove them.

---

# 31. Aurora Semantic Review

Aurora should specifically review:

- whether examples teach correct market understanding
- whether they pull Wisewave toward journaling
- whether they create therapy/coaching associations
- whether "Or begin with something like…" is too instructional
- EN/ZH naturalness
- category integrity

Aurora may recommend one-line copy changes.

No surface expansion.

---

# 32. Nova Required Implementation Output

Before building, Nova should return:

1. Current Entry-State Mapping
2. Minimal Implementation Path
3. EN/ZH Copy Integration
4. Mutual Exclusion
5. Persistence Confirmation
6. Analytics Position
7. Rollback
8. QA Evidence Plan

---

# 33. First Build Authorization Boundary

After Tree approves Nova's implementation plan, the first build may contain only:

- dedicated feature flag
- four EN examples
- four ZH equivalents
- quiet entry surface
- composer focus
- temporary placeholder / ghost-example behavior
- clean dismissal
- mutual exclusion
- test coverage

No additional capability.

---

# 34. Production Gate

Production remains HOLD.

Required before Production consideration:

```text
Nova internal implementation = complete
Aurora semantic review = PASS
Lumen UX / boundary QA = PASS
Tree product review = PASS
Founder approval = YES
```

No gate may be bypassed.

---

# 35. Success Definition

The strongest success signal is not:

> “Users clicked the examples.”

It is:

> “Users seem to understand how to begin, while the interface still feels as though almost nothing was added.”

---

# 36. Final Product Principle

Borrow the interaction clarity of a library, not the architecture of a library.

And:

> Show what a beginning can sound like.  
> Never decide what the user should say.

---

# TREE DECISION

```text
AUTHORIZED NOW:
Nova implementation planning for:
Light Entry Invitation v1.1 — Living Library Pattern Test

NOT YET AUTHORIZED:
Production release
bulk example expansion
prompt library
topic categories
personalized entry suggestions
backend behavior change
analytics expansion
ZPD / Seven Layers routing
FMI integration
any other entry feature
code build (pending Tree approval of Nova plan)
```

Nova should return the required implementation plan before code authorization.
