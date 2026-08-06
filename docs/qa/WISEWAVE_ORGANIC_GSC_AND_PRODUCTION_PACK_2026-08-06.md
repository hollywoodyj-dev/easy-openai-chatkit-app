# Wisewave — Organic identity + on-site behaviour pack

**To:** Wisewave  
**From:** Nova + steward  
**Date:** 2026-08-06  

**Purpose:** Answer *how Google is starting to understand Wisewave* (organic Search), plus what people do after they arrive (production). Paid Ads are referenced only as contrast; full Ads packs live separately.

| Layer | Source | Window |
|-------|--------|--------|
| Organic Search | Google Search Console export `wisewave.io-Performance-on-Search-2026-08-06` | Last 3 months · Web · ~5 May – 4 Aug 2026 |
| On-site behaviour | Production `MarketingConversionEvent` | ~90d pull 2026-08-06T13:19Z |
| Paid Ads (contrast) | Steward Ads screenshots | See linked packs below |

---

## Summary for Wisewave (read this first)

### The question you care about

Not “how many clicks today,” but: **what language is Google already associating with Wisewave?**

### Organic answer (Search Console)

Over ~3 months of **Web** Search:

| Metric | Value |
|--------|------:|
| Total clicks | **6** |
| Total impressions | **498** |
| CTR | **~1.2%** |
| Avg. position (impression-weighted) | **~12.1** |

**Query language is still mostly brand + near-brand**, not a settled category entity:

- Dominant query: **`wisewave`** (1 click / **141** impressions / pos ~7.2)  
- Meaning-adjacent: **`quiet reflection meaning`** (45 impr., no clicks, pos ~11)  
- Category phrases present but **weak and deep**: `self reflection app`, `reflection app`, `reflective ai`, `ai reflection tool` — impressions in single digits to teens, positions often **page 3–8**  
- Only **26 queries** appear in GSC (not a truncated “top 50” — that is the full set with data)

**Pages Google shows:** homepage carries almost all organic clicks (4/6). SEO landings (`/reflection-without-advice`, `/reflection-ai`, `/self-reflection-app`, `/journaling-alternative`, `/quiet-reflection`) earn **impressions without clicks**.

**Countries:** impressions led by **US** (154), then **AU** (90), **India** (46). Organic geography is broader than the AU-only self-reflection Ads campaign.

### Discover

**Not filled yet — and should not be forced from this export.**  
Discover is a different surface; it typically needs sustained **social / off-site distribution** (shares, mentions, publishers), which Wisewave has **not** built yet. Search appearance export is **empty**. Treat Discover as **out of scope until social/distribution exists** — not as a missing CSV.

### On-site answer (production)

After arrival (paid + organic + direct mixed; attribution often null):

- Instrumented traffic is dominated by **homepage** and **paid LPs** (`/lp/ai-reflection`, `/lp/self-reflection-app`), not by organic SEO URLs.  
- Funnel shows **activation works when people enter** (`first_reflection_*` high vs signups — includes anon/internal; read carefully).  
- **Retention thin:** `day_7_return` = 2 · **no** `subscription_completed` in the 90d event set.

### One-line synthesis

**Google mostly knows the brand name “Wisewave,” is tentatively showing “quiet reflection” and category landings, but has not yet crowned Wisewave as a clear Search category.** Paid Ads (especially AI Reflection) teach auction language faster than organic currently proves. Discover waits on social.

---

## 1. Google Search Console — Performance

**Filters:** Search type = **Web** · Date = **Last 3 months**  
**Source folder:** `Downloads/wisewave.io-Performance-on-Search-2026-08-06/`

### 1.1 Totals (from `Chart.csv`)

| Metric | Value |
|--------|------:|
| Days in chart | 92 (2026-05-05 → 2026-08-04) |
| Clicks | **6** |
| Impressions | **498** |
| CTR | **1.20%** |
| Avg. position (impr.-weighted) | **~12.09** |

Daily clicks are rare (single clicks on a handful of days). Impressions are low but non-zero most days.

### 1.2 Queries — all rows GSC returned (**26**, not 50)

*There is no missing “top 50” file. Organic query volume is simply small.*

