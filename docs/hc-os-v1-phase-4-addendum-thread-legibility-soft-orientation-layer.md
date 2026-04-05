# HC-OS V1 — Phase 4 Addendum
## Working Title: Thread Legibility × Soft Orientation Layer

**Status:** Proposed addendum  
**Audience:** Tree, Wisewave, OctopusMind, Nova, Lumen

---

## 0. Purpose

This addendum defines the correct next step after Phase 3.

If Phase 3 allowed the user to lightly touch a thread-space without opening history, then Phase 4 should allow the user to lightly recognize where they are without turning the system into a conversation manager.

Phase 3 already locked:
- soft re-entry
- last insight as the only visible continuity anchor
- strict anti-history / anti-memory / anti-management rules

Phase 4 is not feature expansion.

**Phase 4 is:**
- soft orientation without operational control

The user may feel:
- “I know what space I’m in”
- “I can stay with this space”
- “I can leave it by naturally moving elsewhere”

The user must not feel:
- “I am managing conversations”
- “I am browsing records”
- “the system is organizing my mind for me”

---

## 1. Strategic definition

Phase 4 should be treated as:

**an orientation milestone, not a management milestone**

Phase 3 let thread exist as a lightly touchable structure.  
Phase 4 lets thread become slightly more legible.

Not as object.  
Not as file.  
Not as archive.  
Only as current space identity.

That means Phase 4 may introduce a faint sense of:
- current space
- current thread tone
- current thread continuity

But may not introduce:
- history browsing
- visible thread metadata
- thread operations
- archive behavior
- “saved conversation” feeling

---

## 2. Primary proof target

Phase 4 passes only if the product can demonstrate:

**the user can feel which space they are in, without feeling they are operating a thread system**

The proof is not:
- more visible thread UI
- more explicit continuity copy
- more recoverable thread structure
- more user control over thread objects

The proof is:
- less ambiguity after re-entry
- more coherent space identity
- preserved low presence
- no shift into tool feeling

---

## 3. Product rule

The correct Phase 4 product rule is:

**make space slightly knowable, not manageable**

Good Phase 4 behavior:
- gives quiet orientation
- preserves continuity lightness
- helps user remain in a thread-space without explanation
- keeps thread identity faint and non-operational

Bad Phase 4 behavior:
- names thread like an object
- makes the user choose between thread entities too explicitly
- adds archive, index, or management feeling
- explains continuity mechanism
- makes structure more visible than experience

---

## 4. What Phase 4 is

Phase 4 is allowed to include only these minimal capabilities:

### 4.1 Soft space identity
A recent thread may carry a faint identifying feel beyond just being tappable.

This identity may be expressed through:
- one short thread label or title fragment
- one subtle thematic anchor
- one calm orientation cue

But it must not read like a record name or folder title.

### 4.2 Current-space legibility
When re-entered, a thread may feel slightly more distinguishable from other threads.

This may happen through:
- slightly clearer last insight anchoring
- quiet thread label behavior
- stable low-weight tone alignment

### 4.3 Natural thread drift
The system may allow one thread-space to remain active until the user has clearly moved elsewhere.

This extends the Phase 3 reset logic, where a strong topic break creates a fresh thread.

### 4.4 Fresh-space clarity
A new space should feel not only fresh, but clearly fresh.

The user should not wonder:
- “Am I still in the old one?”
- “Did this continue something?”

If the shift is real, continuity cues must disappear fully.

---

## 5. What Phase 4 is not

Phase 4 must not become:
- chat history
- conversation archive
- thread list product
- message recovery
- conversation naming system
- thread sorting / pinning / deleting
- search
- saved notes product
- memory assistant behavior
- journaling workspace

Phase 3 already excluded these and Phase 4 must keep them excluded.

---

## 6. Core UX principle

The Phase 4 experience should feel like this:

**I can quietly tell where I am, but I am still not using a tool**

That means:
- more orientation than Phase 3
- no more operationality than Phase 3

If a design improves legibility but increases system structure-feeling, reject it.

---

## 7. Allowed visible surface

Phase 4 may add only one new visible class of signal:

**a low-weight current-space marker**

Examples of allowed forms:
- a very short thread-space label
- a quiet 2–4 word phrase
- a present-oriented thematic fragment
- a non-archival “space name”

