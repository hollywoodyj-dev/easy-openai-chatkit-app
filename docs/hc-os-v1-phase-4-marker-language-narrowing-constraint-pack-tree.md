# HC-OS V1 — Phase 4 Marker Language Narrowing Constraint Pack (Tree)

**Status:** Narrow follow-up only — Phase 4 is **not** reopened.  
**Scope:** Language layer for the **current-space marker** only (not routing, not anchor/last-insight copy, not UI chrome).  
**Authoritative narrowing pass (Wisewave owner):** **`docs/hc-os-v1-phase-4-marker-language-narrowing-pack-wisewave.md`** — rewrite map, suppression law, allowed forms, Lumen checklist.  
**Aligns with:** Wisewave **`docs/hc-os-v1-phase-4-space-language-spec-wisewave-owner.md`**, addendum **`docs/hc-os-v1-phase-4-addendum-thread-legibility-soft-orientation-layer.md`**.  
**Implementation touchpoints today:** **`lib/wisewave-thread-label.ts`** (thread label → marker source), **`lib/phase4-soft-orientation.ts`** (suppression), **`/chat`** marker render.

**Governing line:** Tighten the **trace vs name** boundary. Preserve **felt residue**. Prevent **semantic objecthood**.

---

## A. Boundary definition

### Acceptable marker language (felt trace / residue)

Marker text should read as:

- **Trace-like:** an aftertaste of the space, not a name for the space.
- **Residual:** something still *hanging*, not something *identified*.
- **Non-declarative:** suggests atmosphere; does not assert what “this” *is*.
- **Non-objectified:** avoids turning lived tension into a **thing** with a stable handle.

Operational read: the user could forget the exact words and still sense **orientation**; the line does not invite filing, sorting, or “that’s my X.”

### Unacceptable marker language (semantic object / structure)

Marker text must **not** read as:

- **Label-like / title-like:** could sit on a tab, card, or list row as a **name**.
- **Category-like:** names a *type* of problem or theme (diagnostic bucket).
- **Semantically fixed:** reads as a **stable internal entity** (“the [noun] thread”).
- **“This is a thing” energy:** implies a bounded object the system is **holding** or **showing you**.

Operational read: if the line sounds like a **product label**, **mini-heading**, **topic tag**, or **named pattern**, it has crossed into objecthood.

---

## B. Positive constraints (what marker language should do)

1. **Light weight** — One short fragment; secondary to main reflection and last-insight anchor.
2. **Residual phrasing** — Prefer *state residue* (“still…”, “a little…”, “not quite…”, “here…”) over *nominal labels* (“X pressure”, “Y tension” as titles).
3. **Non-insistent** — Readable in a glance; does not demand interpretation or agreement.
4. **Suggestive, not classificatory** — Hints at *how it might feel*, not *what it is called*.
5. **Present-oriented** — Stays in the **now** of the space; no history narration.
6. **Soft orientation only** — Orients without map coordinates; no “you are in [category].”
7. **EN/ZH parity in spirit** — Same trace-vs-name bar; wording may differ by language, hardness must not.

---

## C. Negative constraints (what marker language must not become)

1. **Not a title** — No headline casing or “chapter name” rhythm (even if CSS is lowercase).
2. **Not a topic label** — Not “About work stress” / “关于工作压力.”
3. **Not a diagnosis** — Not naming a clinical or pseudo-clinical entity.
4. **Not a category tag** — Not a single noun phrase that could index a taxonomy (“Work anxiety”, “Relationship block”).
5. **Not a mini-heading** — Not structured like a section title for the page.
6. **Not an internal system noun** — Avoid “thread”, “session”, “continuity”, “insight”, “pattern ID” flavor in user-visible marker text.
7. **Not explanatory** — No “because”, “which means”, “this indicates.”
8. **Not precision that hardens** — Sharper concepts that **increase legibility** at the cost of **object feel** are out of bounds (Tree: do not optimize for conceptual clarity if it increases semantic hardness).

---

## D. Examples (good / borderline / bad)

Illustrative English; Chinese must pass the **same** boundary (see Wisewave spec for ZH good/bad shapes).

### Good (felt trace; low objecthood)

