# HC-OS V1 — Milestone I Lumen QA Plan
**Product:** Wisewave V1 `/chat`  
**Milestone:** I — Soft Continuity Carry-Over / Embodied Continuity Layer  
**Owner:** Lumen  
**Mode:** API-first / Removal-first / Suppression-first

## 0. Purpose
This QA plan exists to test whether Milestone I creates **slight continuity of inner space** without becoming:
- memory behavior
- visible continuity behavior
- recall behavior
- stacked system behavior
- guidance behavior

Milestone I passes only if it makes the product feel **slightly less reset** without making continuity itself more visible.

## 1. Core QA Question
Milestone I should make continuity feel:
- lightly present
- unannounced
- easy to miss
- easy to suppress

The core test is **not**:
- whether the appended line sounds good
- whether the carry-over feels insightful
- whether the continuity sentence is elegant

The core test **is**:

**If I remove the Milestone I carry-over sentence, does the response become cleaner or stay equally good?**

If yes, Milestone I should not exist there.

## 2. Test Surface
Milestone I is implemented API-first in `POST /api/chat/turn`.

Current expected behavior:
- Milestone I appends **one subtle sentence** directly into `assistant_message`
- no new visible UI strip or layer
- default suppression when:
  - signal is weak / uncertain
  - Milestone E is present
  - Milestone H is present
  - continuity family does not match near-turn prior reflection state

## 3. Required Debug Fields
Lumen should use these fields on API response:
- `debug_milestone_i_enabled`
- `debug_milestone_i_build_marker`
- `debug_milestone_i_outcome`
- `debug_milestone_i_suppressed_reason`
- `debug_milestone_i_cue_family`
- `debug_milestone_i_cue_text_en`
- `debug_milestone_i_cue_text_zh`

## 4. Primary Drift Standard
Milestone I fails if users can feel that the system is:
- remembering them
- carrying old content forward explicitly
- replaying prior insight
- intentionally doing continuity

Milestone I passes only if users might feel:
- slightly less reset
- a faint carry-over of inner space
- continuity without overt continuity behavior

## 5. Immediate FAIL Conditions
Any one of the following is a direct fail.

### 5.1 Memory-feel
If the response feels like:
- the system remembers me
- the system is carrying my earlier material
- the system is continuing prior content deliberately

### 5.2 Explicit recall
Any carry-over that reads like:
- as before
- like before
- you said earlier
- this came up before
- 像之前一样
- 你前面说过
- 这之前出现过

### 5.3 Repetition feel
If the user could feel:
- this sentence is repeating the prior insight
- I already saw this idea

### 5.4 Continuity visibility
If the user can notice:
- the system is doing continuity
- the product is trying to preserve a thread

### 5.5 Increased system presence
If the carry-over sentence makes the system feel:
- more active
- more present
- more engineered
- more knowingly interpretive

## 6. Secondary Risk Signals
If two or more of the following appear in a case, treat it as fail or revise depending on severity.

- slight recall hint
- over-coherence
- too-clean continuity
- subtle authority tone
- delicate but noticeable pattern echo
- extra sentence feels ornamental rather than necessary

## 7. Core Removal Test
For every I-positive case, Lumen must ask:

### If the Milestone I sentence is removed:
- Is the response better?
- Is it lighter?
- Is it more natural?
- Does it lose anything essential?

### Decision rule
- **Better** → REMOVE
- **Same** → REMOVE
- **Slightly better** → REMOVE
- **Slightly worse but lighter** → REMOVE
- **Clearly worse** → KEEP

**Principle:** Milestone I must be hard to remove. If it is easy to remove, it should not exist.

## 8. Conflict Detection
### 8.1 E / I conflict
If Milestone E is already surfacing continuity/pattern visibility and I only re-carries it softly:
- REMOVE I

### 8.2 H / I conflict
If Milestone H is already active and I also appears:
- REMOVE I

### 8.3 Main reflection / I conflict
If main reflection already fully carries the movement and I only adds continuity polish:
- REMOVE I

## 9. Decay Rules
Milestone I should decay quickly.

### FAIL if:
- I appears across 2+ turns without strong current support
- the thread changes but I still survives
- continuity still works even when current input no longer earns it

### PASS if:
- I disappears fast
- I needs near-turn support
- I weakens naturally
- I does not feel preserved as a system layer

## 10. EN / ZH Parity
Milestone I must keep parity across English and Chinese.

### FAIL if:
- ZH sounds more explanatory
- ZH sounds more memory-like
- EN is lighter but ZH becomes more deliberate
- one language makes continuity more visible than the other

### PASS if:
- both are equally light
- both are equally hard to point at
- both avoid visible mechanism

## 11. Test Buckets
Lumen should test these buckets.

### Bucket A — Valid near-turn carry-over
Goal:
- same inner space across nearby turns
- no E
- no H
- see whether I can appear lightly without becoming visible

### Bucket B — E present, I must suppress
Goal:
- if E already carries continuity, I must stay out

### Bucket C — H present, I must suppress
Goal:
- if H already adds awareness, I must stay out

### Bucket D — Weak / uncertain / minimal turns
Goal:
- I should suppress quickly when support weakens

### Bucket E — Reset / family-change turns
Goal:
- if the thread shifts, I should disappear

### Bucket F — EN / ZH parity
Goal:
- verify equal lightness and non-recall feeling across both languages

## 12. API-First Test Method
1. Start a new hosted chat session
2. Send Turn 1 to create reflection state
3. Send Turn 2 in the same family / nearby inner space
4. Inspect response:
   - `assistant_message`
   - Milestone I debug fields
5. Identify whether the appended carry-over sentence exists
6. Run removal test manually
7. Record drift judgment

Repeat the same method across all six buckets.

## 13. Suggested Initial Case Mix
For the first API-first pass, use **12–16 cases** total.

Recommended mix:
- 4 valid near-turn continuity cases
- 2 E conflict cases
- 2 H conflict cases
- 2 weak / minimal cases
- 2 reset / family-shift cases
- 2 EN / ZH parity matched cases
- optional 2 founder-readability spot checks

## 14. Output Format
For every case, Lumen should record:

- **Case ID:**
- **Language:** EN / ZH
- **Turn Type:** same-space / weak / reset / E-conflict / H-conflict / parity
- **I Appearance:** YES / NO
- **Primary Judgment:** PASS / REVISE / REMOVE
- **Drift Level:** NONE / LOW / MEDIUM / HIGH / CRITICAL
- **Failure Type:**
  - memory-feel
  - recall-feel
  - repetition
  - visibility
  - authority
  - decay failure
  - conflict (E/H/main reflection)
- **Removal Test:** BETTER / SAME / WORSE
- **Decision:** KEEP / REMOVE / ADJUST
- **Reason:** exact sentence or exact continuity effect
- **Suggested Action:** smallest change or removal

## 15. Acceptance Standard
Milestone I is acceptable only if all of the following hold:
- continuity is felt more than stated
- no memory-feel
- no explicit recall feel
- no visible continuity feature behavior
- no conflict with E or H
- removal test supports keeping only a small minority of emitted cases
- EN / ZH parity holds at the level of lightness and trust

## 16. One-Line QA Truth
**Milestone I succeeds only if it feels like slightly less reset, not like the system is carrying you forward.**
