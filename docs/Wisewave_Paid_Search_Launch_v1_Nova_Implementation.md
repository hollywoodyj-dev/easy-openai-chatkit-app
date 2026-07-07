# Wisewave Paid Search Launch v1 — Nova implementation (Option B)

**Status:** Code ready for deploy + Google Ads paste  
**SEO rule:** Organic URLs unchanged. Paid traffic uses **`/lp/*` only** (`noindex`, excluded from sitemap, `robots.txt` disallow `/lp/`).

---

## Landing page map (use in Google Ads)

| Ad group | Final URL (production) |
|----------|-------------------------|
| Self Reflection App | `https://www.wisewave.io/lp/self-reflection-app` |
| AI Reflection | `https://www.wisewave.io/lp/ai-reflection` |
| Reflection Without Advice | `https://www.wisewave.io/lp/reflection-without-advice` |

**Optional UTM template (append to each final URL):**

```text
?utm_source=google&utm_medium=cpc&utm_campaign=wisewave_search_intent_test_v1&utm_content={ad_group}
```

Replace `{ad_group}` with e.g. `ag1_self_reflection_app`.

**Brief alias:** `/ai-reflection-tool` → **302** to `/lp/ai-reflection` (if old links used).

---

## Organic SEO (unchanged)

| Intent | Indexed URL | Paid URL |
|--------|-------------|----------|
| Self reflection app | `/self-reflection-app` | `/lp/self-reflection-app` |
| AI reflection | `/reflection-ai` | `/lp/ai-reflection` |
| Reflection without advice | `/reflection-without-advice` | `/lp/reflection-without-advice` |

Do **not** point Google Ads at organic paths for this test.

---

## Paid page behavior

Each `/lp/*` page answers above the fold:

1. What is Wisewave?  
2. What is it not?  
3. How do I begin?  
4. Why use it now?

**Primary CTA:** Start a reflection in your browser → `/start?from=paid_lp&lp={slug}`  
**Secondary CTA:** Get the app → `/app?from=paid_lp&lp={slug}` (App Store + Google Play on **`/app`**)

Footer links to indexed sibling guide (optional human path; LPs remain `noindex`).

---

## Technical

| Item | Location |
|------|----------|
| Copy | `lib/wisewave-site/wisewave-paid-landing-copy.ts` |
| UI | `components/wisewave-site/PaidLandingShell.tsx` |
| Routes | `app/(wisewave-site)/lp/*/page.tsx` |
| `noindex` | `app/(wisewave-site)/lp/layout.tsx` + `wisewave-paid-landing-metadata.ts` |
| Crawl block | `app/robots.ts` → `disallow: /lp/` |

---

## Analytics events (gtag / dataLayer)

| Event | When |
|-------|------|
| `paid_landing_view` | LP load (`lp`, `ad_group`) |
| `paid_landing_primary_cta_click` | Browser CTA |
| `paid_landing_secondary_cta_click` | Subscribe CTA |
| `start_page_enter_click` | Enter on `/start` with `source=paid_lp` + `lp` |

**Google Ads conversions (steward / Nova follow-up):** Map in Ads UI after tag verified:

- Primary early KPI: **first reflection started** (needs `/chat` event — not yet wired)  
- Interim: `paid_landing_primary_cta_click` or `start_page_enter_click` with `source=paid_lp`

---

## Lumen QA (hosted, after deploy)

1. View-source each `/lp/*` → `noindex, nofollow` present.  
2. Confirm organic pages’ titles/metas **unchanged** vs pre-deploy.  
3. Category integrity on LP copy (no therapy/coach/companion drift).  
4. Primary CTA path reaches `/start` then login/chat.  
5. Search terms review per brief (2–3 days, 7 days, 14 days).

---

## Campaign checklist (steward)

- [ ] Campaign: **Search only**; Display / PMax off  
- [ ] Budget AUD $15–25/day; phrase + exact only  
- [ ] Hard negatives from Wisewave brief  
- [ ] Final URLs = `/lp/*` table above  
- [ ] Conversion tag live before spend  
- [ ] 7-day + 14-day Lumen review scheduled

