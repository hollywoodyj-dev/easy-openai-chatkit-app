# Post-H QA Plan — 14 Days
**HC-OS V1 — Milestone H Closed / Daily Observation Plan**

## Core Answer
The QA should be **the same in structure, but different in samples**.

Do **not** run the exact same full set every day. That would make comparison easier, but it would also create blind spots and encourage overfitting.

Do **not** run a totally different process every day either. That would widen coverage, but it would weaken comparability.

The right model is:
- **same framework every day**
- **different real conversation samples every day**
- **one rotating focus per day**
- **a small repeated sentinel set every 2–3 days**

## Operating Principle
Use a stable QA spine with rotating coverage.

This gives four things at once:
- comparability across days
- broader real-world coverage
- better drift detection
- less risk of false confidence

---

# 1. Daily QA Structure
Every day should include the same three layers.

## Layer A — Core Sample Set
Review **10–20 real conversations**.

Each day’s sample should mix:
- reflective
- factual
- low-signal
- high-signal
- EN and ZH where possible

Purpose:
- measure real-world invisibility
- compute dashboard metrics
- observe whether H remains rare and restrained

## Layer B — Daily Focus Slice
Each day, add **one focused lens**.

Examples:
- low-signal suppression
- factual non-triggering
- reflective boundary cases
- EN/ZH parity
- duplication vs reflection/E
- removability stress test

Purpose:
- detect subtle drift earlier
- avoid shallow routine checking

## Layer C — Sentinel Checks
Use a repeated set of **3–5 fixed reference cases** at regular intervals.

Recommended rhythm:
- Day 1
- Day 4
- Day 7
- Day 10
- Day 14

Purpose:
- compare against baseline
- detect silent threshold drift
- detect wording drift
- catch changes that metrics alone might miss

---

# 2. Same vs Different

## What stays the same every day
- the dashboard metrics
- the evaluation questions
- the drift triggers
- the rollback logic
- the overall sample structure
- the sentinel pack schedule

## What changes every day
- the real sampled conversations
- the daily emphasis
- the context mix within the real sample set
- the specific edge cases under attention

## Best Ratio
A practical rule:
- **80% different** samples
- **20% repeated** sentinel cases

That gives enough freshness for coverage and enough repetition for comparison.

---

# 3. Daily Sample Shape
A practical default for **12 cases per day**:
- 3 reflective
- 3 factual
- 2 low-signal
- 2 high-signal
- 2 mixed or ambiguous

If reviewing **16 cases per day**:
- 4 reflective
- 4 factual
- 3 low-signal
- 3 high-signal
- 2 mixed or ambiguous

Important:
- do not sample only interesting cases
- include boring cases
- include weak cases
- include edge cases
- spread EN and ZH across the week

Boring cases matter because invisibility is often proven there.

---

# 4. Sentinel Pack Guidance
The repeated sentinel set should include:
- one low-signal weak case
- one factual case
- one borderline reflective case
- one strong reflective case
- one EN or ZH parity-sensitive case

The goal is not broad coverage.
The goal is stable comparison over time.

---

# 5. 14-Day Schedule

## Day 1 — Baseline Visibility Map
**Focus:** establish the starting condition

Sample emphasis:
- balanced mix across all types

Questions:
- What does normal invisible H look like on Day 1?
- What is the initial suppression ratio?
- What is the initial removability pattern?

Actions:
- compute full baseline metrics
- run sentinel set
- record first drift impression

---

## Day 2 — Low-Signal Suppression
**Focus:** H should mostly stay absent

Sample emphasis:
- short inputs
- vague inputs
- weak emotional content
- low-structure prompts

Questions:
- Is H staying quiet where it should?
- Is weak input accidentally triggering H?

---

## Day 3 — Factual Non-Triggering
**Focus:** keep H out of practical and informational turns

Sample emphasis:
- factual requests
- task-oriented turns
- direct questions
- lightweight utility interactions

Questions:
- Is H leaking into non-reflective territory?
- Is H surviving where simple response should be enough?

---

## Day 4 — Reflective Admissibility Edges
**Focus:** borderline reflective cases

