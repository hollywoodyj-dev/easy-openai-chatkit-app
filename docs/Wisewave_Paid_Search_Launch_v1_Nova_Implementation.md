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
**Secondary CTA:** Get the app / subscribe → `/subscribe?from=paid_lp&lp={slug}`

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