---

## 2026-06-12 — Diagnosis: campaign not serving (Nova + steward)

**Campaign:** `wisewave reflection app` (Search, AU + US, started 2026-05-28).  
**Symptom:** ~2 impressions, 0 clicks in first 2 weeks. Ad Preview & Diagnosis showed *"We don't know why your ads aren't showing"* (generic — no policy block; ad simply not entering/winning auctions). Overview banner: *"Your campaign hasn't served in the past week."*

### Findings

| Check | Result |
|-------|--------|
| Bidding | **Maximise clicks** with **$1.50 max CPC cap**; budget **$7.97/day** — conversion-data issues ruled out (click-based) |
| Keyword statuses | All Eligible except `"private reflection app"` → **Low search volume** (not eligible) |
| Est. first/top page bid columns | Empty ("–") — no auction data because campaign wasn't entering auctions (circular) |
| Keyword Planner (AU) | `reflection app` / `self reflection app`: only **10–100 searches/mo**, no bid data. `reflection ai`: **100–1K/mo, +9,900% YoY**, top-of-page **$6.89–$14.13** |
| Keyword Planner (US) | `reflection app`: 100–1K/mo, top-of-page **$1.27–$4.38** (only place $1.50 occasionally cleared → the 2 impressions). `self reflection app`: 10–100/mo, **$2.41–$6.07**. **`reflection ai`: 10K–100K/mo (+900% YoY), $3.09–$28.43** |

**Root cause:** $1.50 CPC cap below auction floor for nearly all targeted terms, compounded by very low search volume on the chosen "reflection app" phrasing in AU. The real market demand is on **"reflection ai"** (large + fast-growing, and genuinely relevant to Wisewave), at materially higher CPCs.

### Actions taken (steward, 2026-06-12)

1. Raised/removed the $1.50 Maximise-clicks CPC cap (target ~$4.50; daily budget remains hard spend ceiling).
2. Added `"reflection ai"` (phrase) as a keyword — highest-volume relevant term, US low-range entry ~$3.
3. Kept AU + US targeting; US expected to carry most impressions.
4. **No further edits for ~7 days** (avoid resetting bid-strategy calibration).

### Watchpoints (next 7 days)

- Impressions should move within 24–48 h of the bid change; if still ~0 after 3–4 days, escalate to ad strength / landing relevance review.
- Search terms report: confirm `reflection ai` clicks are reflection-intent, not generic AI-tool browsing.
- Avg. CPC: if `reflection ai` clicks land $7–10+ and consume the day's budget in one click, split it into its own ad group/campaign with its own cap.
- Expected volume at $7.97/day: roughly 1–3 clicks/day — slow but real signal.
- Reminder: never search for the ad on live Google (hurts CTR signal); use Ad Preview tool only.

---

## 2026-07-02 — 3-week read: campaign serving; intent leakage is the main cost (Nova + steward)

**Campaign:** `wisewave reflection app` — self-reflection ad group, **AU only** (steward narrowed from AU+US), budget **$10/day**, Maximise clicks with manual CPC cap.

### Bid history (steward experiment)

$1.50 (no serving) → cap removed (~$12 avg CPC, serving but too expensive) → $5 (works) → $3 (slow) → **$3.50 current**. AU auction floor for this niche sits roughly **$3–$5**. At $3.50: **2–3 clicks/day**, ~$7–10/day spend — accepted steady state. "Limited by max bid limit" diagnostic is the deliberate trade-off; ignore Google's nudge to lift it.

### 30-day numbers (Jun 2 – Jul 1)

| Metric | Value |
|--------|-------|
| Impressions | 559 |
| Clicks | 11 |
| Cost | $67.01 |
| Avg CPC | $6.09 (inflated by early uncapped week) |
| CTR | ~2.0% — acceptable for a no-brand advertiser |

