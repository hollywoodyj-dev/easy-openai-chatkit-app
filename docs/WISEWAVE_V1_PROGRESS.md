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

**Current milestone:** B — Guided Reflection Layer  
**Current ticket:** 6 — Add optional feedback capture structure for prior action outcome  
**State:** Not Started  
**Blocker:** none  

### Next Action (do this when user says "process project with next step")

Start **Ticket 6** (feedback capture) with the smallest v1-friendly shape: add an optional `feedback` object to the chat turn payload/response and persist it in a new model/table (or reuse an existing safe place) without changing the main reflection prompts.

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
| 6 | Add optional feedback capture structure for prior action outcome | Nova | Not Started |
| 8 | Add reflection metadata rendering | Nova | Not Started |
| 9 | Add regulation cue rendering | Nova | Not Started |
| 10 | Add action prompt rendering | Nova | Not Started |

## Ticket Table (Milestone C — reference only for later)

| # | Ticket | Owner | State |
|---|--------|-------|-------|
| 7 | Add logging for reflection success, insight save, continuity load | Nova | Not Started |
| 11 | Validate fallback handling paths | Lumen | Not Started |
| 12 | Validate continuity success checks | Lumen | Not Started |
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
