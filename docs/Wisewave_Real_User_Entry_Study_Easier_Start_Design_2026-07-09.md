# Real-User Entry Study — "Easier to Start, Easier to Ask"

| Field | Value |
|-------|-------|
| **Date** | 2026-07-09 |
| **Author** | Nova |
| **Data** | `tmp_reflection_export_2026-07-08.json` (7 real users, first sessions, anonymized; local only — not committed) |
| **Status** | Study + design proposal — no lock/approval implied; input for P0 observation review + P1/RCL governance |

---

## 1. What the data shows

### 1.1 The seven first sessions

| User | First message | Style | Outcome |
|------|--------------|-------|---------|
| user_01 | "I'm worried that I will not be able to make it" | Emotional → drifts into commands | 30 msgs but confused; treated Wisewave as a command tool ("Activate", "Improve me", "deliver it"); asked **3 times** what Wisewave is |
| user_02 | "Hi" → "What can you tell me about gaslighting" | Info question → distress | **Churned angry** ("You are not help", "Loser"); wanted answers, got mirrors that felt evasive |
| user_03 | "I need self reflection could you ask me some questions" | **Explicit ask-me request** | Got questions, answered once, left after 2 turns |
| user_04 | "I have a dream" | Story opener → vulnerable | Real content, then "What should I do?" — 3 msgs total |
| user_05 | "I have the urge to write… not sure what I want to write about" | Reflective | **Deep 7-turn reflection** — success |
| user_06 | ~600-word pharmacy placement document paste | Utilitarian | Wanted feedback grade ("is that a good reflection"); got it eventually |
| user_07 | "i feel the opposite of whole…" | Deep emotional | **Deep 8-turn reflection**, ended "Thank you" — success |

### 1.2 The core finding

**Only 2 of 7 users arrived already knowing how to reflect** (user_05, user_07). Both succeeded with zero help. Everyone else struggled with the same underlying problem — but it is **not** blank-page anxiety in the classic sense:

> **Users don't know what kind of thing to say to this space, so they ask the system to go first.**

Evidence — users explicitly asking Wisewave to lead:

- user_03: *"could you ask me some questions"* (verbatim, first message)
- user_02: *"What can you do"*, *"Any answers for me"*, *"Help!"*
- user_01: *"What do I need to do"*, *"how to start?"*, *"Tell me"*, *"Hep me"*, *"Example"*

That is **3 of 7 users** asking the system to take the first step, in their own words.

### 1.3 Secondary patterns

**A. Identity confusion is an entry blocker.** user_01 asked "Define who you are?", "Are you professional at?", "What u do?" — three separate times. user_02's rage arc ("You are not help") is the same confusion expressed as frustration: they never learned what the space is for. When users don't know what Wisewave does, they can't form an opening message.

**B. Fragment/command inputs go nowhere.** ~half of user_01's messages were ≤3 words ("Activate", "Investment", "Ok"). The assistant's one-word replies ("Sure.", "I'm here.", "Ok.") to these fragments created dead ends. Every dead end raised frustration.

**C. Advice-seekers need something to hold, not just a mirror.** user_02's "Any answers for me" got a reflection *about wanting answers* — accurate, but it offered nothing to grab. Two turns later they quit angry. Compare: the one time Wisewave asked a direct question ("What feels most unclear or heavy for you right now?" — user_03), the user **answered it immediately**.

**D. Questions work.** In every session where the assistant ended with a concrete, answerable question, the user responded to it. Mirrors without questions frequently stalled.

**E. Bug found:** two **empty assistant responses** in the export (user_01 at "how to start?", user_07 turn 2). A user asking literally "how to start?" received a blank reply. This is a production stability issue — eligible to fix during observation window.

---

## 2. Design proposal — "Wisewave can ask first"

Goal: make starting easier **without** adding menus, prompt libraries, or louder UI. One principle covers most of the data:

> **When the user cannot go first, Wisewave offers one question.**

### 2.1 Empty state: one quiet invitation to be asked (client)

Under the existing permission line, add one tappable line:

```
You can begin anywhere.
Or, if it's easier — let Wisewave ask you a question.
```

ZH: `你可以从任何地方开始。` / `也可以让 Wisewave 先问你一个问题。`

