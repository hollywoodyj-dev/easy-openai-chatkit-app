# Founder Decision — P1-FRL Phase 1 and 玄微／WISEWAVE IP

**Date:** 2026-10-01  
**From:** Founder / Wisewave  
**To:** Tree  
**Cc:** Aurora · Nova · Lumen  
**Status:** **FOUNDER DECISION RECORDED**  
**Plan on file:** `docs/NOVA_P1_FRL_IMPLEMENTATION_PLAN_2026-09-24.md`

```text
P1-FRL PHASE 1 PLAN: AUTHORIZED
INTERNAL CODE: AUTHORIZED (Tree 2026-10-10) — DEFAULT-OFF
HOSTED PREVIEW: NOT AUTHORIZED
PRODUCTION: HOLD / HARD-BLOCK

P0 ONE-VOICE RULE: ACCEPTED

EN / ZH COPY:
ONE FINAL AURORA EDIT ROUND
THEN LOCK BEFORE PREVIEW

CARRY WITH ME: CLOSED
RETURN ANCHOR: CLOSED
PHASE 2 / PHASE 3: CLOSED

玄微／WISEWAVE IP:
BRAND NARRATOR + USAGE DEMONSTRATOR
NOT AN IN-APP COMPANION PERSONA
```

**Tree follow-up (2026-10-10):** Phase 1 internal implementation authorized. Nova evidence: `docs/qa/P1_FRL_PHASE1_NOVA_INTERNAL_IMPLEMENTATION_2026-10-10.md`.

---

## 1. Product spine

Governing principle: **Teach the posture of reflection, not the answer to life.**

Wisewave should help an unfamiliar user understand how reflection works here without becoming:

- the authority on the user’s experience
- the person who makes the decision
- a coach
- a therapist
- an emotional companion
- a habit-enforcement system

Long-term distinction: **Continuity without dependency.**

Continuity may help a person return to their own reflection. It must not be designed to make the person increasingly dependent on Wisewave itself.

---

## 2. P1-FRL Phase 1

Founder **authorizes** the existing Nova Phase 1 implementation plan.

Authorized scope remains:

```text
Reflection Literacy Reframe
+ First Genuine Expression handoff
+ existing P1-FMI integration
```

Phase 1 applies only inside the defined first-use window. It may respond to **advice-seeking** and **abstract self-explanation** only when a genuine reflective expression is not already present.

If the user already brings a genuine personal expression:

```text
BYPASS REFLECTION LITERACY
→ ordinary reflection
→ existing P1-FMI if eligible
```

Wisewave must not teach Reflection to a user who is already reflecting.

---

## 3. Code gate

This decision authorizes the **plan**. It does **not** authorize implementation.

```text
PLAN = AUTHORIZED
CODE = HOLD
```

Tree must open a separate implementation gate after explicitly reviewing the current Nova plan.

Nova must not interpret Founder approval of the product direction as permission to begin code.

Hosted Preview and Production remain separately governed.

---

## 4. One-voice rule — ACCEPTED

When Reflection Literacy Reframe is applied, Wisewave may withhold the P0 **Mirror / Clarify / Deepen / Continue / Slow** mode appendix for that turn.

Purpose: prevent two competing instructional voices at once.

This does not redesign P0. It is a local, one-turn prompt-assembly decision.

**Hard boundary:** P0 safety always wins. Safety must never be withheld.

---

## 5. EN / ZH reframe copy

Founder does **not** lock the prior planning copy verbatim.

Aurora receives **one** final semantic pass. The desired change is not broader functionality. It is to make the reframe feel less like a product rule and more like a natural permission to reflect.

Nova must **not** independently invent additional variants. After Aurora’s pass, lock before code / Preview.

**Update 2026-10-10:** Aurora **COPY LOCK** delivered and applied in `lib/wisewave-p1-reflection-literacy.ts` (`P1_FRL_COPY_*`). Status `aurora_copy_locked`.

**Update 2026-10-11:** Founder **B** — Hosted Preview authorized (`docs/qa/P1_FRL_FOUNDER_TREE_AUTHORIZE_HOSTED_PREVIEW_2026-10-11.md`). Production remains hard-blocked.

### 5.1 Advice-seeking (Founder-recommended, not locked)

| | |
|---|---|
| **EN** | You don’t need to find the answer here. You can begin with what is already present — a feeling, a situation, or even not knowing yet. |
| **ZH** | 在这里，不需要急着找到“该怎么做”的答案。你可以从已经在场的东西开始——一种感受、一件事，甚至只是还不知道。 |

Rationale: “This space does not tell you what to do” is semantically safe but begins with what Wisewave refuses. The revised line begins with **permission** and keeps the same boundary without sounding corrective.

### 5.2 Abstract self-explanation (Founder-recommended, not locked)