Sample emphasis:
- reflective but not deep
- emotional but ordinary
- introspective but ambiguous

Questions:
- Is H still narrow?
- Is trigger discipline softening?

Actions:
- rerun sentinel set

---

## Day 5 — High-Signal Restraint
**Focus:** strong reflective inputs where H is most tempting

Sample emphasis:
- repeated inner conflict
- emotionally loaded pattern language
- strong self-interpretive prompts

Questions:
- Even here, is H still restrained?
- If H appears, is it removable?
- Does it feel inserted or natural?

---

## Day 6 — Duplication Audit
**Focus:** check overlap with reflection or E

Sample emphasis:
- cases where reflection or E already carries enough weight

Questions:
- Is H adding something distinct?
- Or is H repeating what other layers already do?

---

## Day 7 — Weekly Checkpoint 1
**Focus:** review first-week pattern

Questions:
1. Is H still rare?
2. Is H still hard to notice?
3. Is suppression still dominant?
4. Has the improvement instinct started creeping in?
5. Does the system feel same or lighter than Day 1?

Decision:
- keep
- tighten
- rollback

Actions:
- rerun sentinel set
- compare against Day 1 baseline

---

## Day 8 — EN/ZH Parity Check
**Focus:** language consistency

Sample emphasis:
- matched EN and ZH style cases where possible

Questions:
- Is H becoming heavier in one language?
- Is it easier to notice in one language first?
- Is tone restraint preserved across both?

---

## Day 9 — Noticeability Audit
**Focus:** detect pointability, not just frequency

Sample emphasis:
- mixed set
- fast first-pass review, then deeper check

Questions:
- Is H becoming easier to spot?
- Are reviewers noticing it faster even when metrics look stable?

---

## Day 10 — Removability Stress Test
**Focus:** compare with and without H

Sample emphasis:
- H-positive cases

Questions:
- If H is removed, does the response get cleaner?
- Is H surviving because it sounds good rather than because it is necessary?

Actions:
- rerun sentinel set

---

## Day 11 — Silent Drift Check
**Focus:** system feel

Sample emphasis:
- broad mixed set
- reviewed as a whole, not only case-by-case

Questions:
- Does the system feel heavier?
- Does it feel more interpretive?
- Does H feel more present even if metrics still look acceptable?

This day matters because not all drift shows up in counts.

---

## Day 12 — Context Spread Audit
**Focus:** expansion across contexts

Sample emphasis:
- weak
- factual
- mixed
- reflective
- short
- long

Questions:
- Is H appearing in more context types than before?
- Is it surviving in places it would previously have been suppressed?

---

## Day 13 — Threshold Discipline Review
**Focus:** trigger softness

Sample emphasis:
- borderline cases across categories

Questions:
- Is H appearing under weaker necessity conditions?
- Has admissibility widened without being explicitly acknowledged?

---

## Day 14 — Final Checkpoint / Closure Review
**Focus:** final two-week judgment

Questions:
1. Is H still rare?
2. Is H still hard to notice?
3. Is suppression still dominant?
4. Is H still easier to remove than defend?
5. Does the system feel the same or lighter than Day 1?

Decision:
- keep closed
- tighten suppression
- rollback to baseline

Actions:
- rerun sentinel set
- compare with Day 1 and Day 7
- record final containment judgment

---

# 6. Recommended Daily Review Questions
Use these every day regardless of the day’s special focus:
- Did H appear?
- If yes, was it intrusive?
- If yes, was it removable?
- If yes, did it duplicate reflection or E?
- If no, should it have appeared?
- Did H feel more visible than necessary?
- If removed, would the response be better?

---

# 7. Practical Rule for the Team
## Lumen
Lumen should keep asking:

**If I remove H, is this better?**

If yes, H should not exist there.

## Tree
Tree should keep asking:

**Is H becoming easier to notice, easier to keep, or harder to roll back?**

If yes, drift is already underway.

---

# 8. One-Line Operating Truth
**Run the same QA framework every day, but use different real samples with one rotating focus and a small repeated sentinel set for drift comparison.**
