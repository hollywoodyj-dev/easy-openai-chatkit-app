# Wisewave Google Search SEO — Implementation v1

**Status:** Shipped (Nova)  
**Date:** 2026-05-19  
**Governance:** `docs/GOOGLE_SEARCH_SEO_BRIEF_WISEWAVE_V1.md` (Tree / Aurora)  
**Lumen QA:** `docs/LUMEN_QA_PLAN_Wisewave_Google_Search_SEO_v1.md`  
**Code source of truth:** `lib/wisewave-site/wisewave-marketing-seo-metadata.ts`

## Lumen execution read (honored)

- SEO brief = **search layer**; homepage positioning spine (`wisewave-landing-copy.ts`) unchanged  
- Homepage: **title/meta only**; visible hero H1 not rewritten  
- Support pages: primary SEO expansion surface  
- Internal links: calm, truthful anchors  
- No dedicated app-store landing page; no SEO blog sprawl  
- Borderline keywords (mental clarity app, self-reflection app, etc.) used cautiously on existing SEO landings only — not pushed into homepage identity  

## Shipped changes

| Area | Change |
|------|--------|
| Homepage `/` | Title `Wisewave \| Quiet reflection for clearer thinking`; concrete meta description; **Before you begin** internal links |
| `/who-its-for` | SEO title/meta; breadcrumb JSON-LD; core internal links |
| `/what-it-is-not` | SEO title/meta; breadcrumb; internal links + how-it-works/privacy |
| `/reflection-without-advice` | SEO title/meta per brief; core internal links |
| `/why-people-come-back` | **New** support page (repeat-use intent); avoids “quieter kind of support” wording |
| `/faq` | SEO title/meta; core internal links; SEO cluster links kept secondary |
| Sitemap | Added `/why-people-come-back` |
| Component | `MarketingInternalLinks` + `WISEWAVE_CORE_INTERNAL_LINKS` |

## Homepage SEO options (Tree brief — selected)

**Title (live):** Wisewave | Quiet reflection for clearer thinking  

**Alternates (not live):**

- Wisewave | Reflection without advice  
- Wisewave | A quieter way to hear your own thinking  

**Meta (live):** A quiet reflection space that helps you hear your own thinking more clearly — without advice, coaching, or takeover.

**Visible H1 (unchanged):** A quieter space to hear your own thinking. (from landing copy)

**H2 structure (unchanged on page):** transition, may fit if, offers, use when, what is not, why return, boundaries, FAQ — no keyword stuffing.

## Internal linking map

```
/  → who-its-for, what-it-is-not, reflection-without-advice, why-people-come-back, faq
Support pages → same core set (exclude self) + selective SEO cluster links on faq / reflection-without-advice
```

Anchor text: See if it fits · What Wisewave is not · Reflection without advice · Why people come back · Read the FAQ

## Schema

- Unchanged: site-wide Organization/WebSite in layout  
- FAQPage on `/faq` only (existing)  
- BreadcrumbList added on support pages that lacked it  

No new medical/health schema.

## Watchpoints for Lumen

- Homepage hero remains softer than title/meta — intentional  
- SEO landings (`/reflection-ai`, etc.) not rewritten in this pass  
- Search Console indexing lag — retest titles via view-source or Rich Results after deploy  

## Not in v1

- Bulk metadata changes on all SEO landings  
- ZH localized titles/metas  
- Dedicated “app” marketing landing page  