Examples of disallowed forms:
- full conversation titles
- date-based thread names
- user-authored transcript excerpts
- “conversation 1 / 2 / 3”
- anything that looks stored or retrievable

### Allowed style
- calm
- light
- current
- non-technical
- non-archival

### Forbidden style
- explicit memory framing
- metadata framing
- history framing
- transcript framing
- management framing

---

## 8. Current-space marker contract

If Phase 4 uses a current-space marker, it must obey all of the following:
- At most one visible marker
- Short enough to read instantly
- Never presented as a title of record
- Never shown with date, count, or status metadata
- Must disappear or change cleanly on true reset
- Must not create hierarchy over the main reflection
- Must not feel like a clickable file name unless the thread itself is being lightly touched

### Example good forms
- “staying with pressure”
- “something still tender”
- “quiet inner pull”
- “finding room here”

### Example bad forms
- “Conversation about self-worth pressure”
- “Previous thread”
- “Saved reflection 03”
- “From earlier discussion”

---

## 9. Runtime state extension

Phase 3 defined active / inactive / re-entered thread state and same_thread / new_thread continuity state. Phase 4 may extend that model minimally:

```ts
type ThreadLegibility =
 | "hidden"
 | "low";

interface Phase4RuntimeState extends Phase3RuntimeState {
 thread_legibility: ThreadLegibility;
 current_space_marker?: string | null;
}
```

### Required invariants
- `thread_legibility` may be `low`, never `medium` or `high`
- `current_space_marker` is optional
- marker must never trigger history load
- marker must never expose metadata
- marker must clear on `new_thread`
- only one active current-space marker may exist

---

## 10. Interaction model

### A. Re-entry with light orientation
When user taps a recent thread:
- same Phase 3 re-entry behavior holds
- last insight may appear if eligible
- optional current-space marker may appear
- no message replay
- no timeline
- no route change
- no explicit “opening thread” behavior

### B. Stay-in-space feel
When user keeps speaking within the same space:
- orientation may remain faintly stable
- marker may persist only if it remains quiet
- it must not become more prominent over time

### C. Fresh break
When topic shift is strong enough:
- new thread is created
- last insight disappears
- current-space marker disappears
- no ghost continuity remains

---

## 11. Language guardrails

Phase 4 must preserve the anti-memory rule from Phase 3: continuity may be felt, not narrated.

### Forbidden patterns
- “previous conversation”
- “this thread is about”
- “from your history”
- “continuing the prior thread”
- “as discussed earlier”
- “saved space”
- “archived reflection”

### Allowed feel
- present-oriented
- gently thematic
- atmosphere-first
- low-claim
- non-possessive

**Principle:**  
orientation may be visible; system memory may not

---

## 12. Anti-drift rules

These are hard gates.

### Anti-history
- never show prior messages
- never reconstruct transcript
- never reveal timeline
- never imply recoverable past content

### Anti-tool
- never add controls that make thread feel operable
- never introduce sorting, filtering, pinning, renaming, deleting
- never make thread list feel like workspace navigation

### Anti-memory
- never present marker as remembered record
- never imply longitudinal identity tracking
- never turn space marker into personal profile behavior

### Anti-weight
- marker must remain secondary to main reflection
- if marker adds visual weight, suppress marker first

### Anti-contamination
- no wrong-thread marker
- no marker carry-over after reset
- no mismatch between thread and last insight

---

## 13. Agent ownership

### Tree — execution owner
Tree owns:
- scope control
- anti-expansion enforcement
- sequencing
- board truth
- closure discipline

Tree must ensure Phase 4 stays a single narrow objective, consistent with the execution rule of defining one concrete next action and avoiding unnecessary expansion.

### Wisewave — space-language owner
Wisewave owns:
- current-space marker tone
- label quality
- orientation wording
- EN/ZH parity at function level
- non-archival feel

### OctopusMind — boundary owner
OctopusMind owns:
- admissibility of marker appearance
- suppression rules
- reset conflict rules
- visibility cap
- anti-management protection

### Nova — minimal implementation owner
Nova owns:
- marker rendering path
- state extension
- suppression-first behavior
- reset clearing
- contamination protection
- no-expansion implementation discipline