**Keywords:** `"self reflection tool"` = $56.66 / 8 clicks / 2.82% CTR (~$7.08 avg — 85% of spend, best CTR, the workhorse). `"personal reflection app"` = $10.35 / 3 clicks / $3.45 avg. `"daily reflection app"`, `"reflection tool"` = 0 clicks (below floor or no volume; left enabled).

**Audience (small sample):** female 25–44 dominant; ~63% of impressions on mobile.

### Finding: intent leakage

Top triggering searches are overwhelmingly **journal-app intent**, often free-seeking: *journal prompts for self reflection, free journal app, gratitude journal app, best journal app, journaling app…* Wisewave is explicitly not a journaling app (`/journaling-alternative` exists to say so). Most paid clicks are likely journal-app seekers who bounce — this, not CPC level, is the main budget leak.

### Actions agreed (priority order)

1. **Conversion tracking first** — Google tag on wisewave.io; conversion = start-CTA click / first chat turn. Until live, every bid decision is cost-only, value-blind.
2. **Negative keywords:** `free`, `gratitude`, `prompts`, `template`, `planner`, and `journal` / `journaling` (phrase negatives). Alternative (not chosen for now): dedicated "journaling alternative" ad group → `/journaling-alternative`.
3. **Hold $3.50 cap for 2 more weeks** — no further bid edits; sample still small.
4. ~~Note: `"reflection ai"` keyword + US targeting no longer active in this slice~~ **Corrected same day:** reflection-AI terms were split into their own campaign (see next section) — not dropped.

### Watchpoints (next 2 weeks)

- After negatives land: expect impressions to drop but CTR and click quality to rise; that is success, not regression.
- Confirm mobile landing experience (`/start` path) is tight — most clicks arrive on mobile.
- Once conversion tracking is live: compute cost per started reflection before any bid/geo expansion decision.

---

## 2026-07-02 — Second campaign read: `wisewave-AI Reflection` (AU + US) — the better performer

**Campaign:** `wisewave-AI Reflection` — reflection-AI keyword group, **AU + US**, landing page `/ai-reflection`. This is where the 2026-06-12 `"reflection ai"` recommendation ended up (own campaign, not dropped).

### 30-day numbers (Jun 2 – Jul 1)

| Metric | AI Reflection (AU+US) | Self-reflection (AU only) |
|--------|----------------------|---------------------------|
| Impressions | 861 | 559 |
| Clicks | 26 | 11 |
| Cost | $133 | $67.01 |
| Avg CPC | $5.11 | $6.09 |
| CTR | **~3.0%** | ~2.0% |

### Keyword highlights

- **Exact-match standouts:** `[ai reflection tool]` ($26.84 / 4 clicks / **16.67% CTR**), `[reflection ai app]` ($7.51 / 2 / **16.67%**), `"ai reflection app"` (9.52%). Tiny samples, but 16%+ CTR = ad copy reads as the exact answer to the query. Protect these.
- **Broadest matcher is the leakiest:** `"self reflection ai"` (phrase) took the most spend ($48.38) at the worst CTR (2.23%) — it pulls in the journal-intent queries.
- Intent match overall much cleaner than the self-reflection group: top searches are *reflection ai / ai reflection / reflect ai / best ai for self reflection* — confirms 2026-06-12 diagnosis that demand lives on "reflection AI" phrasing.

### Remaining leakage (negatives to add here too)

*reflection journal app, ai journal app, ai journaling app, ai diary app, free ai journal app, ai journal therapy, youper app.* Negatives: `free`, `diary`, `journal` / `journaling` (phrase), `therapy` (also a positioning boundary — Wisewave is not therapy), `youper` (competitor brand).

### Audience note

Male 25–44 dominates this campaign; female 25–44 dominated the self-reflection group. "AI" framing draws men, "self reflection" framing draws women. Both ~69% mobile clicks. Segmentation insight for later landing copy — no action now.

### Combined posture (both campaigns)

~$200 / 37 clicks / ~1,420 impressions in 30 days. AI Reflection wins on every efficiency metric; budget shifts (if any) go toward it. **Conversion tracking remains action #1 for both** — until live, we cannot compare a $5.11 AI-reflection click vs a $3.50 self-reflection click on cost per started reflection.

