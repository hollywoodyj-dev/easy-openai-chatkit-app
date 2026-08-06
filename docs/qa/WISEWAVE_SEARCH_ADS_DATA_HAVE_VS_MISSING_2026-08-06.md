# Wisewave — Search / discovery data pack (Nova production pull + console gaps)

**Date:** 2026-08-06  
**For:** Wisewave (category understanding / SEO–discovery read)  
**From:** Nova (production DB) + steward fill-in from Google Search Console / Ads  
**Pulled at:** 2026-08-06T13:19:12Z via production `MarketingConversionEvent` (Prisma Accelerate)

---

## Important framing

Wisewave’s ask is **Google Search Console–shaped** (how Google *understands* Wisewave: queries, pages, countries, CTR, position).

What Nova can pull from production today is **on-site behaviour + paid LP attribution**, **not** Search Console organic search intelligence.

| Source | What it answers |
|--------|-----------------|
| **Search Console (missing — steward)** | What Google thinks Wisewave is; query language; organic reach |
| **Production DB (have — Nova)** | What people do after they arrive (pages, LP, funnel) |
| **Google Ads console (partial — steward)** | Paid clicks / spend / search terms (paid demand, not organic identity) |

**GA4 note:** measurement ID `G-XCZJHENLZ8` (property wisewave / 539278365). Treat GA4 history as reliable mainly from **2026-07-02** onward (stream fix). DB events below are the continuous record from **2026-05-27**.

---

## 0. Google Ads fill-in — campaign `wisewave reflection app` (self-reflection / “reflection app” group)

**Source:** Steward Ads Overview screenshots (2026-08-06)  
**Account:** Wisewave `117-803-6660`  
**Geo:** **Australia only** (steward confirmed; matches history after narrowing from AU+US)  
**Scope:** Paid auction language — not Search Console organic identity.

### 0A. Last 90 days — 9 May – 6 Aug 2026

| Metric | Value |
|--------|------:|
| Clicks | **22** |
| Impressions | **976** |
| CTR | **~2.25%** (ad card; summary tiles also imply ~2.25%) |
| Avg. CPC | **$4.67** |
| Cost | **$103** |
| Cost per “raw lead” | **A$18.19** |
| Raw lead rate | **22.6%** |
| Lead funnel | **22 → 4.00** conversions (Ads “raw leads” definition — verify mapping) |
| Avg. position | **not shown** |

**Volume shape:** Near-flat **May → early July**, then activity from **early July onward** (matches bid/serving history below — early period under-capped or recalibrating; later period actually enters auctions).

**Devices (90d):**

| | Cost | Impressions | Clicks |
|--|-----:|------------:|-------:|
| Mobile | 48.9% | 61.9% | 40.9% |
| Computers | 44.6% | 34.9% | **50.0%** |
| Tablets | 6.6% | 3.2% | 9.1% |

Mobile dominates impressions; **computers still win click share**.

**Keywords by cost (page 1 of 3):**

| Keyword | Clicks | CTR | Cost |
|---------|-------:|----:|-----:|
| `"self reflection tool"` | 14 | 2.84% | **A$76.40** (~74% of campaign spend) |
| `"personal reflection app"` | 5 | 1.59% | A$16.08 |
| `"self reflection apps"` | 2 | 1.94% | A$6.96 |
| `[reflection app]` | 1 | 4.55% | A$3.20 |
| `"daily reflection app"` | 0 | 0% | A$0 |

**Top search terms (page 1 of 9, by impressions) — journal / competitor leakage still dominant:**

journal prompts for self reflection · reflection app · reflection journal · self reflection journal · journaling app · smiling mind app · free journal app · rosebud app · how we feel app · daylio app · self reflective question · self reflection tools · daily reflection journal · best self reflection apps · self reflection journal prompts …

**Demographics (90d impressions):** strongest **Female 25–34**; also Female 18–24 / 35–44 and Male 25–34. (14d slice had skewed Female 45–54 — small-sample shift.)

**Creative:** same quiet / not-coaching ad → display URL `www.wisewave.io/self-reflection`.  
**Diagnostics:** still “limited by maximum bid limit”; optimisation score 76.2%.

### 0B. Last 14 days — 23 Jul – 5 Aug 2026 (subset)

| Metric | Value |
|--------|------:|
| Clicks | 3 |
| Impressions | 167 |
| CTR | 1.80% |
| Avg. CPC | $3.40 |
| Cost | $10.19 |

Recent window is **cheaper CPC / thinner volume** than the 90d average — consistent with a **lower max-bid steady state** after the early expensive period.

### 0C. Bid history (docs + steward note) — “we paid more at the beginning”

