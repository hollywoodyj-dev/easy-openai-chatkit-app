# Wisewave V1 Core Loop — Progress & Next Step

**When you are asked to "process project with next step":** read this file, then execute the **Next Action** for the current ticket (or advance to the next ticket if current is Done). Update this file after each meaningful step.

---

## Milestone Status

| Milestone | Goal | Status |
|-----------|------|--------|
| **A — Loop Foundation** | Minimum working reflection loop: submit reflection → AI reflection → insight saved → continuity on return | Done |
| **B — Guided Reflection Layer** | Regulation cue, action prompt, feedback capture, metadata rendering | Not Started |
| **C — Measurement + Reliability** | Logging, fallback validation, continuity checks, multi-user isolation | Not Started |

---

## Ticket Table (Milestone A)

| # | Ticket | Owner | State | Blocker | Next Action |
|---|--------|-------|-------|---------|-------------|
| 1 | Create session and message persistence for /chat | Nova | Done | none | — |
| 2 | Build extraction pipeline returning structured reflection JSON | Nova | Done | none | — |
| 3 | Build response generation pipeline for concise reflection output | Nova | Done | none | — |
| 4 | Create insights persistence model and save logic | Nova | Done | none | — |
| 5 | Load latest active insight and render continuity strip on /chat | Nova | Done | none | — |

---

## Current Focus

**Current milestone:** C — Measurement + Reliability  
**Current ticket:** 13 — Validate multi-user isolation and memory boundaries  
**State:** Not Started  
**Blocker:** none  

### Next Action (do this when user says "process project with next step")

Milestone C: Tickets 7, 11, and 12 are now PASS (logging, fallback handling, and continuity success checks).  
When continuing, start **Ticket 13 — Validate multi-user isolation and memory boundaries**:
- Design a small set of test users and sessions to verify that insights, continuity, feedback, and reflection logs do not leak across users or sessions.  
- Confirm that continuity and “Last insight” strips always reflect the current user’s data only, and that session IDs cannot be used to access another user’s history.  
- Use `[ticket7]` logs and DB inspection (if available) to check for any unintended cross-user sharing of insights or reflection state; capture any findings as follow-up tickets.

### Definition of Done — Ticket 3

- [x] Response generation uses extracted state when available (reflection_state injected into chat system prompt as "Latest reflection state" block).
- [x] Output follows V1 style constraints via the Wisewave chat prompt (mirror/pattern/regulation framing and tone); length controlled via prompt and max_completion_tokens.
- [x] Generation failure path remains unchanged: graceful error JSON and assistant message persisted only on success.

### Review (Lumen)

- Output is concise and readable; does not sound preachy, spiritual, or therapeutic
- Output is not generic summary-only

### Definition of Done — Ticket 2 (completed)

- [x] Extraction prompt returns valid JSON with required fields (null-safe defaults in lib/wisewave-extract.ts)
- [x] Malformed model output caught and handled; failed extraction logged; extraction non-blocking
- [x] Extracted result saved to ReflectionRun and returned as reflection_state in turn response

### Definition of Done — Ticket 4

- [x] Insight persistence model exists (Prisma `Insight` model) with user-scoped, session-linked fields.
- [x] After a successful chat turn with a non-empty `insight_candidate`, one durable insight is saved per interaction (corePattern + continuityText).
- [x] Insight save failures are logged but do not break the chat response.

---

## Ticket Table (Milestone B — reference only for later)

| # | Ticket | Owner | State |
|---|--------|-------|-------|
| 6 | Add optional feedback capture structure for prior action outcome | Nova | Done |
| 8 | Add reflection metadata rendering | Nova | Done |
| 9 | Add regulation cue rendering | Nova | Done |
| 10 | Add action prompt rendering | Nova | Done |

## Ticket Table (Milestone C — reference only for later)

| # | Ticket | Owner | State |
|---|--------|-------|-------|
| 7 | Add logging for reflection success, insight save, continuity load | Nova | Done |
| 11 | Validate fallback handling paths | Lumen | Done |
| 12 | Validate continuity success checks | Lumen | Done |
| 13 | Validate multi-user isolation and memory boundaries | Lumen | Not Started |

---

## How to Update This File

After completing a **Next Action** or finishing a ticket:

1. Change **State** for that ticket to **In Progress** or **Done**.
2. If Done, set **Current Focus** to the next ticket (e.g. Ticket 2) and fill in its Next Action.
3. If blocked, set **Blocker** and **Next Action** to the unblock step.
4. Optionally add a short **Last completed** line with date and what was done.

**Last completed:** Ticket 5 — Continuity added: `/api/chat/continuity` returns latest active Insight for current user; `/chat` fetches it on load and renders a "Last insight" continuity strip using `continuityText` above the chat input. Milestone A (Loop Foundation) is now complete.

**QA closeout (Milestone A):** Clean-state debug retesting confirms weak vague-state turns are saved with `debug_is_continuity_eligible = false` (no new continuity), strong turns are saved with `debug_is_continuity_eligible = true`, and the remaining “prove myself / worth still needing to be earned” false negative was fixed. Note: `continuity_present = true` after a weak turn can be correct if the user already has an older strong eligible insight; the correct check is whether the new weak turn was marked non-eligible.

**QA closeout (Ticket 6):** Lumen retest pass. No-feedback turn → feedback_saved=false; normal feedback turn → feedback_saved=true; empty/whitespace feedback API case → feedback_saved=false. DB: one Feedback row with note payload; no empty-note row. Empty-feedback backend guard verified.

**Last completed:** Ticket 8 — Reflection metadata rendering. /chat now captures `reflection_state` from the turn response and renders it in a collapsible "What was noticed" strip when extraction is meaningful. Render guard hides strip for weak/fallback extraction.

**QA closeout (Ticket 8):** Lumen retest pass. Metadata strip appears for strong extraction; hidden for weak/fallback. Render guard suppresses robotic panel when most fields are unknown/uncertain or insight is generic fallback. No regression.

**Last completed:** Ticket 9 — Regulation cue rendering. /chat now shows a compact "Regulation cue" strip ("Try: Pause and notice first", "Name the emotion", etc.) when extraction is meaningful and regulation_label maps to a cue. Same guard as metadata.

**Last completed:** Ticket 10 — Action prompt rendering. /chat now shows a small "Next step" strip ("You might try: Wait a little before you respond.", etc.) under the regulation cue when the overall reflection is meaningful and choice_label encodes a concrete alternative. Weak/fallback extraction or vague/default choices do not surface this strip.

**Last completed:** Ticket 7 — Logging for reflection success, insight save, continuity load. `/api/chat/turn` now emits lightweight `[ticket7][chat/turn] message_save`, `[ticket7][chat/turn] extraction`, `[ticket7][chat/turn] insight_continuity`, and `[ticket7][chat/turn] generation_error` logs per turn, plus `[ticket7][chat/continuity] load` in `/api/chat/continuity`. Together they capture whether messages were persisted, whether extraction succeeded, whether an Insight row was created and continuity-eligible, whether generation failed, and whether continuity load found an eligible insight. Logging is non-blocking and includes only IDs/booleans already present in persisted state.

**Last completed:** Ticket 11 — Validate fallback handling paths. Weak and vague reflections (e.g. "I feel off", "something feels weird", "...") now degrade cleanly in `/chat`: they do not create new continuity, do not surface a Next step strip, and—with the latest guard tighten—do not surface an unintended regulation cue, while strong patterned reflections continue to behave as intended. Full subsystem-failure fault injection (extraction/generation/insight-save/continuity-query failures) is deferred to a separate resilience validation task.
