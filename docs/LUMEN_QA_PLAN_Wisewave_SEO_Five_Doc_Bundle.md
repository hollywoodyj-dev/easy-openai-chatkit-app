# Lumen QA plan — Wisewave SEO bundle (five-doc implementation)

**Purpose:** Give Lumen a single, executable pass for the work tied to the five Wisewave external-copy / SEO documents, without re-opening strategy inside the QA session.

**Scope (what this QA covers):**

| Doc | Role in bundle | What to verify in product |
|-----|----------------|---------------------------|
| `NOVA_WEBSITE_COPY_IMPLEMENTATION_RULES_v1` (1/5) | English rules | Category integrity, tone, CTA pressure, no banned framings site-wide in scope |
| 中文摘要 (2/5) | Operator mirror of 1/5 | Same checks; language is EN site — use as checklist reminder only |
| `WISEWAVE_FAQ_BOUNDARY_LINES_v1` (3/5) | FAQ defaults | `/faq` answers = boundary set + no promise expansion |
| `WISEWAVE_SEO_LANDING_PAGES_v1` (4/5) | SEO page copy | Four routes: copy, structure, FAQ on page, internal links |
| Nova 页面制作指令 (5/5) | Build spec | Layout calm, no funnel widgets, CTA + links present, no duplicate “growth” pages |

**Out of scope for this plan (unless Tree expands):** `/chat` behavior, model drift, subscription flows — unless a marketing page links there and the link is wrong.

---

## 0. Preconditions

- [ ] Know the **hosted base URL** (production or preview) for the build under test.
- [ ] Confirm Git includes: homepage copy module (if applicable), **four SEO landings**, **FAQ** update, **footer Topics** row.
- [ ] Browser: desktop + one mobile width (375px) for accordion and line lengths.

---

## 1. Category integrity (Aurora-aligned)

Use **§9 red flags** and **§10 copy acceptance** from `NOVA_WEBSITE_COPY_IMPLEMENTATION_RULES_v1` as mental rubric.

**Routes to walk in order:** `/` → `/reflection-ai` → `/reflection-without-advice` → `/self-reflection-app` → `/journaling-alternative` → `/faq` → scroll **footer** Topics.

For **each** page, quick check:

1. [ ] Does **nothing** read as coach, therapy-lite, companion, emotional support product, productivity optimizer, or generic AI journaling pitch?
2. [ ] Are **bridge terms** (e.g. “reflection app”, “AI for reflection”) immediately bounded by **what it is not** or **what it does not do**?
3. [ ] Is **low presence** and **user authorship** still legible (system does not “take over” or “know you deeply”)?
4. [ ] **CTAs** calm (no transform / unlock / heal / journey language)?

**Verdict note:** `PASS` / `PASS WITH WATCHPOINTS` / `REVISE` with file + section reference for any `REVISE` item.

---

## 2. Page-by-page checklist (SEO landings)

### `/reflection-ai`

- [ ] Title / meta / H1 match intent (reflection AI **without** advice-coaching-companion framing).
- [ ] Body sections: “more active AI” vs “less” reads as **category clarification**, not competitor attack.
- [ ] FAQ block: four questions present; answers short; no new capabilities.
- [ ] Closing block: **Begin here** + **Expectations** + **Homepage** + link to **`/reflection-without-advice`**.

### `/reflection-without-advice`

- [ ] Tone: space vs advice, **not** anti-help rant or life-coaching philosophy drift.
- [ ] FAQ includes emotional-support boundary question; answer stays cold-boundary, not warm support.
- [ ] Internal link to **`/reflection-ai`**.

### `/self-reflection-app`

- [ ] No habit / journey / “better self” product story.
- [ ] “What you receive” stays **low-claim** (clarity / noise / not take over / low presence).
- [ ] Internal link to **`/journaling-alternative`**.

### `/journaling-alternative`

- [ ] Does not claim to **replace all journaling** or “best journaling app”.
- [ ] “Not a coach, not a companion” list present; role line stays small.
- [ ] Internal link to **`/self-reflection-app`**.

---

## 3. Homepage + global chrome (if in scope for same release)

- [ ] Homepage (if touched in same bundle): still matches **approved** EN calibration; no new hype blocks.
- [ ] **Footer → Topics:** four links resolve; no 404; labels match page intent.

---

## 4. FAQ (`/faq`)

- [ ] First-open accordion item (default open) is acceptable as first-read (currently **AI journal** boundary — confirm that is still the desired lead).
- [ ] All **primary + secondary** boundary lines from `WISEWAVE_FAQ_BOUNDARY_LINES_v1` appear and match approved wording (allow trivial punctuation only).
- [ ] **Crisis** answer: still clearly **not** Wisewave scope; points to **emergency services + qualified human professional** (no “we’re here for you” tone).
- [ ] Data answer still only **points** to Privacy / policy — no new data promises.