Confirmed in `docs/Wisewave_Paid_Search_Launch_v1_Nova_Implementation.md`:

| Phase | Cap / behaviour |
|-------|-----------------|
| Launch | **$1.50** max CPC → essentially **no serving** (below AU auction floor) |
| After lift | Cap **removed** → ~**$12** avg CPC (serving but too expensive) |
| Then | **$5** → **$3** (slow) → **~$3.50** steady state |
| AU floor (Nova read, Jul) | roughly **$3–$5** for this niche |
| Geo | Narrowed to **AU only** (from AU+US) |

90d **avg CPC $4.67** and early-graph quiet months → early uncapped / high-cap spend diluted into the average; recent 14d **$3.40** matches the deliberate lower cap. Google’s “limited by max bid” warning is the **known trade-off**, not a new defect.

Jul 2 doc snapshot for this group (then ~30d): avg CPC **$6.09** (explicitly “inflated by early uncapped week”); workhorse already `"self reflection tool"`.

### 0E. Sister campaign `wisewave-AI Reflection` (90d) — detailed pack for Wisewave

**Full markdown for Wisewave:** `docs/qa/WISEWAVE_ADS_AI_REFLECTION_90D_2026-08-06.md`  
**Window:** 9 May – 6 Aug 2026 · **Geo:** US + AU (US ~1,559 impr. on map tooltip)  
**Headline:** 62 clicks · ~1.8k impr. · $4.11 CPC · $255 · CTR ~3.44% · 12 Ads conversions shown  
**14-day slice:** steward sending next (not in that pack yet).

---

## 1. Performance (past 90 days) — Search Console shape

| Metric Wisewave wants | Status | Value / notes |
|----------------------|--------|---------------|
| Total Clicks (organic Search) | **MISSING — GSC** | Fill from Search Console → Performance → Search results → Last 90 days |
| Total Impressions | **MISSING — GSC** | Same |
| Average CTR | **MISSING — GSC** | Same |
| Average Position | **MISSING — GSC** | Same (UI may show “Average position” under Search appearance / performance filters) |

**Steward paste zone (from GSC Performance screenshot or export):**

```text
Window: Last 90 days
Total clicks:
Total impressions:
Average CTR:
Average position:
Date range shown:
Filters (Search type / country / device):
```

---

## 2. Queries — top 50 search terms

| Status | Notes |
|--------|--------|
| **MISSING — GSC** | Search Console → Performance → Queries → export top 50 |
| Not in production DB | We do **not** store organic search queries |
| Ads search terms (optional) | Google Ads → Insights / Search terms — **paid** language only; useful contrast, not organic identity |

**Steward paste zone:** attach CSV or list top 50 queries with clicks / impressions / CTR / position.

---

## 3. Pages — which URLs bring traffic

### A. Organic landing pages — **MISSING (GSC)**

Search Console → Performance → Pages → Last 90 days.

### B. On-site `page_view` paths — **HAVE (production, 90d)**

These are **instrumented site views**, not GSC organic landings. Testing / steward traffic may inflate counts.

| Path | page_view count (90d) |
|------|----------------------:|
| `/` | 284 |
| `/lp/ai-reflection` | 156 |
| `/lp/self-reflection-app` | 89 |
| `/start` | 44 |
| `/who-its-for` | 30 |
| `/lp/reflection-without-advice` | 30 |
| `/how-it-works` | 17 |
| `/what-it-is-not` | 16 |
| `/faq` | 14 |
| `/terms` | 10 |
| `/privacy` | 9 |
| `/reflection-without-advice` | 7 |
| `/articles/dont-come-with-a-question` | 3 |
| `/reflection-ai` | 3 |
| `/journaling-alternative` | 1 |
| `/self-reflection-app` | 1 |

**Read for Wisewave (site behaviour, not Google’s mental model):**

- Paid LPs dominate instrumented traffic after homepage: **AI Reflection** > **Self Reflection App** > **Reflection Without Advice**.
- Organic SEO landings (`/reflection-ai`, `/journaling-alternative`, `/self-reflection-app`, `/reflection-without-advice`) show **very low** `page_view` counts in DB — either low organic arrival, weak instrumentation coverage, or both. **GSC Pages will resolve this.**

---

## 4. Countries

| Status | What we have |
|--------|----------------|
| **GSC Countries** | **MISSING** — Search Console → Performance → Countries |
| **Ads geo** | **MISSING** — Google Ads → Locations (steward) |
| **Registered users (90d)** | Weak proxy only: **18** new `User` rows; country set on **1** (AU); **17** null |

