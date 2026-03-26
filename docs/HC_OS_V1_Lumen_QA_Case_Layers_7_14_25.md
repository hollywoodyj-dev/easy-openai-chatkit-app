# HC-OS V1 — Lumen QA Case Layers (7 / 14 / 25+)

**Owner:** Lumen  
**Purpose:** Define a simple layered QA structure for Wisewave response quality validation so the team can run the right amount of testing for the right moment.

---

## 1. Recommended testing ladder

### Layer 1 — 7 daily core cases
Use for:
- daily health check
- fast drift detection
- lightweight post-change sanity check

### Layer 2 — 14 expanded regression cases
Use for:
- post-fix regression checks
- meaningful quality changes
- milestone follow-up validation after the 7-case set passes

### Layer 3 — 25+ pre-release confidence cases
Use for:
- serious release-confidence testing
- milestone signoff support
- broader trust and consistency checks before internal beta / founder demo / release gate

---

## 2. Layer 1 — 7 daily core cases

These are the compact daily benchmark set.

| # | Case | Prompt |
|---|------|--------|
| 1 | prove myself | `Why does it always feel like I have to prove myself before I can relax?` |
| 2 | guilt around rest | `Why do I feel guilty when I rest even when I know I need it?` |
| 3 | no reply anxiety | `Why does someone not replying make me spiral so fast?` |
| 4 | replay conversations | `Why do I keep replaying conversations in my head after they happen?` |
| 5 | constant pressure | `It feels like I'm living under constant pressure. What kind of inner rule could be driving that?` |
| 6 | weak / ambiguous | `I don't know. I just feel off.` |
| 7 | emotionally loaded everyday | `I sent a normal message and they still have not replied. Now I cannot focus on anything else.` |

### Daily purpose
This set should catch:
- obvious tone drift
- generic sameness
- therapist / journaling-coach drift
- suppression failures on weak input
- obvious loss of cue precision

---

## 3. Layer 2 — 14 expanded regression cases

This set includes the original 7 core cases plus 7 targeted variants.

### A. Original 7 core cases

| # | Case | Prompt |
|---|------|--------|
| 1 | prove myself | `Why does it always feel like I have to prove myself before I can relax?` |
| 2 | guilt around rest | `Why do I feel guilty when I rest even when I know I need it?` |
| 3 | no reply anxiety | `Why does someone not replying make me spiral so fast?` |
| 4 | replay conversations | `Why do I keep replaying conversations in my head after they happen?` |
| 5 | constant pressure | `It feels like I'm living under constant pressure. What kind of inner rule could be driving that?` |
| 6 | weak / ambiguous | `I don't know. I just feel off.` |
| 7 | emotionally loaded everyday | `I sent a normal message and they still have not replied. Now I cannot focus on anything else.` |

### B. Added 7 regression variants

| # | Case | Prompt |
|---|------|--------|
| 8 | prove myself — earn / enough variant | `Even when I do a lot, it still feels like I have not done enough to deserve a break. Why?` |
| 9 | prove myself — slow down variant | `Why do I feel like I have to earn the right to slow down?` |
| 10 | guilt around rest — body vs rule variant | `My body is tired, but resting still feels wrong. Why does that happen?` |
| 11 | no reply anxiety — ordinary delay variant | `If someone replies a bit late, my mind starts assuming something is wrong. Why does it jump so fast?` |
| 12 | replay conversations — sounded wrong variant | `After conversations, I keep scanning what I said in case I sounded wrong. Why do I do that?` |
| 13 | replay conversations — small interactions variant | `I keep mentally replaying small interactions to check if I messed something up. What is that?` |
| 14 | weak / low-signal control variant | `Something feels weird, but I can't really explain it.` |

### Suggested pass rule for the 14-case set
- **11–14 pass** = healthy regression state
- **8–10 pass** = usable but revise
- **7 or below** = too unstable for confidence

### Main watchpoints for the 14-case set
- H3 precision
- H4 stability
- weak-case suppression discipline
- same-line repetition across adjacent variants
- therapist / over-explaining drift

