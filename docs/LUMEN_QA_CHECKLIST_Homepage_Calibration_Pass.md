# LUMEN_QA_CHECKLIST — Homepage Calibration Pass

**Task:** Aurora Task 1 homepage calibration QA  
**Owner:** Lumen  
**Implementation owner:** Nova  
**Status:** QA checklist ready (aligned to shipped `main`)  
**Mode:** Clarity improvement without category drift  

---

## 0. What Nova already shipped (Lumen context — you did not receive Tree/Aurora source docs)

Use this as the **implementation baseline** for QA. Source stack: Wisewave Website Build Spec v1.0 + Nova Execution Addendum v1.1 + Aurora Task 1 + Tree handoff 2/2 + Homepage Audience Mapping brief.

| Area | Location in repo |
|------|-------------------|
| Marketing shell | `app/(wisewave-site)/layout.tsx` — Inter, neutral palette, header/footer (does **not** wrap `/chat` or embeds). |
| Homepage | `app/(wisewave-site)/page.tsx` |
| Site chrome | `components/wisewave-site/*` (Header, Footer, Section, SampleInteraction, TrackButton, AnalyticsView, …) |
| Analytics | `lib/wisewave-analytics.ts` — `gtag` / `dataLayer` when present; `section_view` with `{ section }`; CTA events with `location` where applicable. |

**Routes shipped:** `/`, `/start`, `/what-is-wisewave`, `/how-it-works`, `/who-its-for`, `/what-it-is-not`, `/reflection-without-advice` (canonical; **`/reflection-is-not-advice`** redirects here), `/faq`, `/privacy` (overview + link to `/legal/privacy`), `/terms`.

**Homepage flow:** Hero → **What you receive** → supporting sections (steps back, not assistant, how it works, sample interaction, fit / non-fit, differences, boundaries) → **Before you begin** → **final CTA** block.

**Known deviations from Tree 2/2 “hero-only” copy list (intentional unless Tree says otherwise):**

1. **Extra hero line (v1.1 addendum, not in Tree 2/2):** *“You do not need to follow anything here.”* — assess for authorship vs clutter.
2. **Final CTA row:** Secondary button is **“See whether it fits you”** → `/who-its-for` (not “See example openings”). Hero secondary remains **See example openings** → `#sample-openings`.
3. **Qualification line** is typographically **subordinate** (`text-xs`, muted) to the micro-support line per audience-mapping brief (still same approved words).
4. **“What you receive”** uses a **light** section treatment (top border + column, not a heavy marketing card).

**Recent commits (homepage track):** `feat(site): Wisewave marketing pages…` (`2e05dde`), `fix(site): audience-mapping…` (`2a86da3`).

---

## 1. QA objective

Validate that the homepage calibration pass improves first-time understanding **without** shifting Wisewave into assistant / therapy / coaching / companion territory.

This QA is not primarily about visual polish. It is about:

- category integrity  
- clarity gain  
- trust visibility  
- restraint preservation  

---

## 2. Core QA question

After this pass, does the homepage make Wisewave easier to understand **without** making it feel more like something familiar and misleading?

If no, fail or revise.

---

## 3. Approved implementation baseline (verify on `/`)

Lumen should verify the implementation against this baseline.

### Hero

- Headline: **Not here to give you answers**
- Subheadline: **Wisewave doesn’t guide, advise, or fix you. It reflects — so you can see more clearly for yourself.** (straight apostrophe in UI is acceptable if typography normalizes.)
- Support line: **No advice. No coaching. No direction. Just a quieter space to think.**
- Primary CTA: **Enter Wisewave** → `/start?from=home` (then `/start` → `/chat` after expectation copy)
- Secondary CTA: **See example openings** → in-page anchor `#sample-openings`
- Micro-support line: **You can begin with anything — even something unclear.**
- Qualification line: **Useful when you feel crowded inside — not when you need instructions.**