Production does **not** store visitor country on `page_view`. Do not treat user.country as traffic geography.

---

## 5. Discover / Search appearance

| Status | Notes |
|--------|--------|
| **MISSING — GSC** | Performance → Search appearance (and Discover if available for the property) |
| Nova cannot infer | No Discover / rich-result inventory in DB |

---

## 6. What production *does* show (funnel / paid context, 90d)

Useful for Wisewave as **downstream behaviour**, not as the answer to “what Google thinks we are.”

### Event counts (90d)

| Event | Count |
|-------|------:|
| page_view | 714 |
| homepage_view | 283 |
| paid_landing_view | 272 |
| first_reflection_started | 245 |
| first_reflection_completed | 245 |
| web_cta_click | 96 |
| start_page_view | 44 |
| conversation_started | 36 |
| entry_type_detected | 36 |
| reflection_mode_selected | 35 |
| paid_landing_primary_cta_click | 33 |
| homepage_primary_cta_click | 32 |
| start_page_enter_click | 21 |
| signup_completed | 11 |
| conversation_abandoned_before_reflection | 11 |
| conversation_entered_reflection | 10 |
| reflection_started | 10 |
| reflection_depth_reached | 8 |
| paid_landing_secondary_cta_click | 7 |
| checkout_started | 6 |
| homepage_secondary_cta_click | 2 |
| day_7_return | 2 |
| slash_command_used | 1 |
| **subscription_completed** | **0** (not present) |

### Same funnel, last 30d (selected)

| Event | Count |
|-------|------:|
| page_view | 278 |
| homepage_view | 116 |
| paid_landing_view | 85 |
| first_reflection_started / completed | 237 / 237 |
| paid_landing_primary_cta_click | 20 |
| homepage_primary_cta_click | 19 |
| start_page_view | 28 |
| start_page_enter_click | 11 |
| signup_completed | 3 |
| day_7_return | 2 |
| checkout_started | 1 |

### Paid LP / ad-group tags on events (90d)

| LP slug | Tagged events |
|---------|--------------:|
| ai-reflection | 262 |
| self-reflection-app | 126 |
| reflection-without-advice | 30 |

| adGroup | Tagged events |
|---------|--------------:|
| ag2_ai_reflection | 208 |
| ag1_self_reflection_app | 107 |
| ag3_reflection_without_advice | 30 |

### Caveats (do not over-read)

1. **`first_reflection_*` ≫ `signup_completed`** — many reflections are anonymous / repeat / internal; not “245 new paid users.”
2. Steward / QA traffic pollutes `page_view` and LP views.
3. `source: null` on **1462** of events — ads-vs-organic often not attributed in DB.
4. **0** `subscription_completed` in this 90d event set.
5. Prior Ads narrative (Jul 2026): ~$40–50 per activated user historically, retention one-and-done; see `docs/Wisewave_Paid_Search_Launch_v1_Nova_Implementation.md`.

---

## 7. Checklist — what steward should pull from consoles

### Google Search Console (primary for Wisewave)

- [ ] Performance — last **90 days**: clicks, impressions, CTR, average position  
- [ ] Queries — top **50** (export)  
- [ ] Pages — top pages by clicks/impressions  
- [ ] Countries  
- [ ] Search appearance / Discover (if any rows)

### Google Ads (secondary — paid demand language)

- [ ] Last 90 days: clicks, impressions, CTR, cost, conversions  
- [ ] Search terms report (top terms)  
- [ ] Campaign / ad group split (AI Reflection vs Self Reflection vs Reflection Without Advice)  
- [ ] Locations (countries)

### Optional GA4 (post 2026-07-02)

- [ ] Traffic acquisition — organic vs paid  
- [ ] Landing page report — 90d  

---

## 8. Draft note to Wisewave (after steward fills GSC)

Use once GSC numbers are pasted above:

```text
Nova pulled production on-site behaviour (90d). Search Console organic Performance /
Queries / Pages / Countries / Discover are still the missing layer for “how Google
understands Wisewave.”

On-site: paid LPs (esp. AI Reflection) dominate instrumented traffic; organic SEO
URLs show thin page_view counts in our DB — GSC Pages will tell us whether Google
is already sending query traffic there or not.

What we need from you next is not a click-count celebration, but a read of the
query language: which category phrases Google is already associating with Wisewave,
and which pages are earning that association.
```

---

## 9. Nova limitation (honest)

Nova has **no Search Console API** wired in-repo and **no Ads API** pull in this pass.  
This pack = production marketing DB + gap list for console paste.

Temp pull artifact (local only, do not commit): `.tmp_prod_marketing_90d.json`