---

## 5. Experiential tone (Wisewave-aligned, when needed)

- [ ] Copy feels **restrained** and **readable**, not defensive wall-of-negatives.
- [ ] No line sounds **eager to prove value** (rules doc: if it sounds eager, flag).

---

## 6. Verdict rubric

| Verdict | When |
|--------|------|
| **PASS** | Category clear on all targeted routes; FAQ + crisis OK; no material drift |
| **PASS WITH WATCHPOINTS** | Minor wording, order, or mobile layout — ship OK with listed follow-ups |
| **REVISE** | Any coaching/therapy/companion drift, missing crisis boundary, or CTA that reads conversion-heavy |

**Deliverable from Lumen:** Short markdown or email: verdict + bullet watchpoints + `REVISE` items with page + section.

---

## 7. Search engine processing (for Tree / Nova ops — not Lumen copy QA)

Implementation already includes per-page **`metadata`** (title, description) and **`alternates.canonical`** on the four SEO routes and `/faq`. That helps crawlers understand preferred URL and snippets.

**Recommended post-QA / pre-“SEO live” steps (processing pipeline):**

1. **Sitemap**  
   - [ ] Add or update an **`app/sitemap.ts`** (Next.js metadata route) so **`/reflection-ai`**, **`/self-reflection-app`**, **`/reflection-without-advice`**, **`/journaling-alternative`**, and **`/faq`** are listed with sensible `lastModified` / priority if you use them.  
   - *Current gap:* repo may not yet expose a sitemap that includes these URLs — confirm in code; if missing, Nova should add it so engines can **discover** URLs reliably.

2. **Robots**  
   - [ ] If you use **`app/robots.ts`**, confirm marketing routes are **allowed** (`allow: /`) for the host that should rank; internal tools stay `noindex` as today.

3. **Search Console (Google) / Webmaster tools**  
   - [ ] Submit **sitemap URL** after deploy.  
   - [ ] **URL Inspection** on each new landing once, to confirm “URL is on Google” / no critical crawl errors (optional but useful).

4. **Bing Webmaster Tools** (if you care about Bing)  
   - [ ] Same sitemap submit + spot-check.

5. **Do not rely on** automatic “ranking” steps — engines index on their own schedule; QA validates **eligibility and truth**, not rank.

6. **Optional later (not required for v1):** `openGraph` / `twitter` metadata on SEO pages for share cards; **JSON-LD** FAQ schema only if Tree wants rich results — must match visible FAQ exactly to avoid policy mismatch.

**Who does what:** Lumen **QA plan sections 0–6** (product + copy). **Section 7** is **Tree/Nova deployment/SEO ops** after Lumen passes category QA.

---

## 8. Handoff line for Tree

After Lumen verdict: if **PASS** or **PASS WITH WATCHPOINTS**, Tree can schedule **sitemap + GSC** (§7) in the same release window as copy approval, so “SEO bundle” is both **true in UI** and **discoverable to crawlers**.

---

## 9. Lumen results (hosted) — 2026-05-02

**Host:** `https://www.wisewave.io/`  
**Scope reviewed:** §§0–6 only (per Lumen)  
**Verdict:** **PASS WITH WATCHPOINTS**

**Routes checked:** `/`, `/reflection-ai`, `/reflection-without-advice`, `/self-reflection-app`, `/journaling-alternative`, `/faq`

**Passed:** All routes resolved; category integrity intact (no coaching, therapy-lite, companion, productivity-optimizer, or generic AI journaling pitch); bridge terms bounded; low-presence and authorship legible; calm CTAs; per-route structure, FAQs, and internal links as specified; homepage + footer Topics row; FAQ default item and crisis/data lines acceptable.

**Watchpoints:** None material; minor follow-up territory only (Lumen).

**§7 ops:** Tree may submit `https://www.wisewave.io/sitemap.xml` in Search Console after deploy — **Nova shipped** `app/sitemap.ts` + `app/robots.ts` (2026-05-02) so sitemap/robots are live with the marketing + SEO URL set.

**Canonical consolidation (Bing dedupe — Lumen 2026):** **`/reflection-is-not-advice`** is no longer a separate indexable page; it **301 redirects** to **`/reflection-without-advice`** (`next.config.ts`), is **removed from `sitemap.ts`**, and footer links target **`/reflection-without-advice`** only. Re-submit target URL via IndexNow after deploy if using IndexNow.

---

*Prepared for Lumen — Wisewave public site / SEO five-doc bundle.*