Tap → **one** assistant question appears (no menu, no list). Question pool (rotate, small):

- "What's taking up the most space in your mind right now?" / 「现在占据你脑海最多的是什么？」
- "What feels most unclear or heavy right now?" / 「现在什么让你觉得最不清楚、最沉？」 *(proven in data — user_03 answered this)*
- "Is there something from today that's still sitting with you?" / 「今天有什么事还留在你心里吗？」
- "If one thought keeps returning lately, what is it?" / 「最近有没有一个想法总是回来找你？」

Rules: one question at a time; at most one "ask me another"; disappears once the user writes. **This directly serves user_03's verbatim request and user_01/02's implicit ones.**

### 2.2 Identity questions get one orientation line (server)

Detect capability/identity questions ("what do you do", "who are you", "what can you do", "are you professional at", 「你是什么」「你能做什么」) in early turns → respond with **one** orientation line + **one** question:

> "I'm a quiet space for hearing your own thinking — I reflect rather than advise. What's on your mind right now?"

This would likely have prevented user_02's churn and user_01's three identity probes. It uses locked identity language (*reflects rather than advises*).

### 2.3 Fragments get a question, not an echo (server)

When the user sends a command-fragment ("Help!", "Improve me", "Activate", ≤3 words with imperative shape), never reply with a bare acknowledgment ("Sure.", "I'm here."). Always attach one gentle, answerable question:

> "I'm here. What's happening right now that made you reach for help?"

### 2.4 Advice-seek responses must end with an answerable question (server)

Tighten the existing P0 Clarify behavior: acknowledging the wish for direction is not enough — the response must end with **one concrete question the user can actually answer**. Mirrors that only describe the user's wanting ("there may be a pull to get an answer…") read as evasion under distress.

### 2.5 Fix the empty-response bug (stability — allowed now)

Two blank assistant turns in seven sessions is a meaningful failure rate. Investigate `app/api/chat/turn/route.ts` response assembly / model-output normalization for the empty `main_reflection` path and add a guard (retry or minimal fallback line).

**RESOLVED 2026-07-09 (Nova).** Root cause was not model output: the **drift-linter high-severity suppression path** in `/api/chat/turn` deliberately blanked `assistantContent` and overwrote the stored DB message with `""`. Broad high-severity patterns (`you could`, `try to`, `goal`, `you have been`) trip on ordinary reflective replies — the reply to "how to start?" almost certainly contained one. The live turn showed a client-side placeholder, but reload/history rendered an empty bubble, which is what the export captured. Fix: suppression now stores/returns a neutral linter-clean fallback (`lib/wisewave-drift-suppression-fallback.ts` — EN reuses the shipped client placeholder line; ZH parity added); drifted text is still discarded, guardrail unchanged. Debug flag: `debug_drift_suppression_fallback_applied`. Linter pattern breadth escalated separately (guardrail change, Tree + OctopusMind). See `docs/QA_HANDOFF.md` 2026-07-09 entry.

---

## 3. Why this fits the philosophy

- **No menu, no modes, no prompt gallery** — one question, offered only when the user signals they can't go first (tap, fragment, identity question, explicit "ask me").
- **Presence follows need** — users who begin fluently (user_05, user_07) never see any of this.
- **Being asked ≠ being led.** A question hands authorship back; advice takes it. The data shows users answer questions with their own real content immediately.
- The empty-state line is opt-in (tap), quieter than a selector, and disappears on first input.

## 4. Measurement

Existing events already cover most of it: `conversation_started`, `entry_type_detected`, `reflection_started`, `conversation_entered_reflection`, `conversation_abandoned_before_reflection`. Add (observation only): `ask_me_first_offered`, `ask_me_first_used`. Success = more first sessions reaching real reflection (user_05/07 shape), fewer user_02-shape churns — not clicks.

## 5. Suggested order

1. **Bug fix** — empty assistant responses (observation-window-eligible now)
2. **2.2 + 2.3 + 2.4** — server-side response shaping (no new UI; arguably prompt/entry tuning, needs Tree read on whether observation freeze covers it)
3. **2.1** — "let Wisewave ask you a question" empty-state line (client UI; needs Aurora for copy + Tree gate; natural candidate for the P1 Reflection Companion / RCL discussion)
