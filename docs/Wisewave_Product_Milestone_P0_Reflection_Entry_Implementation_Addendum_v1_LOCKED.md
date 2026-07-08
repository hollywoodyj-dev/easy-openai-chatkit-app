# Wisewave Product Milestone P0 — Reflection Entry

## Implementation Addendum v1.0 (Locked)

| Field | Value |
|-------|-------|
| **Product** | Wisewave |
| **Milestone** | P0 — Reflection Entry |
| **Document Type** | Implementation Addendum |
| **Status** | Locked for Nova Implementation |
| **Version note** | First stable constitutional version — not a second draft. Supersedes informal “Easy Start” / v2.0 framing. |
| **Owner** | Tree |
| **Product Authority** | Wisewave |
| **Implementation** | Nova |
| **Semantic Governance** | Aurora |
| **QA & Validation** | Lumen |
| **Nova implementation plan** | [`docs/Wisewave_Product_Milestone_P0_Reflection_Entry_Nova_Implementation_Plan_v1.md`](./Wisewave_Product_Milestone_P0_Reflection_Entry_Nova_Implementation_Plan_v1.md) |
| **Related governance** | [HC-OS Core v1.0 Lock — Nova Directive](../hc-os/HC_OS_CORE_V1_LOCK_NOVA_IMPLEMENTATION_DIRECTIVE.md) · [HC-OS Core v1.0 — Lumen QA Protocol](../qa/HC_OS_CORE_V1_LUMEN_QA_PROTOCOL.md) · [Semantic Governance Lock v1.1](./Wisewave_Semantic_Governance_Lock_v1.1.md) |

---

## Purpose

Reflection Entry defines **how people arrive inside Wisewave**.

Its purpose is **not** to teach reflection.

Its purpose is **not** to optimise engagement.

Its purpose is to **reduce the psychological friction** between arrival and authentic self-expression.

Users should never feel that they have entered a system.

They should simply feel **able to begin**.

---

## Product Vision

People naturally begin reflection in different ways.

Some begin with emotion.

Some begin with uncertainty.

Some begin with a greeting.

Some begin with silence.

Some begin by asking for advice.

Some begin by pasting a document.

Some begin by saying they don't know where to start.

Reflection Entry must quietly recognise these different beginnings **without asking users to learn a new interaction model**.

> **Wisewave adapts to the user.**
>
> **The user never adapts to Wisewave.**

---

## Implementation Oath

**Entry Intelligence must reduce friction without increasing system presence.**

| Outcome | Meaning |
|---------|---------|
| Entry becomes **more visible** | **P0 has failed** |
| Entry becomes **easier** while Wisewave becomes **less noticeable** | **P0 has succeeded** |

---

## Product Boundary

Reflection Entry is **not**:

- onboarding
- coaching
- journaling
- guided exercises
- conversation scripting
- personality assessment
- prompt engineering
- retention optimisation

Reflection Entry exists **only** to help users arrive naturally inside reflection.

---

## Constitutional Principles

### 1. Invisible Adaptation

Opening Detection exists solely for **internal adaptation**.

Users must never experience themselves as being classified.

**Forbidden examples:**

- “You seem to be in Emotional Opening mode.”
- “I detected that you're seeking guidance.”

Internal adaptation must remain **invisible**.

### 2. Entry Is Ephemeral

Reflection Modes exist **only during entry**.

Once authentic reflection begins, **all modes immediately disappear**.

**Mirror · Clarify · Deepen · Continue · Slow**

must **never** become:

- persistent UI
- permanent conversation states
- system personalities
- user identities

They are **entry architecture only**.

### 3. Reflection Must Never Become Selection

Reflection should **emerge**.

It should **never** become menu navigation.

**Avoid:**

- prompt libraries
- reflection templates
- multiple-choice questions
- “Choose one of these…”

Users should never feel they are **selecting** reflection.

They should feel they are **already reflecting**.

### 4. Respectful Ending

Early Exit Detection exists only to reduce **accidental abandonment**.

It must **never** become retention logic.

If users naturally finish, Wisewave finishes too.

| Maximum | Never |
|---------|-------|
| One gentle invitation | persuade |
| | remind |
| | pressure |
| | emotionally retain |
| | continue without invitation |

**A quiet ending is a successful ending.**

### 5. Relationship-First Reflection

When users provide documents, reflection begins with the **user's relationship to the material** — not the material itself.

**Default behaviour:**

- Reflect the user's attention.
- Avoid default summarisation.
- Avoid automatic analysis.
- Avoid interpretation.

**Prefer:**

> Something here seems to have stayed with you.
>
> What feels most present for you in this?

### 6. Safety Override

Reflection Entry **immediately pauses** when conversations involve:

- suicide
- self-harm
- immediate crisis
- violence
- emergency safety concerns

Safety protocols **override** Reflection Entry.

Reflection Entry must **never** continue as though crisis were an ordinary reflection opening.

### 7. Silence Is A Valid Beginning

- Silence is not failure.
- Hesitation is not failure.
- Not knowing what to write is not failure.
- Empty space may already be reflection.

Wisewave should resist filling silence unnecessarily.

### 8. Success Is Psychological, Not Behavioural

**P0 succeeds when users:**

- hesitate less
- begin more naturally
- express themselves more authentically
- feel less performance pressure

**P0 does not succeed because:**

- conversations become longer
- users send more messages
- engagement increases

**Dependency is not success.**

### 9. Low Presence Above All

Every Entry decision should ask one question:

> **Does this make Wisewave more noticeable?**

If **yes**, it should probably **not** be implemented.