### Lumen — QA and drift owner
Lumen owns:
- archive-feel testing
- tool-feel testing
- memory-feel testing
- wrong-thread contamination testing
- founder acceptance evidence

---

## 14. Strict execution streams

Phase 4 should run in four streams only.

### Stream 1 — Wisewave: current-space language lock
Deliver:
- marker style guide
- good / bad examples
- tone rule
- EN/ZH parity rule

### Stream 2 — OctopusMind: visibility and suppression boundary
Deliver:
- when marker may appear
- when it must be suppressed
- reset / same-thread conflict rules
- anti-management boundary

### Stream 3 — Nova: minimal state + rendering path
Deliver:
- runtime state extension
- marker rendering
- reset clearing
- no-history assertions
- contamination guard

### Stream 4 — Lumen: orientation QA
Deliver:
- test plan
- drift checklist
- pass / revise / remove recommendations
- founder demo evidence

---

## 15. Nova implementation tickets

### Ticket 1 — Add Phase 4 legibility state
Add:
- `thread_legibility`
- `current_space_marker`

Acceptance:
- defaults safe
- no history or metadata behavior introduced

### Ticket 2 — Add current-space marker render path
Acceptance:
- zero or one marker only
- always secondary
- no archival styling

### Ticket 3 — Clear marker on reset
Acceptance:
- strong topic shift removes marker cleanly
- no continuity ghosting

### Ticket 4 — Add marker suppression logic
Acceptance:
- if marker increases weight or management feel, suppress
- if same-space feel is already clear enough, suppress

### Ticket 5 — Add contamination protections
Acceptance:
- wrong-thread marker never appears
- switching threads clears prior marker safely

### Ticket 6 — Add QA instrumentation
Log:
- marker shown
- marker suppressed
- marker cleared on reset
- wrong-thread block event

---

## 16. Lumen QA plan

### Core tests

**Test 1 — Re-entry feels oriented, not operational**  
Pass if:
- user feels they know where they are
- no system navigation feeling appears

**Test 2 — Marker does not feel archival**  
Pass if:
- marker does not read as stored conversation title
- no history expectation created

**Test 3 — Marker stays secondary**  
Pass if:
- main reflection remains dominant
- marker adds clarity without visual weight

**Test 4 — Reset clears orientation**  
Pass if:
- fresh topic removes old marker
- new space feels clearly fresh

**Test 5 — No memory interpretation**  
Pass if:
- user does not feel tracked
- assistant does not narrate continuity

**Test 6 — No management drift**  
Pass if:
- user does not expect rename / pin / organize / search controls

---

## 17. Close gate

Phase 4 may close only if all hold:
- user can lightly recognize current space
- thread still does not feel like a conversation object
- no archive behavior emerges
- no management behavior emerges
- no memory feeling emerges
- marker remains lighter than the reflection

### Final gate question
**Can the system make thread-space slightly more legible without making thread structure feel more real than the experience itself?**

If no, Phase 4 is not complete.

---

## 18. One-line governing rule

**Phase 4 succeeds only if space becomes easier to feel, and still not easier to operate.**

---

## 19. Tree kickoff note

You can send this directly:

> Phase 4 is now open in PROPOSAL / BOUNDING MODE.
>
> Working title:  
> HC-OS V1 — Thread Legibility × Soft Orientation Layer
>
> Purpose:  
> Allow the user to lightly recognize the current space without turning thread into a managed object, history surface, or memory feature.
>
> Primary rule:  
> Make space slightly knowable, not manageable.
>
> In scope:
> - low-weight current-space marker
> - clearer same-space orientation
> - stricter fresh-space clarity on reset
> - no-history, no-management, no-memory preservation
>
> Out of scope:
> - archive
> - search
> - rename / pin / delete / organize
> - transcript recovery
> - visible memory behavior
> - thread metadata system
>
> Streams:
> 1. Wisewave — current-space language lock
> 2. OctopusMind — visibility and suppression boundary
> 3. Nova — minimal state + render path
> 4. Lumen — orientation QA and drift detection
>
> Rule:  
> If a design increases tool feeling, archive feeling, or memory feeling, suppress or remove it.

**My cleanest read:** Phase 4 should not be “more thread.” It should be “slightly more orientation.”