| Query | Clicks | Impr. | CTR | Position |
|-------|-------:|------:|----:|---------:|
| wisewave | 1 | 141 | 0.71% | 7.18 |
| quiet reflection meaning | 0 | 45 | 0% | 11.33 |
| self reflection app | 0 | 13 | 0% | 41.46 |
| quiet reflection | 0 | 7 | 0% | 34.14 |
| wise wave | 0 | 6 | 0% | 18.67 |
| reflection app | 0 | 5 | 0% | 29 |
| reflect wave | 0 | 3 | 0% | 48.33 |
| self guidance | 0 | 3 | 0% | 62.67 |
| app reflection | 0 | 2 | 0% | 26 |
| whisperwave | 0 | 2 | 0% | 40 |
| sensewave | 0 | 2 | 0% | 43.5 |
| self-guidance | 0 | 2 | 0% | 57 |
| wise waves | 0 | 1 | 0% | 2 |
| reflection application | 0 | 1 | 0% | 29 |
| reflection ia | 0 | 1 | 0% | 29 |
| reflectionapp | 0 | 1 | 0% | 29 |
| thinkwaves | 0 | 1 | 0% | 29 |
| reflection apps | 0 | 1 | 0% | 32 |
| yikeswave | 0 | 1 | 0% | 33 |
| reflective ai | 0 | 1 | 0% | 36 |
| what is reflectionwave co limited subscription payment | 0 | 1 | 0% | 40 |
| wave by wave | 0 | 1 | 0% | 42 |
| ai reflection tool | 0 | 1 | 0% | 46 |
| what is reflection eraser app | 0 | 1 | 0% | 56 |
| self reflection apps | 0 | 1 | 0% | 65 |
| reflection writer ai | 0 | 1 | 0% | 82 |

**Read for Wisewave**

| Cluster | Examples | Signal |
|---------|----------|--------|
| Brand | wisewave, wise wave, wise waves | Strongest organic; still mid-page avg for brand |
| Quiet / meaning | quiet reflection meaning, quiet reflection | Early semantic adjacency — worth watching |
| Category (weak) | self reflection app, reflection app, reflective ai, ai reflection tool | Present, deep rankings, almost no clicks |
| Noise / confusion | whisperwave, sensewave, yikeswave, reflection eraser… | Brand collisions / unrelated |

### 1.3 Pages

| Page | Clicks | Impr. | CTR | Position |
|------|-------:|------:|----:|---------:|
| `/` | 4 | 299 | 1.34% | 7.59 |
| `/faq` | 1 | 47 | 2.13% | 10 |
| `/subscribe` | 1 | 11 | 9.09% | 3.09 |
| `/quiet-reflection` | 0 | 92 | 0% | 11.57 |
| `/self-reflection-app` | 0 | 79 | 0% | 18.53 |
| `/reflection-without-advice` | 0 | 69 | 0% | 8.93 |
| `/reflection-ai` | 0 | 52 | 0% | 13 |
| `/who-its-for` | 0 | 44 | 0% | 11.98 |
| `/journaling-alternative` | 0 | 22 | 0% | 6 |
| `/why-people-come-back` | 0 | 12 | 0% | 5.67 |
| `/self-reflection-without-guidance` | 0 | 11 | 0% | 32.36 |
| `/what-ai-reflection-without-advice-means` | 0 | 9 | 0% | 4.78 |
| `/what-it-is-not` | 0 | 7 | 0% | 6 |
| `/reflection-without-advice-vs-coaching` | 0 | 7 | 0% | 6.14 |
| `/about/founder-note` | 0 | 4 | 0% | 7.25 |
| `/how-it-works` | 0 | 4 | 0% | 7.25 |
| `/login?from=nav` | 0 | 4 | 0% | 7.25 |
| `/articles/how-to-ask-without-giving-away-your-knowing` | 0 | 2 | 0% | 1 |
| `/login?from=article-how-to-ask` | 0 | 1 | 0% | 5 |
| `/articles/dont-come-with-a-question` | 0 | 1 | 0% | 11 |

**Organic SEO landings are being indexed and shown; they are not yet converting impressions to clicks.** Relatively better positions (no clicks yet): `/journaling-alternative` (~6), `/why-people-come-back` (~5.7), `/what-ai-reflection-without-advice-means` (~4.8), `/reflection-without-advice` (~8.9).

### 1.4 Countries (top + note)

| Country | Clicks | Impr. | CTR | Position |
|---------|-------:|------:|----:|---------:|
| United States | 3 | 154 | 1.95% | 15.56 |
| Australia | 1 | 90 | 1.11% | 5.41 |
| India | 1 | 46 | 2.17% | 7.17 |
| Philippines | 1 | 14 | 7.14% | 7.36 |
| Canada | 0 | 27 | 0% | 7.85 |
| United Kingdom | 0 | 21 | 0% | 14.29 |
| Germany | 0 | 14 | 0% | 10.79 |
| China | 0 | 13 | 0% | 8.38 |

Full country list is in the export (50+ rows). **AU ranks better on average position than US**, but US has more impressions.

### 1.5 Devices

| Device | Clicks | Impr. | CTR | Position |
|--------|-------:|------:|----:|---------:|
| Mobile | 4 | 162 | 2.47% | 7.14 |
| Desktop | 1 | 329 | 0.30% | 14.61 |
| Tablet | 1 | 7 | 14.29% | 8.29 |

Desktop gets more impressions; **mobile converts the few organic clicks**.

### 1.6 Search appearance & Discover

