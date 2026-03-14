# Wisewave.io V1 Core Loop — Technical Product Specification

**Project:** Wisewave.io  
**Module:** /chat Reflection Core Loop  
**Version:** V1  
**Prepared for:** Nova

## Purpose

Translate the HC-OS Core Loop into a working product system inside Wisewave.io.

---

## 1. Objective

Build the first working version of the Wisewave Core Loop inside /chat.

This is not a generic AI chat flow. It is a lightweight reflection system that helps a user move through one full internal cycle:

**Input → Awareness → Interpretation → Regulation → Choice → Action → Feedback → Integration → New Input**

For V1, the system does not need full consciousness intelligence. It only needs to prove one thing:

**A user can submit one meaningful reflection, receive one concise AI reflection, have one durable insight saved, and see continuity returned in the next interaction.**

---

## 2. Product Goal

The product goal of V1 is to **validate a working continuity loop**.

A successful V1 interaction should do all of the following:

- Capture a real user reflection
- Generate a concise AI reflection that feels grounded and specific
- Extract and save one durable insight
- Resurface that insight later as continuity

This means the system must move beyond one-off chat responses and begin functioning as a **cumulative reflective intelligence layer**.

---

## 3. Scope

**In Scope for V1**

- /chat reflection interaction
- user message capture
- reflection pipeline
- concise reflection output
- lightweight pattern extraction
- durable insight saving
- continuity strip on future load
- optional follow-up feedback prompt structure

**Out of Scope for V1**

- full therapeutic dialogue system
- advanced multi-session psychological profiling
- large-scale memory clustering
- deep personalization engine
- clinical emotional assessment
- complex journaling workflows
- long-term progress dashboard
- multi-agent orchestration inside the UI

---

## 4. Core Product Principle

The system must **not** behave like a generic chatbot. It must behave like a **lightweight consciousness-guiding reflection loop**.

That means:

- It should **not** simply summarize user text
- It should **not** produce long advice dumps
- It should **not** over-interpret the user
- It should **not** sound preachy, spiritualized, or therapeutic
- It **should** help the user notice a pattern, regain some inner space, and take one grounded next step

---

## 5. User Experience Summary

### Desired V1 User Flow

**First interaction**

1. User opens /chat
2. User enters a reflection or concern
3. System processes message
4. System returns: one concise mirror/reflection, one light regulation cue, one small next-step prompt or choice
5. System saves one durable insight from the interaction

**Next interaction**

1. User returns to /chat
2. System loads latest saved insight
3. UI displays continuity strip
4. User feels the system remembers prior growth context
5. New reflection begins from a more aware starting point

---

## 6. Core Functional Model

| Stage | Product translation |
|-------|---------------------|
| **A. Input** | Raw user reflection enters the system |
| **B. Awareness** | System detects: event, emotion, focus, awareness level |
| **C. Interpretation** | System detects: rejection, self-doubt, loss of control, worth threat, uncertainty, pressure |
| **D. Regulation** | System introduces one light stabilizing cue: pause, name emotion, soften urgency, delay reaction |
| **E. Choice** | System offers a small conscious alternative |
| **F. Action** | System suggests one lightweight next move |
| **G. Feedback** | System can later ask whether that move helped |
| **H. Integration** | System saves one durable insight |
| **I. New Input** | That insight is surfaced later as continuity |

---

## 7. V1 Response Structure

Each assistant response should contain **2 to 4 parts maximum**.

- **Mirror** — Briefly reflect what is actually happening inside the user experience
- **Insight** — Gently name the likely pattern or interpretation
- **Regulation cue** — Offer one grounding cue before reaction
- **Next step** — Suggest one small conscious move

**Example**

- User: *"He didn't reply and I keep thinking maybe I did something wrong."*
- Response: *"This seems to be touching more than the delay itself. It may be pulling you into self-doubt very quickly. Before deciding what it means, pause and notice that reaction first. Your next step could simply be to wait a little and respond later from a calmer place."*

---

## 8. Quality Bar

A reflection is successful if it feels: **specific, calm, perceptive, grounding, concise, helpful**.

The system must feel like: **a clear mirror, a grounded guide, a continuity-based reflection partner**.

The system must **not** feel like: a therapist, a guru, a spiritual authority, a productivity coach, a vague self-help bot.

---

## 9. Functional Requirements

### 9.1 Chat Input Capture

- Accept user reflection text in /chat
- Store raw input, associate with user and session, timestamp all messages
- **Minimum:** Every user message must be persisted before reflection processing begins.

### 9.2 Reflection Pipeline

After receiving a user message, run a pipeline that produces:

- structured interpretation metadata
- user-facing reflection text
- regulation cue
- optional action suggestion
- durable insight candidate

### 9.3 Pattern Extraction

Extract minimal structured reflection state. **Required fields for V1:**

- trigger or event
- dominant emotion
- likely interpretation
- suggested regulation cue
- suggested next action
- durable insight candidate

**Example extracted state:**

```json
{
  "trigger_label": "delayed_reply",
  "emotion_label": "anxiety",
  "interpretation_label": "not_important",
  "regulation_label": "pause_before_reacting",
  "choice_label": "wait_then_reassess",
  "insight_candidate": "When silence appears, user tends to interpret it as personal rejection."
}
```

### 9.4 Assistant Reflection Output

- Concise, readable, emotionally intelligent, grounded in extracted state, aligned with V1 tone.
- **Target:** 2–5 sentences; **hard cap:** ~120 words.