| | |
|---|---|
| **EN** | You don’t need to explain all of yourself here. You can stay with one thing that feels present, without needing to make the whole picture clear. |
| **ZH** | 在这里，不需要一次把自己解释清楚。可以先停在此刻比较明显的那一点上，不必急着把整个自己说明白。 |

The user should experience **I can begin here**, not **I have been using Reflection incorrectly**.

### 5.3 Copy boundary

The final pair must remain: non-directive, non-clinical, non-companion, non-spiritual, non-diagnostic, low-presence, easy to disagree with.

**Prohibited ZH drift:** 你真正的问题是 / 你的内心深处 / 你的潜意识 / 你其实是在 / 你需要疗愈 / 你的模式是 / 我陪你 / 我们一起走进去

**Also prohibited:** insight unlocked / go deeper / your journey / shall we / here’s what you should do / I’m here for you / I’ll stay with you

---

## 6. P1-FMI

P1-FMI remains unchanged. P1-FRL must reuse the existing governed FMI path.

Do not create another FMI implementation, a visible insight object, an insight card, an achievement, a reward surface, or a progress milestone.

Intended experience: *I see something a little more clearly.*  
Not: *Wisewave gave me an insight.*

---

## 7. Carry With Me / Return Anchor — CLOSED

```text
CARRY WITH ME = CLOSED
RETURN ANCHOR = CLOSED
PHASE 2 = CLOSED
PHASE 3 = CLOSED
```

Do not implement `ENABLE_P1_CARRY_WITH_ME` or `ENABLE_P1_RETURN_ANCHOR`.

Do not substitute `last_insight`, AI-generated Insight objects, Continue labels, Thread labels, inferred continuity, or existing memory for future user-owned Carry state.

If Carry is reopened later, it must begin with an explicit user-owned save contract.

---

## 8. 玄微／WISEWAVE brand IP

**Locked role:** brand narrator + usage demonstrator.

玄微／WISEWAVE **may**:

- explain the philosophy behind Wisewave
- demonstrate how Reflection works
- show examples of ordinary human situations
- help reduce the understanding cost of Reflection AI
- appear in short-form content, educational videos, brand storytelling, and product demonstrations

玄微／WISEWAVE **must not** become:

- the user’s emotional companion
- the person “always waiting for you”
- an in-app character who repeatedly inserts himself into reflection
- a simulated friend
- a therapeutic relationship
- a reason to return to the app
- a promise of relational continuity

玄微 helps people understand Wisewave.  
玄微 is not the relationship people come to Wisewave to maintain.

---

## 9. Short-form / digital-human boundary

Short films and digital-human content may use warmth, story, and personality. Every piece should ultimately make the product easier to understand.

The viewer should leave thinking: *Now I understand how Wisewave works.*  
Not: *I want to talk to 玄微 because he understands me.*

The character serves the category. The category must not disappear behind the character.

---

## 10. Founder position on warmth

Wisewave does not need to become emotionally cold to preserve Low Presence.

The boundary is not warmth vs restraint.  
The boundary is **human warmth vs relational dependency**.

Wisewave may feel humane, considerate, calm, and receptive without promising attachment, permanence, companionship, or emotional availability.

Low Presence should not become human absence.

---

## 11. What happens next

| Who | Action |
|-----|--------|
| **Nova** | **No code.** Maintain the implementation plan. Wait for Tree’s explicit implementation gate. |
| **Aurora** | One final EN/ZH reframe copy pass — **DONE** (COPY LOCK 2026-10-10). Do not broaden product behaviour. |
| **Tree** | Record this decision. Review the current Nova plan. Then issue **AUTHORIZE PHASE 1 INTERNAL IMPLEMENTATION** or **HOLD FOR REVISION**. |
| **Lumen** | No Hosted Preview QA yet. |

---

## Founder sign-off (recorded)

- [x] Phase 1 implementation plan: **AUTHORIZED**
- [x] Code / Hosted Preview / Production: **HOLD** pending separate Tree gates
- [x] One-voice rule: **ACCEPT** P0 mode-appendix withhold when literacy applies
- [x] EN/ZH copy: **ONE FINAL AURORA EDIT ROUND, THEN LOCK**
- [x] Carry With Me / Return Anchor / Phase 2 / Phase 3: **REMAIN CLOSED**
- [x] 玄微／WISEWAVE IP: **BRAND NARRATOR + USAGE DEMONSTRATOR ONLY** — not an in-app relational / companion persona

**Date recorded:** 2026-10-01  
**Received into repo:** 2026-10-06 (Wisewave → Nova)

---

## Final Founder line

Wisewave may help a person learn how to reflect.  
It must not become the person they need in order to reflect.

And for 玄微／WISEWAVE:  
Show people the doorway.  
Do not become the reason they stay at the door.
