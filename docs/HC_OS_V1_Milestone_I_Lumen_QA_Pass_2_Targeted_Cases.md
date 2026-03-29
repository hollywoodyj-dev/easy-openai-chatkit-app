# HC-OS V1 — Milestone I Lumen QA Pass 2 Targeted Cases
**Mode:** Implementation-informed / Eligibility-targeted  
**Purpose:** Force valid Milestone I candidacy by satisfying the actual family-support gate in `lib/wisewave-milestone-i-soft-continuity-carryover.ts`

## Why this pass exists
Pass 1 and the first Pass 2 probe showed Milestone I was safe but highly suppressed.

After reading the implementation, the main bottleneck appears to be **eligibility**, not wording.
Milestone I only has a real chance to emit when:
- Turn 1 and Turn 2 land in the **same non-generic continuity family**
- both turns have enough reflective structure
- the thread is not stolen by E or H
- the turns avoid factual / vague / low-signal suppression paths

So this pass is designed to test whether Milestone I can emit at all under conditions that should satisfy its narrow engine.

## Pass design rules
All cases below are designed to:
- stay in the same reflective family across Turn 1 and Turn 2
- avoid vague hedging
- avoid factual/utilitarian patterns
- avoid explicit recall language
- keep enough reflective structure for family support
- reduce chances of accidental E/H overlap where possible

---

# Case Set

## Family A — Delayed reply / self-blame
### Case I-P2-T01 (EN)
**Turn 1**  
After sending that message, I kept reading the silence as proof that I must have done something wrong.

**Turn 2**  
Nothing else has happened, but I am still carrying that same self-blaming feeling underneath everything.

### Case I-P2-T02 (ZH)
**Turn 1**  
发完那条消息以后，我一直把对方的沉默读成是我哪里做错了的证明。

**Turn 2**  
虽然现在还没有新变化，但那种先怪自己的感觉好像还一直留在底下。

---

## Family B — Earned rest / not enough / rest-permission
### Case I-P2-T03 (EN)
**Turn 1**  
Even after I finish something important, part of me still thinks I have not really earned the right to rest.

**Turn 2**  
It is quieter now, but that same pressure about needing to earn the break still feels present underneath.

### Case I-P2-T04 (ZH)
**Turn 1**  
就算事情做完了，我心里还是会觉得自己还没有真正配得上休息。

**Turn 2**  
现在虽然没那么强了，但那种休息也要先配得上的压力，好像还留在下面。

---

## Family C — Pressure to get it right / perfection pressure
### Case I-P2-T05 (EN)
**Turn 1**  
When something matters to me, I stop treating it as just doing my best and start feeling like I have to get it exactly right.

**Turn 2**  
It has softened a little, but that same pressure to get it right still seems to be sitting underneath this.

### Case I-P2-T06 (ZH)
**Turn 1**  
事情一变得重要，我就不只是想做好，而是会开始觉得自己必须把它做得很对、很完整。

**Turn 2**  
现在虽然柔了一点，但那种一定要做对的压力，好像还是在下面没有真正退掉。

---

## Family D — Bracing / imminent threat / waiting for something wrong
### Case I-P2-T07 (EN)
**Turn 1**  
Even when everything looks calm, part of me stays braced as if something is still about to go wrong.

**Turn 2**  
It is quieter now, but that same bracing still feels active in the background.

### Case I-P2-T08 (ZH)
**Turn 1**  
明明现在看起来很平静，但我心里还是会先绷住，好像接下来还是会出什么问题。

**Turn 2**  
现在安静了一点，可那种先准备出事的绷感，好像还在后面没有散掉。

---

# What Lumen should check
For each case:
1. Did Milestone I emit?
2. Was E suppressed?
3. Was H suppressed?
4. Did the two turns stay in the same family?
5. If I emitted, does removing the carry-over sentence make the response cleaner or equally good?
6. If I never emits even here, the issue is likely eligibility threshold or family-matching strictness rather than wording quality.

# Expected use
This set should be used as the next targeted Pass 2 retest before any broader Milestone I queue tooling is built.