**Optional line to evaluate (§0):** *You do not need to follow anything here.*

### Positive-value block

- Title: **What you receive**
- Body: **A little more clarity.** / **A little less inner noise.** / **A space that does not take over.**
- Closing line: **Sometimes that small shift is enough.**

### Trust layer

- Title: **Before you begin**
- Body explaining conversation handling, privacy, account / subscription access before entering (same meaning as shipped paragraph).
- Visible links: **Privacy** (`/privacy`), **Conversation handling** (`/legal/privacy`), **Account & subscription** (`/account`), **Support** (mailto).
- Boundary line: **Wisewave is not crisis or emergency support.**

---

## 4. Pass criteria

Lumen should pass only if all of the following are true:

1. The homepage is clearer on first read  
2. The category boundary remains intact  
3. The positive-value block adds understanding without softness drift  
4. The CTA hierarchy is cleaner (hero **and** final block — primary dominates in each)  
5. The qualification line improves self-selection  
6. The trust layer is easier to find (before final CTA block on long homepage)  
7. The page still feels restrained and low-pressure  
8. The page does not feel more system-heavy after the additions  

---

## 5. Specific QA checks

### A. Hero integrity

Check:

- headline unchanged or meaning-preserved exactly  
- no new assistant/helpfulness framing  
- no added therapeutic softness  
- no coaching or guidance implication  
- no broadened promise  
- optional v1.1 line (§0): does it sharpen authorship or add noise?

Fail if:

- headline becomes more generic, more helpful, or more self-improvement-coded  
- subheadline starts sounding like support, healing, or emotional care  
- support line sounds comforting in a sticky way instead of restrained  

---

### B. CTA hierarchy

Check:

- **Enter Wisewave** is clearly primary (filled, larger padding) in **hero**  
- **See example openings** is clearly secondary (outline, lighter) in **hero**  
- user can understand the difference between them immediately  
- **final CTA block:** primary again dominant; note secondary is **fit** link, not second “openings” tour  

Fail if:

- both CTAs feel equal in either cluster  
- secondary CTA competes visually with entry  
- secondary CTA feels like product-tour marketing  
- CTA area creates decision clutter  

---

### C. Qualification line

Check:

- line is visible enough to help right-fit users self-select  
- line does not dominate hero (intended: smaller type than micro-support)  
- line reduces task-driven misread  

Fail if:

- line feels cold, exclusionary, or scolding  
- line is so subtle it has no filtering function  
- line introduces therapy-like framing  

---

### D. Positive-value block

Check:

- block appears early enough to matter (directly after hero)  
- it clarifies what the user receives  
- it stays light and non-claiming  
- it does not sound therapeutic, healing, or emotionally dependent  
- removal test (§7): does it add more clarity than “system presence”?  

Fail if:

- block makes Wisewave sound like emotional support  
- block becomes vague spiritual mood language  
- block feels inflated relative to the rest of the page  
- block adds softness without clarity  

---

### E. Trust layer

Check:

- trust layer is visible before final commitment scroll (near final CTA)  
- privacy / conversation handling / account-support links are easy to find  
- crisis boundary is visible but not alarming  
- trust content supports confidence without adding institutional heaviness  

Fail if:

- trust layer is hidden or hard to find  
- trust layer becomes dense / legal / intimidating  
- crisis language dominates the emotional feel  
- support links look like an afterthought  

---

### F. Overall page feel

Check:

- page still feels calm  
- page still feels restrained  
- page still feels non-guiding  
- added blocks do not make the page feel more marketed  

Fail if:

- page feels more optimized than clarified  
- page feels like a polished conversion page  
- page feels emotionally persuasive  
- page gains “AI product” energy instead of reflective clarity  

---

## 6. Misunderstanding-risk QA

Lumen should test whether the page still triggers these likely readings:

### Level 0 risk

- “So this is basically a chatbot?”  
- “It gives advice, just more gently?”  

### Level 1 risk

