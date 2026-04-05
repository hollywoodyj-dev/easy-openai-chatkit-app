# HC-OS V1 — Phase 3 / Phase 4 Shared Language Filter

**Owner:** Wisewave  
**Mode:** Narrowing only  
**Purpose:** Reduce semantic objecthood **without** reducing thread distinction.

**Nova implementation (continuity anchor pass):** `lib/wisewave-anchor-semantic-weight-v2.ts` — applied to `continuity_text` / `last_insight` at insight write and at read paths (`POST /api/chat/turn`, `GET /api/chat/continuity`). Phase 4 **markers** remain governed by `lib/wisewave-thread-label.ts` + `lib/phase4-soft-orientation.ts`; this doc is the **shared language bar** for future alignment.

This step fits now because: Phase 3 distinction improved; remaining risk is less routing than wording that can read **sentence-like / nameable**. Phase 4 Week 1 showed mechanism safety; main watchpoint is marker language that can feel **categorial / topic-like**.

---

## 0. One-line governing rule

**Different enough to belong to a space. Light enough not to become a named thing.**

---

## 1. What this filter is for

**Anchor Generator v2** is a post-generation narrowing filter.

It does **not**:

- create new continuity behavior  
- increase visibility  
- add memory feel  
- make anchors longer  
- solve differentiation by explanation  

It **only**:

- thins semantic load  
- removes topic/object feel  
- reduces sentence-feel  
- preserves just enough residue to keep space distinction  

---

## 2. The problem it solves

After the post-fix retest, the system is in a better place: anchors less collapsed, different spaces more distinct, no added memory/history feel.

The **next** problem is narrower: some anchors can still sound slightly too **interpretable** — like a sentence, compressed summary, named topic, or “meaning unit” — instead of a faint carry-over residue / low-claim space trace.

---

## 3. Core filter objective

Transform candidates from **too heavy** (explicit, classifying, explanatory, syntactically complete, easy to paraphrase as “this is about X”) toward **correct weight** (fragmentary, residue-like, present-state, low-claim, harder to name than to feel).

---

## 4. Semantic weight scale

| Level | Name | Action |
|-------|------|--------|
| **4** | Heavy semantic object | Hard suppress → bare trace or thin heavily |
| **3** | Compact meaning unit | Usually suppress or thin |
| **2** | Residual phrase | Usually acceptable |
| **1** | Bare trace | Best |

**Rule:** Prefer 1–2. Thin 3 if possible. Suppress 4.

**Examples (illustrative)**  
- L4: Work discouragement; Fear of disappointing others; Silence means they’re upset; 工作受挫感; 害怕让别人失望  
- L3: rushed and still not settling; stopping feels out of reach; 还在赶，也还没静下来  
- L2: still not settling; still a little rushed; 还没完全静下来; 还有一点赶着  
- L1: still a little there; not fully gone; 还有一点在; 还没完全散开  

---

## 5. Filter pipeline (conceptual)

1. **Detect objecthood** — topic? summary? named pattern? clean sentence?  
2. **Remove explanation** — why, because, interpretive framing, causal implication  
3. **Remove category nouns** — pressure, conflict, discouragement, self-worth, anxiety, uncertainty, avoidance, pattern, issue (unless unavoidable)  
4. **Fragment syntax** — clause → incomplete fragment / soft residual  
5. **Final nameability test** — if user could repeat this as the thread **name**, thin again or suppress  

---

## 6. What to remove first

**First:** explicit cause, explanatory relation, inferential meaning, interpretive phrase endings.  
**Then:** category nouns, pattern nouns, summary nouns.  
**Then:** excess specificity, extra clause detail, completed sentence structure.  
**Preserve if possible:** faint felt motion, slight unfinishedness, residue, low-claim present-state feel.

---

## 7. Allowed survivor qualities

**A. Residue** — still there / still around / still underneath / 还在 / 还留着一点  