| Surface | Status |
|---------|--------|
| Search appearance (`Search appearance.csv`) | **Empty** — no rich-result rows in this window |
| Discover | **Not in this Web export** · **Not ready to fill** — Discover depends on social / distribution Wisewave has **not** run yet |

**Steward / Nova note:** Do not treat empty Discover as a product failure. It is a **distribution prerequisite**, not a Search Console checkbox.

---

## 2. Production on-site behaviour (~90 days)

**Pulled:** 2026-08-06 via production DB (`MarketingConversionEvent`)  
**Event span:** earliest 2026-05-27 · latest 2026-08-06 · **2160** events total  

This is **site behaviour after arrival** (paid + organic + direct + testing mixed). It is **not** organic query language.

### 2.1 Funnel events (90d)

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
| subscription_completed | **0** (absent) |

**Caveats**

- `first_reflection_*` ≫ `signup_completed` — includes anonymous / repeat / internal; do not read as 245 new paid users.  
- Steward/QA traffic pollutes views.  
- Many events have `source: null` — organic vs paid often not attributed in DB.

### 2.2 Last 30d (selected)

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

### 2.3 Instrumented page_views (90d)

| Path | Count |
|------|------:|
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

### 2.4 Organic GSC pages vs production page_views

| URL (organic SEO) | GSC impr. (3mo) | Prod page_view (90d) |
|-------------------|----------------:|---------------------:|
| `/` | 299 | 284 |
| `/reflection-without-advice` | 69 | 7 |
| `/reflection-ai` | 52 | 3 |
| `/self-reflection-app` | 79 | 1 |
| `/journaling-alternative` | 22 | 1 |
| `/lp/ai-reflection` (paid, noindex) | — | **156** |
| `/lp/self-reflection-app` (paid) | — | **89** |

**Read:** Google is *showing* organic SEO URLs in search; **human traffic on-site is still mostly homepage + paid LPs**. Organic landings are not yet a traffic engine.

### 2.5 Paid LP / ad-group tags (90d, production)

| LP | Tagged events | adGroup | Tagged events |
|----|--------------:|---------|--------------:|
| ai-reflection | 262 | ag2_ai_reflection | 208 |
| self-reflection-app | 126 | ag1_self_reflection_app | 107 |
| reflection-without-advice | 30 | ag3_reflection_without_advice | 30 |

### 2.6 New accounts (90d)

- **18** `User` rows created  
- Country almost unused (1 AU · 17 null) — **not** a traffic geography proxy (use GSC Countries instead)

---

## 3. Paid Ads contrast (pointer only)

Full detail already packaged:

- AI Reflection 90d + 14d: `docs/qa/WISEWAVE_ADS_AI_REFLECTION_90D_2026-08-06.md`  
- Self-reflection / reflection-app group + have/missing: `docs/qa/WISEWAVE_SEARCH_ADS_DATA_HAVE_VS_MISSING_2026-08-06.md`

**Contrast in one line:** Paid AI Reflection auction language is already thick with “reflection AI / AI reflection”; **organic GSC is still brand-led and thin.** Paid is teaching the auction; organic has not yet proven the same entity.

Rough paid 90d (both campaigns): ~84 clicks · ~$358 · ~2.8k impressions — an order of magnitude more *paid* clicks than *organic* clicks (6) in a similar period.

---

## 4. What is intentionally not filled

| Item | Status |
|------|--------|
| Discover | **Deferred** — needs social / distribution; not started |
| Search appearance rows | Empty now — OK |
| Top 50 queries | Only **26** exist — complete for current volume |
| Social media content calendar | Out of scope for this pack |

---

## 5. Suggested 3–6 month SEO direction (Nova framing for Wisewave — not a Tree lock)

Evidence-only prompts for Wisewave’s judgment:

1. **Defend brand** — `wisewave` already has the impression mass; improve brand CTR/position carefully without diluting identity.  
2. **Watch “quiet reflection”** — early semantic adjacency; expand only if Wisewave/Aurora approve language.  
3. **Category landings have impression footholds but no clicks** — `/reflection-without-advice`, `/reflection-ai`, `/self-reflection-app`, `/journaling-alternative` are candidates for quality/depth, not paid-style volume chasing.  
4. **Do not confuse paid “reflection AI” density with organic proof** — keep layers separate in narrative.  
5. **Discover later** — after real social/distribution, not before.

---

## 6. One paragraph Wisewave can use

In the last three months of organic Web Search, Wisewave earned 6 clicks and 498 impressions: Google mostly recognises the brand name, shows early “quiet reflection” adjacency, and indexes category landings that receive impressions but almost no clicks. Discover is empty by design until social distribution exists. On-site production data shows arrival still concentrated on homepage and paid LPs, with thin day-7 return and no subscription completions in the event set — so the binding growth question remains category recognition and return, not Discover checkboxes.