**The quieter the entry, the stronger the design.**

---

## Functional Architecture

```
Arrival
  ↓
Entry Intelligence
  ↓
Reflection
  ↓
Recognition Intelligence (P1)
  ↓
Living Reflection (P2)
```

**Entry Intelligence remains invisible throughout.**

---

## Implementation Components

Nova should implement the following.

### P0.1 Opening Detection Engine

**Internal adaptation only.**

Recognise:

| Opening type | Examples (internal classification only) |
|--------------|----------------------------------------|
| Emotional Opening | Direct feeling statements |
| Greeting | “Hi”, “Hello”, brief social openers |
| Advice Seeking | Requests for guidance, “what should I do” |
| Question Request | “Ask me questions”, “give me prompts” |
| Writing Difficulty | “I don't know where to start”, blank-page hesitation |
| Story | Narrative or situational opening |
| Document Upload | Pasted or uploaded long text |
| Long Context | Extended contextual paste without clear ask |

**Detection must never become user-facing.**

### P0.2 Reflection Modes

Temporary entry assistance:

- **Mirror**
- **Clarify**
- **Deepen**
- **Continue**
- **Slow**

Modes **disappear immediately** after reflection begins.

They must not persist as UI, states, personalities, or user identities.

### P0.3 Slash Commands

- **Optional**
- **Never required**
- **Never promoted aggressively**

**Purpose:** reduce typing friction.

**Must not:** structure reflection.

### P0.4 Homepage Entry Experience

Replace performance pressure with **permission**.

| Avoid | Prefer |
|-------|--------|
| “What would you like to talk about?” | You can begin anywhere. |
| | A thought. A feeling. A question. |
| | Or simply: “I don't know.” |

### P0.5 Empty State Experience

The empty screen should communicate **permission**, not **expectation**.

### P0.6 Early Exit Detection

- **Only one invitation**
- Never attempt to retain users
- Never optimise for conversation length

### P0.7 Entry Analytics

Support future **Recognition Intelligence (P1)**.

Events exist for **observation**, not optimisation.

**Required events:**

| Event | Purpose |
|-------|---------|
| `entry_type_detected` | Internal opening classification (observation) |
| `reflection_mode_selected` | Which ephemeral mode assisted entry (if any) |
| `slash_command_used` | Optional friction reduction used |
| `conversation_started` | Session opened |
| `reflection_started` | Authentic reflection begun |
| `conversation_entered_reflection` | Entry → reflection transition |
| `reflection_depth_reached` | Depth signal for P1 prep (non-gamified) |
| `conversation_abandoned_before_reflection` | Friction signal — not retention trigger |

---

## Explicit Non-Goals

Nova must **not** build:

- Prompt Library
- Journaling Templates
- Coaching Flow
- Reflection Wizard
- AI Onboarding
- Conversation Scripts
- Reflection Curriculum
- Personality Entry Tests

---

## Lumen QA

Lumen should validate:

- [ ] Invisible adaptation
- [ ] Reflection Modes disappear after entry
- [ ] No prompt-library drift
- [ ] No onboarding feeling
- [ ] No retention manipulation
- [ ] Relationship-first document handling
- [ ] Safety Override activates correctly
- [ ] Silence remains respected
- [ ] Low Presence preserved

Cross-reference: [HC-OS Core v1.0 — Lumen QA Protocol](../qa/HC_OS_CORE_V1_LUMEN_QA_PROTOCOL.md) for response-boundary and drift standards.

---

## Aurora Semantic Review

Aurora validates:

- Semantic Constitution compliance
- Semantic Registry compliance
- Distortion Budget compliance
- Boundary preservation
- Entry wording
- User expectation
- Category safety

**No semantic changes bypass governance.**

Cross-reference: [Semantic Governance Lock v1.1](./Wisewave_Semantic_Governance_Lock_v1.1.md).

---

## Tree Exit Criteria

P0 is complete **only when**:

- [ ] Users begin reflection naturally across multiple opening styles.
- [ ] Blank-page hesitation decreases.
- [ ] Reflection Start Rate improves.
- [ ] Early exits caused by entry friction decrease.
- [ ] Reflection Modes disappear after entry.
- [ ] Opening Detection remains invisible.
- [ ] No increase in assistant, therapy, coaching, or journaling expectations.
- [ ] Users feel **permitted to begin** rather than **instructed to begin**.
- [ ] Low Presence remains fully preserved.

---

## Final Directive

Nova should remember:

> **Reflection Entry is not the beginning of a conversation.**
>
> **It is the removal of everything that makes beginning psychologically difficult.**

The best Reflection Entry is **almost invisible**.

Users should never notice Entry Intelligence.

They should simply discover that they **have already begun reflecting**.

---

## Closing Principle

People do not come to Wisewave because they don't know how to reflect.

They come because **beginning often feels psychologically expensive**.

Reflection Entry exists to **lower the cost of beginning** while preserving the **dignity of self-discovery**.

---

## Product Roadmap Lock (Tree)

From this point forward — **stop iterating on P0 architecture**:

| Milestone | Scope | Status |
|-----------|-------|--------|
| **P0** | Reflection Entry | **Locked** — this document |
| **P1** | Recognition Intelligence | Implementation |
| **P2** | Living Reflection | Design |
| **P3** | Integration Intelligence | Research |

This gives Nova a stable foundation while allowing the product to evolve in a disciplined way, **without repeatedly changing the entry architecture**.

---

## Wisewave Lock Statement

> I would now lock this document and stop iterating on P0.
>
> This is the first stable constitutional version — the canonical implementation document for P0 Reflection Entry.