- “still a bit tight”
- “not fully settled”
- “something underneath”
- “a little held back inside”
- “rushed and still not settling”
- “low after knocks at work”
- “还没有完全落下”
- “有一点还在这里”

### Borderline (use only if suppression + context confirm low weight; prefer softer variant)

- “tight around getting it right” — leans nominal; acceptable if kept **short** and **non-title** in UI, but watch for **category** read.
- “not quite enough underneath” — abstract noun stack; monitor for **mini-diagnosis** feel.
- Phrases that are **verb-led** or **sensory** drift safer than **noun-stack** versions of the same idea.

### Bad (object-like / title-like / category-like)

- “Work discouragement”
- “Self-worth tension”
- “Inner hesitation” (as a **named** state product)
- “Quiet pressure around work” (when it reads as a **topic card**)
- “Discussion about relationship anxiety”
- “你正在经历自我价值问题”
- Anything that could be a **Notion database row title** without embarrassment

---

## E. Generator constraints (for Nova or future generators)

These are **implementation-ready** levers for heuristic tables, small templates, or tightly bounded LLM post-processing — **without** increasing length, frequency, or explanation.

1. **Prefer fragments over noun phrases** — Lead with adjective/adverb/participle (“still…”, “a little…”, “not quite…”) over head nouns (“X pressure”, “Y issue”).
2. **Cap noun stacks** — Avoid chaining two or more abstract nouns as the spine of the marker (“worth tension”, “pressure pattern”) unless diluted by residual glue (“still”, “around”, “after”).
3. **Ban title patterns** — Reject lines that match: `[Abstract Noun] + [Abstract Noun]` as the whole marker; `[Theme]: [Subtitle]`; “Your [X]” as a label.
4. **Ban taxonomy lexicon** — Filter or down-rank tokens that read as categories: “issue”, “pattern”, “topic”, “theme”, “case”, “type”, “disorder”, “syndrome”, “block”, “problem” (as a noun headline).
5. **Prefer process residue over entity names** — “still not settling” &gt; “unsettled state”; “after knocks” &gt; “work setback category.”
6. **Length band unchanged** — Do **not** add words for “clarity”; tighten by **rephrasing**, not expanding.
7. **Suppression-first** — When in doubt between **more specific** and **more object-like**, **suppress** or **soften** (per **`lib/phase4-soft-orientation.ts`**).
8. **Hash / variant discipline** — If multiple variants exist for differentiation, each variant must still pass **this** pack; never trade distinction for **harder** nouns.
9. **ZH:** Same rules: avoid **topic titles**, **analysis headings**, **named problem labels**; prefer **unfinished**, **atmospheric** fragments per Wisewave examples.

---

## F. QA implications (Lumen)

If marker language is tuned against this pack, verify:

1. **Objecthood test** — Does the marker feel like a **whisper of residue**, or like a **name for a thing**? Fail if title/category/diagnosis read dominates.
2. **Stability illusion** — Does the line imply a **stable internal object** the app is tracking? Fail if yes.
3. **Comparison across threads** — Different markers may differ; none should **harden** into clearer “product labels” just to differ.
4. **No regression on presence** — Frequency, placement, and visual weight stay Phase 4–correct; only **tone** tightens.
5. **Borderline set** — Explicitly spot-check any **borderline** examples after changes; prefer **softer** alternates if hosted feel drifts object-ward.
6. **Reject false fixes** — Longer copy, more explicit concepts, or “clearer” names are **not** success; they are **failure modes** for this watchpoint.

---

## Hard constraints (Tree)

Do **not** “fix” marker language by:

- Making markers **longer**
- Adding **explanation**
- Increasing **display frequency** or **visual prominence**
- Choosing **intellectually precise** wording that **increases semantic hardness**
- Turning the marker into a **structured UI artifact** (badges, chips, metadata affordances)

---

## Why this matters (one paragraph)

Phase 4’s constitutional risk is no longer mechanism; it is **language drift**. When marker copy **names** the space, the space becomes an **object** the user (and the product) can **reify** — a short path to tool-feel and management-feel **without** adding any new button. This pack keeps implementation honest: **residue in, objects out.**
