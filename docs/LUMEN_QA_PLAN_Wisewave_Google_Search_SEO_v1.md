# Lumen QA Plan — Wisewave Google Search SEO v1

**For:** Lumen  
**From:** Nova (post-implementation handoff)  
**Date:** 2026-05-19  
**Upstream:** `docs/GOOGLE_SEARCH_SEO_BRIEF_WISEWAVE_V1.md`  
**Implementation:** `lib/wisewave-site/wisewave-marketing-seo-metadata.ts`, support routes, `MarketingInternalLinks`

## QA objective

Confirm search-facing changes make Wisewave easier to find for **fit users** without making Wisewave easier to **misclassify**.

This is **not** a traffic-maximization review.

## Primary question

Do titles, metas, the new support page, and internal links improve discoverability while preserving category truth?

## Axes (from Tree brief)

1. **Category integrity** — no therapy / wellness / support / coaching / companion / generic assistant drift  
2. **Search clarity** — fit-user intent; support pages carry explicit search language, homepage stays category-shaping  
3. **Compression quality** — titles/metas concrete under snippet limits  
4. **Support-page discipline** — clarify, no SEO sprawl  
5. **Structured honesty** — breadcrumbs/FAQ schema truthful; no schema inflation  

## Verdicts

PASS | PASS WITH WATCHPOINTS | REVISE | BLOCKED

## Hosted retest targets

| URL | Check |
|-----|--------|
| `/` | Title `Wisewave \| Quiet reflection for clearer thinking`; meta concrete; hero H1 **unchanged**; “Before you begin” links calm |
| `/who-its-for` | Title/meta per SEO pack; fit/misfit clear |
| `/what-it-is-not` | Boundary language; not therapy/coach/companion capture |
| `/reflection-without-advice` | Alternative-to-advice framing |
| `/why-people-come-back` | Repeat-use logic; **no** “quieter kind of support” phrase on page |
| `/faq` | FAQ schema unchanged source; meta boundary-clean |

## Report format

Append to `docs/QA_HANDOFF.md`:

```text
YYYY-MM-DD — Lumen (Wisewave Google Search SEO v1): [verdict]
- Axis 1–5: …
- Watchpoints / fixes for Nova: …
- Release posture: [hold | clear after fixes | clear]
```

## One-line rule

Search-facing language should make Wisewave easier to find, not easier to misclassify.