### 9.5 Insight Saving

After a successful reflection response, save **one** durable insight.

**Good examples:** "You tend to read silence as rejection." / "When uncertainty rises, you move quickly into self-blame."

**Bad examples:** "You were upset today." / "You had a hard conversation."

### 9.6 Continuity Resurfacing

On next chat entry, load latest active insight and display it in the UI (short, relevant, non-intrusive).

### 9.7 Feedback Support (optional)

Lightweight feedback prompt in next session, e.g. *"Last time you chose to pause before reacting. Did that help?"* — store even if UI is minimal.

---

## 10. Non-Functional Requirements

- **Performance:** Chat response near-real-time; extraction + generation in one flow; continuity on page load.
- **Reliability:** User message not lost if model fails; insight save retriable; continuity fails gracefully if no prior insight.
- **Privacy:** Insights user-scoped; no cross-user leakage.
- **Maintainability:** Extraction and generation logic separable; prompts configurable; insight schema evolvable.

---

## 11. Suggested System Architecture

1. **Chat UI** — input, assistant output, continuity strip, optional feedback
2. **Message Intake Service** — session creation, message persistence, normalization
3. **Reflection Engine** — model call, reflection generation, response formatting
4. **Pattern Extraction Layer** — structured metadata extraction, minimal labeling, insight candidate
5. **Insight Memory Service** — durable insight selection, save, fetch latest active insight
6. **Continuity Service** — retrieve saved insight, convert to user-visible continuity text

---

## 12. Recommended Backend Flow

1. User submits message
2. Backend saves user message
3. Backend runs extraction pass
4. Backend runs reflection generation pass
5. Backend returns assistant response
6. Backend saves assistant response
7. Backend saves durable insight
8. Future session loads latest insight as continuity

---

## 13. Suggested Data Model

### 13.1 sessions

`id`, `user_id`, `started_at`, `ended_at`, `entry_point`

### 13.2 messages

`id`, `session_id`, `user_id`, `role`, `content`, `created_at`

### 13.3 reflection_runs

`id`, `session_id`, `message_id`, `trigger_label`, `emotion_label`, `interpretation_label`, `regulation_label`, `choice_label`, `insight_candidate`, `created_at`

### 13.4 insights

`id`, `user_id`, `session_id`, `source_message_id`, `core_pattern`, `new_response`, `continuity_text`, `status` (active | archived), `confidence_score`, `created_at`, `last_seen_at`

### 13.5 feedback_events

`id`, `user_id`, `insight_id`, `action_taken`, `outcome_rating`, `feedback_text`, `created_at`

---

## 14. Suggested API Endpoints

- **POST /api/chat/message** — Receives user message; returns assistant reflection, reflection_state, saved_insight.
- **GET /api/chat/continuity** — Returns latest active continuity insight for current user.
- **POST /api/chat/feedback** — Saves follow-up feedback on prior suggested action.

---

## 15. Prompting Strategy

**Stage 1 — Extraction prompt:** Return structured labels + one insight candidate (strict JSON).

**Stage 2 — Response prompt:** Generate user-facing reflection text; constraints: calm, concise, grounded, not preachy/therapeutic/spiritual, no overclaim, no diagnosis.

---

## 16. UI Requirements

/chat must include: continuity strip, message input, assistant reflection card, optional micro-action prompt, optional feedback prompt.

---

## 17. UI Copy Style

Calm, minimal, clear, respectful, human. Avoid: "healing your trauma," "inner child," "shadow," "the universe is teaching you," "you are being called to," diagnostic terms. Prefer: "This seems to be touching…", "Before deciding what it means…", "A steadier next step might be…".

---

## 18. Error Handling

- Extraction fails → save raw message, fall back to basic reflection.
- Generation fails → graceful fallback message, keep interaction record.
- Insight save fails → return chat response normally, log, allow retry if supported.
- Continuity unavailable → hide continuity strip cleanly.

---

## 19. Logging and Observability

Measure: messages submitted, reflection generation success rate, insight save success rate, continuity display rate, repeat-user continuity load rate, feedback completion rate.

---

## 20. Acceptance Criteria

**V1 is complete when:**

- User can send a reflection; system saves message; returns concise reflection; extracts and saves one durable insight; shows continuity from saved insight in a future visit.
- Reflection does not feel generic or preachy; continuity feels relevant; output is short and readable; system feels like an ongoing reflective guide.
- Messages persist reliably; insights are user-scoped; continuity loads correctly; no cross-session leakage; fallback handling works.

---

## 21. Recommended Build Order

**Phase 1 — Must Build First:** message persistence, reflection generation, insight extraction, insight save, continuity strip load.

**Phase 2 — Next:** structured reflection metadata, regulation cue rendering, choice/action prompt rendering, follow-up feedback support.

**Phase 3 — Later:** insight deduplication, pattern family grouping, growth timeline, reflection quality scoring, adaptive continuity logic.

---

## 22. Definition of Done (V1)

This module is done when:

**A returning user can feel that Wisewave remembers a real pattern from before, reflects the current moment clearly, and helps them respond with slightly more awareness than automatic reaction.**

Not "the AI answered." But: **the loop closed.**

---

## 23. Final Instruction to Nova

Build this as a **working reflective loop**, not a chat enhancement. The first milestone is **operational continuity**. If V1 can reliably: capture reflection → generate grounded reflection → save insight → resurface continuity, then Wisewave.io has begun to function as a real consciousness interface, not just a conversational tool.