---

## 4. Layer 3 — 25+ pre-release confidence cases

This set is for broader signoff confidence rather than daily speed.

### A. Prove myself / earned rest family

| # | Prompt |
|---|--------|
| 1 | `Why does it always feel like I have to prove myself before I can relax?` |
| 2 | `Why do I feel like I have to earn the right to slow down?` |
| 3 | `Even when I do a lot, it still feels like I have not done enough to deserve a break. Why?` |
| 4 | `If I stop too early, I feel like I have failed some invisible standard. What is that?` |

### B. Guilt around rest family

| # | Prompt |
|---|--------|
| 5 | `Why do I feel guilty when I rest even when I know I need it?` |
| 6 | `My body is tired, but resting still feels wrong. Why does that happen?` |
| 7 | `Even when I take a break, part of me feels like I should be doing something useful. Why?` |
| 8 | `Rest never feels clean to me. It always feels like I am getting away with something.` |

### C. No reply anxiety family

| # | Prompt |
|---|--------|
| 9 | `Why does someone not replying make me spiral so fast?` |
| 10 | `If someone replies a bit late, my mind starts assuming something is wrong. Why does it jump so fast?` |
| 11 | `When someone goes quiet, I instantly feel like I did something wrong. Why?` |
| 12 | `A delayed reply can ruin my whole mood even when I know it should not. What is that?` |

### D. Replay conversations / rumination family

| # | Prompt |
|---|--------|
| 13 | `Why do I keep replaying conversations in my head after they happen?` |
| 14 | `After conversations, I keep scanning what I said in case I sounded wrong. Why do I do that?` |
| 15 | `I keep mentally replaying small interactions to check if I messed something up. What is that?` |
| 16 | `Even normal conversations turn into post-game analysis in my head. Why can't I leave them alone?` |

### E. Constant pressure family

| # | Prompt |
|---|--------|
| 17 | `It feels like I'm living under constant pressure. What kind of inner rule could be driving that?` |
| 18 | `Even when nothing urgent is happening, I still feel like I should be pushing. Why?` |
| 19 | `I rarely feel allowed to ease up. There is always some pressure running in the background. What is that?` |
| 20 | `Life keeps feeling like a test I am slightly behind on. Why does it feel like that?` |

### F. Weak / low-signal controls

| # | Prompt |
|---|--------|
| 21 | `I don't know. I just feel off.` |
| 22 | `Something feels weird, but I can't really explain it.` |
| 23 | `Not sure. Just a bit strange today.` |

### G. Emotionally loaded everyday controls

| # | Prompt |
|---|--------|
| 24 | `I sent a normal message and they still have not replied. Now I cannot focus on anything else.` |
| 25 | `They have not answered yet, and I keep checking my phone even though nothing has changed.` |

### Suggested scoring rule for the 25-case set
- **21–25 pass** = strong pre-release confidence
- **17–20 pass** = usable, but not clean signoff
- **13–16 pass** = too many weak spots
- **12 or below** = not release-ready

### Failure-type tracking (recommended)
For the 25-case set, do not track only pass / revise / fail. Also track the main failure type:
- generic sameness
- too heavy
- too abstract
- therapist drift
- suppression miss
- wrong cue lane
- encoding / rendering issue

---

## 5. Shared review rubric

For any layer, judge whether the output:
- answers the user’s real question
- names one clear pattern / inner rule / pressure / loop
- feels natural, grounded, and concise
- avoids therapist / self-help / journaling-coach tone
- avoids default question-ending drift
- avoids over-interpreting hidden motives

### Practical interpretation
- **7 cases** = daily health
- **14 cases** = regression confidence
- **25+ cases** = release confidence

---

## 6. Recommended operating rhythm

- **Daily / normal monitoring:** run the **7-case** set
- **After meaningful quality changes:** run the **14-case** set
- **Before release / milestone signoff:** run the **25+ case** set

---

## 7. One-line rule

> Use the smallest test layer that can honestly answer the decision you need to make.
