# Lumen QA Plan — `/quiet-reflection` SEO support page v1

**For:** Lumen (pre-deploy / hosted review)  
**From:** Nova  
**Date:** 2026-05-19  
**Route:** `https://www.wisewave.io/quiet-reflection`  
**Lumen recommendation:** support/SEO opportunity — **not** homepage identity shift  

## Nova proposal (implemented for review)

### Title / meta / H1

| Field | Value |
|-------|--------|
| **Title** | Quiet Reflection \| Reflection without advice or takeover |
| **Meta** | Quiet reflection means room to hear your own thinking—not more advice, coaching, or interference. How Wisewave fits and what it is not. |
| **H1** | Quiet reflection |

### Page structure (H2 sections)

1. **What quiet reflection means here** — define term in Wisewave context (concrete)  
2. **Reflection without advice or takeover**  
3. **Why less interference matters**  
4. **Who quiet reflection fits** (+ brief misfit line)  
5. **What Wisewave is not** — boundary list  
6. **Common questions** — 4-item accordion (no FAQPage schema on this page; `/faq` keeps canonical FAQ schema)  
7. **Related reading** — core internal links  
8. **When you are ready** — CTA + related cluster links  

## Primary QA question

Does the page make **quiet reflection** legible for search and fit users **without** drifting into wellness, therapy, support, coaching, companion, or vague poetry?

## Axes

1. **Category integrity** — quiet reflection = low-interference reflection space, not wellness/healing  
2. **Concrete vs vague** — readable in one pass; not abstract homepage-style poetry  
3. **Search clarity** — term defined; Wisewave connection clear; not keyword-stuffed  
4. **Support-page discipline** — clarifies category; no sprawl into self-help content farm  
5. **Internal linking** — honest links to `/`, `/reflection-without-advice`, `/who-its-for`, `/what-it-is-not`  

## Verdicts

PASS | PASS WITH WATCHPOINTS | REVISE | BLOCKED

## Report format

Append to `docs/QA_HANDOFF.md`:

```text
YYYY-MM-DD — Lumen (/quiet-reflection SEO page v1): [verdict]
- Category integrity: …
- Concrete vs vague: …
- Search clarity: …
- Watchpoints: …
- Deploy posture: [hold | clear]
```

## Homepage

**Unchanged** in this pass — no new homepage H1/meta unless Tree approves later with evidence.