- “This sounds healing.”  
- “This feels like emotional support.”  

### Level 2 target

- “It seems to give space instead of direction.”  

### Level 3 target

- “It helps me see more clearly without taking over.”  

Pass posture:

- Level 0 / Level 1 interpretations should be reduced  
- Level 2 / Level 3 interpretations should become easier  

---

## 7. Removal test

Lumen should apply a simple removal test:

- If the new block is removed, does clarity materially drop?  
- If the new block is present, does system presence materially rise?  

Interpretation:

- keep only additions that increase clarity more than they increase presence  
- if a block makes the page heavier than it makes it clearer, recommend revise or remove  

This is especially important for:

- positive-value block  
- qualification line  
- trust layer  
- optional hero line (§0)  

---

## 8. QA verdict states

Lumen should return one of four states:

### PASS

Implementation improves clarity and preserves category integrity.

### PASS WITH WATCHPOINTS

Implementation is acceptable, but one or two elements need observation after release.

### REVISE

Implementation is directionally right but still creates drift, clutter, or weight.

### FAIL

Implementation breaks category boundary, increases presence too much, or introduces misleading framing.

---

## 9. Required Lumen return format

### Verdict

PASS / PASS WITH WATCHPOINTS / REVISE / FAIL

### What improved

What became clearer?

### What still risks drift

Which line, block, or visual treatment still risks misunderstanding?

### Watchpoints

What should Tree observe after release?

### Recommended action

Approve / adjust / remove / rework  

---

## 10. One-line Lumen QA truth

**The homepage passes only if it becomes easier to understand without becoming easier to misread.**

---

## 11. Optional follow-ups (not blocking QA of copy baseline)

- **Qualified reflective start rate** ( `/start` view + enter + ≥1 message in `/chat` ) — analytics product follow-up; not fully instrumented server-side in this pass.  
- **Sample interaction block** — uses restrained labels (“Your words” / “Reflective return”) + monospace on reflective line; confirm it does not read as chat-app / companion UI.

---

## 12. Lumen QA result (2026-04-18) — hosted `/`

**Verdict:** PASS WITH WATCHPOINTS  

### What improved

- First-read clarity is materially stronger. The hero states quickly what Wisewave is not; the boundary holds through the rest of the page.  
- **CTA hierarchy** is clean in both places: hero primary = Enter Wisewave, hero secondary = See example openings; final primary still clearly dominates; final secondary **See whether it fits you** works as a lower-pressure qualification path.  
- **Qualification line** helps self-selection without taking over the hero; subordinate treatment is directionally right.  
- **What you receive** adds usable orientation without becoming a benefits pitch or therapeutic promise.  
- **Before you begin** is visible before the final commitment point; links are easy to find; crisis boundary is present without feeling alarmist.  
- Overall the page reads more like a restrained category explanation and less like a generic AI landing page.  

### What still risks drift

- Optional hero line *“You do not need to follow anything here.”* — acceptable and supports authorship/restraint, but adds a little extra voice pressure; most removable line in the hero if Tree wants one trim.  
- Mid-page supporting sections (*When many systems become more active…*, broader restraint/boundaries/difference blocks) do not break category integrity but are where the page gets **heaviest**.  
- **Sample interaction** — ongoing watch so it keeps reading as reflective separation, not soft advice / chatbot guidance.  

### Watchpoints

- Misread of optional hero line as extra conceptual framing vs useful reassurance.  
- Whether mid-page explanatory sections make the product feel slightly more “defined by doctrine” than necessary.  
- Whether **What you receive** stays light in future edits (no benefit inflation or emotional-support language).  
- Whether the **final CTA** block stays clearly secondary-to-entry vs becoming another conversion cluster.  

### Recommended action

**Approve, with watchpoints.** No blocking drift on hosted `/`. If Tree wants one further polish pass, cleanest candidate: **reconsider or trim the optional hero line** before touching anything else.