---

## 2026-07-02 — Full-funnel read from admin conversion data (Nova, via `/api/admin/*`)

Internal conversion tracking already exists (GA4 `G-VBCMX20WDP` + server events; admin page `/admin` → `/api/admin/conversion-tracking`). Data below is last 30 days, **testing traffic included** (steward's own LP visits pollute view counts).

### Funnel (30 days)

Ad clicks **37** → paid LP views **~123** → LP primary CTA **10** → `/start` views **12** → enter clicks **7** → **first reflection started/completed 4/4** → checkout started **3** → **subscriptions completed 0**.

**Registrations since ads:** 5 (May 31, Jun 21, Jun 22, Jun 24, Jun 30 — 4 inside the 30-day window; pre-ads baseline was ~1 per 2–3 weeks). One fully tracked journey on Jun 30: ad → `/lp/self-reflection-app` → CTA → `/start` → signup → first reflection completed **48 s** after signup (`ag1_self_reflection_app`).

### Economics

~**$40–50 per activated user** (signup + first reflection). Activation quality is 4/4 — everyone who signed up reflected. Volume small; no paid conversion yet. Watch signal: **3 checkout_started, 0 subscription_completed** — if this repeats, the leak is the pricing/PayPal step, not the ads. Also: 3 of 4 ad-era trials already `expired` without converting — review trial length / trial-end moment.

### Gaps → actions

1. **Link GA4 → Google Ads and import conversions** (console-side, no code): primary = `first_reflection_started`, secondary = `signup_completed`. This is why Ads still shows "set up conversion tracking", and it also fixes gclid/source attribution (currently null on most events — ads-vs-SEO attribution is timing inference only).
2. **Instrumentation gap — DONE 2026-07-02 (Nova):** `signup_completed` fired 1× against 4 real signups. Cause: `pages/api/auth/oauth.ts` (token-based OAuth endpoint used by the mobile/client flow) created users without recording the event, while email register + the three browser OAuth callbacks all did. Now fires `signup_completed` (`source: oauth_<provider>`) on its create branch; once-per-user dedupe prevents double-count.
2b. **Checkout instrumentation — DONE 2026-07-02 (Nova):** `checkout_started` previously fired on `/subscribe` page load only, with no userId (raw events showed ~2 real visitors, not 3 — May 27 pair was steward testing; duplicates were reload double-fires). Shipped: **`payment_button_clicked`** event (PayPal subscription buttons via `createSubscription`, fallback order button, embed-mobile Subscribe; payload `source` + `plan`) and **verified userId attribution** for both events (auth JWT via `auth_token` payload key → beacon `token` → `verifyUserToken` server-side; JWT never sent to GA4 or stored in metadata). After deploy, "opened pricing page" vs "attempted payment" is measurable per account. QA entry: `docs/QA_HANDOFF.md` 2026-07-02.
3. LP → CTA ~8–12% and `/start` → enter ~58% are healthy; the funnel's weakest paid step is LP view → CTA. No copy change yet — sample too small and view counts polluted by testing.

### Per-account reflection depth (ad-era signups, read-only DB query 2026-07-02)

"User msgs" = chat turns the person sent (`Message` where `role = user`).

| Signed up | Account | Convs | User msgs | Pattern |
|-----------|---------|-------|-----------|---------|
| May 31 | zu…@icloud (AU) | 2 | 30 | Long first session, **returned next morning** — only returner |
| Jun 21 | po…@gmail | 1 | 18 | One deep 8-min session, never returned |
| Jun 22 | ka…@gmail | 1 | 2 | ~1-min try, left |
| Jun 24 | al…@gmail | 1 | 3 | ~2-min try, left |
| Jun 30 | s.…@gmail | 1 | 7 | Solid 9-min first session; too recent to judge return |

**Read:** engagement depth is real (3 of 5 had substantive sessions), but the pattern is **one-and-done** — 4 of 5 never returned after day one. Combined with 3-of-4 expired trials and 0 paid conversions: ads bring the right people, first reflection works, nothing pulls them back. Retention after the first session is now the binding constraint, not acquisition.

**Governance note:** re-engagement mechanics (email, notifications, stronger Continue surfacing) are a **scope decision for Tree/Lumen** under the Phase 8/9 restraint posture — this section is evidence for that discussion, not a Nova action item.

**Data hygiene:** account-level stats include steward test accounts (`lu…@example.com`, `ho…@*`, `Te…@wisewave.com`) — exclude/tag before quoting totals. `Message` table holds ~1,700 distinct user IDs vs 106 registered accounts (embed/anonymous path writes under non-account IDs); registered-account joins are the reliable slice.

---

## 2026-07-02 — Console setup completed (steward, with Nova assist)

1. **GA4 measurement ID corrected twice:** production had been sending to `G-VBCMX20WDP` (a stream not owned by the linked wisewave property); steward switched Vercel to the property's stream ID, which turned out to be **invalid on Google's tag servers (gtag/js 404 — cause of empty Realtime)**. Steward created a **new web stream**; canonical ID is now **`G-XCZJHENLZ8`** (property **wisewave / 539278365**, matches Google Ads link). Verified live: gtag/js 200, Realtime shows traffic. Historical GA4 events before this date are split across dead/mismatched streams — treat GA4 history as starting fresh 2026-07-02; server-side DB events remain the continuous record.
2. **Key event + Ads import:** `paid_landing_primary_cta_click` marked as GA4 key event and imported into Google Ads as primary conversion (intent-level proxy; `signup_completed` / `first_reflection_started` remain the deeper KPIs — first reflection is still DB-only, not in GA4).
3. **Negative keywords applied to BOTH campaigns** (phrase match): `free, journal, journaling, diary, gratitude, prompts, template, planner, therapy, youper`.
4. **Keyword watchpoint:** `"self reflection tool"` shows Eligible (Limited) / low Quality Score — partly stale (no-recent-impressions feedback loop). Hold 2 weeks post-negatives; if persistent, add "tool" phrasing to one ad headline (and optionally LP copy, via Wisewave copy review).

## 2026-07-02 — Wisewave/Aurora strategic feedback received (pointer for Tree)

Steward relayed a long-form Wisewave assessment of this doc: paid-search execution is sound, but the intent leakage documented above is a **category-recognition problem** — Google does not yet know what Wisewave is, so it routes journal-app demand to us. Proposal: shift from keyword competition to **semantic entity building** ("Wisewave = Reflection AI"): four-layer keyword model, Reflection AI hub IA, structured data, store-listing category language, external mentions, white paper, annual OKRs for Aurora/Nova.

**Nova read:** diagnosis matches our funnel data. Partial infrastructure already shipped (site-wide Organization/WebSite JSON-LD, FAQ + Breadcrumb schema, `/reflection-without-advice` topic cluster incl. comparison pages). Genuine Nova gaps: SoftwareApplication schema, CTA unification audit, `first_reflection_started` → GA4, Day-7 retention event. **Scope note:** hub IA restructure, 100-article plan, store retitling, and "Reflection AI" vs "Reflection Without Advice" as primary category handle are **Tree + Wisewave language-lock decisions** — not started unilaterally.

## 2026-07-02 — Aurora reply + measurement layer shipped (Nova)

**Aurora working rules received:** Measurement → proceed immediately. Infrastructure → prepare, no semantic commitment. Meaning (identity/category/surface hierarchy) → frozen, escalated to Tree. Paid search: hold campaign settings 2 weeks; watch query quality post-negatives, LP click → first reflection, first reflection → return, and residual journal/therapy/assistant leakage.

**Shipped same day (build passes):**

1. **`first_reflection_started` / `first_reflection_completed` → GA4.** Turn API response now carries `conversion_events`; `/chat` client mirrors them to GA4 with the browser's ads-attribution context (`skipBeacon` — server DB row is the source of truth, no double count). Once one fires on production: mark as GA4 key event → import into Google Ads → consider swapping primary conversion from `paid_landing_primary_cta_click` to `first_reflection_started`.
2. **`day_7_return`** — first reflective turn ≥ 7 days after account creation, once per user, registered accounts only. Directly measures the retention constraint from the per-account read (4-of-5 one-and-done). Server-persisted + GA4-mirrored.
3. **SoftwareApplication schema prepared, NOT mounted** (`components/wisewave-site/SoftwareApplicationJsonLd.tsx`) — facts only; `applicationCategory`/`description`/`keywords` absent pending category-language lock.
4. **CTA audit delivered** — `docs/Wisewave_CTA_Audit_2026-07-02.md` (inventory only; five verb families across surfaces; organic says "Enter Wisewave", paid says "Start a reflection"; verb decision escalated to Tree + Aurora + Wisewave).

**Escalated to Tree (unchanged):** identity/category/discovery hierarchy; permitted scope of "Reflection AI"; its relationship to "Reflection Without Advice"; which public surfaces stay frozen vs bridge-term usage.

## 2026-07-07 — Apple Search Ads read: Search Match serves junk without category metadata

First 30-day read of the **Apple Search Ads** campaign (separate channel from Google; the Google 2-week no-touch hold does not apply here).

**Setup found:** one campaign, ad group "reflection" with 7 **exact-match** keywords at $3.50 max CPT (`daily reflection`, `reflection app`, `self awareness`, `mental clarity`, `reflection ai`, `ai reflection`, `self reflection`) **plus Search Match ON** at $1.92 default CPT.

**Numbers (30 days):**

| Source | Impressions | Taps | Spend |
|--------|-------------|------|-------|
| Exact keywords (all 7) | **2** | 0 | $0.00 |
| Search Match | **1,084** | 6 | $6.80 |

**Search-terms detail (the important part):** Search Match impressions were almost entirely **unrelated brand/app queries** — `tempr`, `sonder`, `timely`, `spotlight`, `ausclimate` (dehumidifiers), `active world`, `second thought`, `daybreak`, `spacetalk`, `zeekr` (car brand), `суточно ру` — plus 740 impressions in Apple's hidden "(Low volume terms)" bucket which consumed $4.88 of the $6.80. **Zero visible reflection-intent queries.**

**Diagnosis:** Search Match places ads based on what Apple understands from the **store listing**. Wisewave's deliberately quiet, category-abstract metadata gives Apple no category anchor, so it serves the ad on random low-competition queries. This is the App Store expression of the same category-recognition problem Aurora diagnosed on Google search — the platform does not yet know what Wisewave is. Exact keywords meanwhile have near-zero organic App Store search volume (2 impressions / 30 days), confirming that conceptual phrases like "reflection ai" are not what App Store users type.

**Actions (steward, 2026-07-07):**

1. **Search Match OFF** on ad group "reflection" — the visible junk can be negated but the "(Low volume terms)" majority cannot; the channel buys noise until metadata teaches Apple the category.
2. **"reflection AI AUTO" ad group paused** (was created same day as a Search-Match discovery group before the search-terms read showed discovery had already run and returned junk).
3. **Exact-match keywords left running** — ~free tripwire ($0 spend / 30 days) that catches any real reflection-app searches at bounded cost.
4. **Negative keywords (broad)** added at campaign level: `free, journal, journaling, diary, gratitude, prompts, template, planner, therapy` — inert while Search Match is off, insurance if re-enabled.

**Governance pointer (for Tree):** this is the first **measured acquisition cost of the store-metadata freeze** — Apple Search Ads cannot target meaningfully until App Store metadata (title/subtitle/keyword field) establishes a category, and that surface is frozen under Semantic Governance Lock v1.1. Not an argument to unfreeze now; it is concrete data for when Tree prioritizes the store-metadata decision. Total spend on the lesson: **$6.80**.

5. **US added** to the "reflection" ad group's countries (same day) — exact-match keywords now serve AU + US. US volume is much larger, so the tripwire may produce real impressions; cost remains bounded (exact match only, $3.50 max CPT, Search Match off, **campaign daily budget $10** — same ceiling as Google; expected actual spend near zero).