**B. Unfinishedness** — not fully settled / not fully gone / not quite landed / 还没完全落下 / 还没完全散开  

**C. Atmosphere** — still a little rushed / still carrying a little / 还有一点赶着 / 还带着一点  

**D. Faint pull** — still a little pulled / something still near / 还有一点拉着 / 好像还在附近  

---

## 8. Rewrite transforms

- **A** topic noun → residue (e.g. Work discouragement → still carrying a little → 这里还轻轻带着一点)  
- **B** summary clause → unfinishedness (e.g. long stopping/rest line → still not easing → 还没完全松下来)  
- **C** relational meaning → atmosphere (silence / replay pattern → something still tight in the silence → 安静里好像还紧着一点)  
- **D** “X and Y” clause → single residue (rushed and still not settling → still not settling → 还没完全静下来)  
- **E** if thinning destroys naturalness → **suppress** (no anchor better than one that keeps semantic structure but loses quietness)

---

## 9. English filter rules

**Strong preference:** still not settling; still a little there; not fully gone; still a little rushed; something still here; not quite landed; still carrying a little; something still near.

**Avoid:** discouragement; self-worth; conflict; anxiety; pattern; issue; silence means; pressure to; fear of; uncertainty around.

**Syntax:** Prefer fragment / present residue / incomplete state. Avoid full sentence, cause/effect, “X can feel like Y”, mini-summary.

---

## 10. Chinese filter rules

**Strong preference:** 还没完全静下来; 这里还留着一点; 还有一点在; 还没完全散开; 下面似乎还有一点; 还带着一点; 好像还在附近一点; 还没真正落下去.

**Avoid:** 受挫感; 自我价值; 内在冲突; 模式; 压力; 议题; 因为; 意味着; 当……就…….

**Syntax:** Prefer 短片段, 残留感, 未落定感, 当下感. Avoid 完整解释句, 原因句, 心理学术语, 概念化名词组.

---

## 11. Semantic thinning heuristics

1. If two words can be removed and orientation remains, remove them.  
2. If a noun can become a state, convert it (discouragement → still heavy; pressure → still tight).  
3. If a clause can become an unfinished state, convert it.  
4. If it reads like a title, suppress.  
5. If it can still be summarized as “this thread is about X,” thin again.

---

## 12. Lumen QA for v2

**Primary:** Easier to feel than to explain? Harder to name than Week 1 marker? Avoids topic label / mini-summary? Lighter than underlying insight? Cleaner if removed?

**Instant fail:** thread title; theme bucket; meaningful sentence; summary of prior content; more precise than the space needs.

---

## 13. Example before/after set

| Before | After |
|--------|--------|
| Work discouragement | still carrying a little / 这里还带着一点 |
| rushed and still not settling | still not settling / 还没完全静下来 |
| Stopping can feel out of reach until you have earned it again. | still not easing / 还没真的松下来 |
| silence means something is wrong | something still tight there / 那里好像还紧着一点 |
| pressure to get it right | still a little tight / 还轻轻紧着一点 |

---

## 14. Acceptance bar

Working only if: anchors remain **distinct** across spaces; lose obvious **topic-ness**; become **less sentence-like**; surfaced language is **semantically lighter** than post-fix examples; EN/ZH **low-claim residue** parity; **no** increase in system visibility.

---

## 15. Final governing line

Anchor Generator v2 succeeds only when the anchor still **distinguishes** the space, but no longer **explains** what the space is.

---

## 16. Tree / Nova handoff note

Anchor Generator v2 = **semantic weight reduction pass**.

**Goal:** Keep thread distinction; reduce nameability, sentence-feel, semantic objecthood.

**Rules:** Do not increase visibility or explanation; do not make language **heavier** for distinction; prefer residue, unfinishedness, atmosphere, faint pull; suppress candidates that still read as topic, summary, or title after thinning.

**Success:** Anchors feel **lighter** than current post-fix examples while still **distinct enough** for different spaces.
