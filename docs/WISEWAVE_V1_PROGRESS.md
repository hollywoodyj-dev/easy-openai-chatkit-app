# Wisewave V1 Core Loop — Progress & Next Step

**When you are asked to "process project with next step":** read this file, then execute the **Next Action** for the current ticket (or advance to the next ticket if current is Done). Update this file after each meaningful step.

---

## Milestone Status

| Milestone | Goal | Status |
|-----------|------|--------|
| **A — Loop Foundation** | Minimum working reflection loop: submit reflection → AI reflection → insight saved → continuity on return | In Progress |
| **B — Guided Reflection Layer** | Regulation cue, action prompt, feedback capture, metadata rendering | Not Started |
| **C — Measurement + Reliability** | Logging, fallback validation, continuity checks, multi-user isolation | Not Started |

---

## Ticket Table (Milestone A)

| # | Ticket | Owner | State | Blocker | Next Action |
|---|--------|-------|-------|---------|-------------|
| 1 | Create session and message persistence for /chat | Nova | Done | none | — |
| 2 | Build extraction pipeline returning structured reflection JSON | Nova | Done | none | — |
| 3 | Build response generation pipeline for concise reflection output | Nova | Not Started | Ticket 1 (can start in parallel with mocked extraction) | Implement response prompt using extracted state; mirror + insight + regulation cue + next step; persist assistant output. |
| 4 | Create insights persistence model and save logic | Nova | Not Started | Ticket 2 | Add insights table/model; save one durable insight per successful reflection; user-scoped; log save failures. |
| 5 | Load latest active insight and render continuity strip on /chat | Nova | Not Started | Ticket 4 | Fetch latest active insight on chat load; render continuity strip when present; hide cleanly when none. |

---

## Current Focus

**Current milestone:** A — Loop Foundation  
**Current ticket:** **Ticket 3 — Build response generation pipeline for concise reflection output**  
**State:** Not Started  
**Blocker:** none  

### Next Action (do this when user says "process project with next step")

1. Use the **extracted reflection state** (from Ticket 2: `reflection_state` / ReflectionRun) as input to the **response prompt**.
2. Generate user-facing reflection text that includes: **mirror**, **insight**, **regulation cue**, **next step** (2–4 parts, ~2–5 sentences, under ~120 words).
3. Keep tone: calm, grounded, non-therapeutic, non-preachy; avoid generic self-help and therapist language.
4. Persist assistant output as today (already done in turn route); optionally prefer or blend this reflection path when extraction succeeded (e.g. use reflection generator instead of generic chat completion when we have reflection_state).

### Definition of Done — Ticket 3

- [ ] Response generation uses extracted state when available
- [ ] Output follows V1 structure (mirror, insight, regulation cue, next step) and length/tone constraints
- [ ] Generation failure path returns graceful fallback; assistant message is still persisted

### Review (Lumen)

- Output is concise and readable; does not sound preachy, spiritual, or therapeutic
- Output is not generic summary-only

### Definition of Done — Ticket 2 (completed)

- [x] Extraction prompt returns valid JSON with required fields (null-safe defaults in lib/wisewave-extract.ts)
- [x] Malformed model output caught and handled; failed extraction logged; extraction non-blocking
- [x] Extracted result saved to ReflectionRun and returned as reflection_state in turn response

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

**Last completed:** Ticket 2 — Extraction pipeline added: `ReflectionRun` model, `lib/wisewave-extract.ts` (prompt + JSON parse + fallback), integrated into `/api/chat/turn` after user message save; reflection_state returned in response; extraction failure non-blocking.
