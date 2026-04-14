# History / Session Surfacing Diagnosis

## Date
2026-04-14

## Context
This note is based on hosted QA against the provided token-auth Wisewave account on:
- `https://www.wisewave.io/chat?...`

The user reported that there now appear to be only **two recent chats** visible.

However, API checks do **not** support a hard-history-loss interpretation.

---

## Bottom-line diagnosis
Current evidence suggests:
- **backend session history still exists**
- but **frontend/session surfacing is inconsistent**

So this currently looks more like:
- a **history/session visibility bug**
- or session-selection / rendering drift

not:
- an intentional product rule
- and not confirmed data deletion

---

## Direct evidence

### 1. Backend session list still returns older sessions
Using the provided token account, `GET /api/chat/sessions` returned multiple sessions, not just two recent ones.

Observed examples included:
- `cmnvsiq390000jm04k34q0e1v` — `Bridge phase A probe.`
- `cmnvqcv600001jm04k30ffr0r` — `Lumen bridge preflight - one line.`
- `cmnr7lx0h0001jv043bqmjczp` — older delayed-reply topic
- additional older entries as well

This means the account still has older session rows visible to the backend.

### 2. Messages are still retrievable for older sessions
I also hit `GET /api/chat/messages?session_id=...` on one of the returned older session IDs and got message history back successfully.

That is strong evidence against hard deletion.

### 3. New session creation still works normally
`POST /api/chat/session` returned a fresh `session_id` normally during QA.

So the issue does not currently look like total session corruption.

---

## What this means
If:
- `GET /api/chat/sessions` returns older sessions
- and `GET /api/chat/messages?session_id=...` can still load them

then the problem is more likely in one of these layers:

### A. UI rendering / surfacing bug
The frontend may not be rendering all available sessions.

Possible examples:
- only a partial subset shown
- stale client state
- session list loaded but not surfaced in UI
- sidebar/history component filtering more aggressively than intended

### B. Session auto-binding / selection behavior
The `/chat` token path may be auto-binding to a current session in a way that hides the broader history experience.

The current client bundle still contains logic that:
- reads from `sessionStorage`
- tries `GET /api/chat/sessions`
- picks a non-`New conversation` session if present
- otherwise creates a fresh session

That selection path may be interacting badly with what the UI actually exposes.

### C. Frontend history model mismatch
There may be a mismatch between:
- what the backend returns as sessions
- and what the current `/chat` UI is designed to display

In other words, the backend may still have multiple sessions, while the current surface is not presenting them as expected.

---

## Why this does NOT currently look like a function
I found no evidence today that the product is intentionally designed to:
- keep only two chats
- hide older chats by policy
- delete older sessions for this account

In fact, the backend behavior points the other way.

So unless Nova knows about a deliberate product rule that was introduced separately, the user-visible behavior should be treated as a **bug / inconsistency**, not a feature.

---

## Likely first place for Nova to inspect
The strongest first inspection target is the current `/chat` frontend initialization and session-surfacing path.

Based on the shipped client bundle, the page currently does roughly this:
1. read token from query
2. auth check
3. look for stored session in `sessionStorage`
4. if none, call `GET /api/chat/sessions`
5. pick the first non-`New conversation` session if found
6. otherwise call `POST /api/chat/session`
7. load messages for the chosen session

That means Nova should inspect:
- whether the sessions list is actually fetched in the live UI state
- whether the full result is stored but not rendered
- whether only one active conversation is being surfaced despite multiple sessions existing
- whether the current product intentionally removed the visible history surface but left the backend intact
- whether token-auth path differs from other paths in what it renders

---

## Suggested Nova debug questions

### 1. Is `GET /api/chat/sessions` returning the same full list in-browser?
Confirm in live browser/network tools that the frontend receives the same older sessions seen in API QA.

### 2. If yes, where are they being dropped?
Check:
- state assignment
- filtering
- rendering conditions
- mobile/desktop conditional UI
- hidden history/sidebar behavior

### 3. If no, why does the browser path differ from direct API QA?
Check:
- auth header usage
- token path vs cookie path
- client fetch timing
- stale sessionStorage key behavior

### 4. Is the product currently designed to show only current-thread context?
If so, this is a deliberate UX change — but then it conflicts with the observed user expectation and should be clarified explicitly.

Right now that does **not** look like the intended explanation.

---

## QA conclusion
**Current classification:**
- **probable bug / surfacing inconsistency**
- **not confirmed data loss**
- **not currently evidenced as intended function**

## Recommended next step
Nova should run a focused debug pass on:
- `/chat` session initialization
- session list fetch + rendering path
- token-auth history visibility behavior

The goal is to answer one precise question:

> If the sessions still exist and messages still load, why are older chats not being visibly surfaced to the user?

---

## Nova resolution (2026-04-11)

**Root cause (repo):** `/chat` (`app/chat/page.tsx`) called `GET /api/chat/sessions` only during **bootstrap** to pick a single `session_id` when `sessionStorage` was empty. It did **not** render the returned list anywhere, so users with many backend sessions only saw the **active** thread — consistent with Lumen’s “frontend/session-surfacing” diagnosis, not data loss.

**Shipped fix:** A **Chats** control in the header opens a **Sessions** drawer that lists all rows from `GET /api/chat/sessions` (topic preview), highlights the active session, supports **switching** (loads `GET /api/chat/messages` for the chosen id + updates `sessionStorage`), **New conversation** (`POST /api/chat/session`), and **refreshes** the list after load and after each successful send. Continue (`…`) and Chats drawers are mutually exclusive when toggled.

**Lumen retest:** On hosted token `/chat`, open **Chats** — expect multiple rows matching API QA; tap an older id — messages for that conversation should load; new chat creates a fresh session and appears in the list after send.
