# Nova Planning Reply — Semantic Authority Program Phase 2
## Reflection AI Knowledge System (Tree Spec §31)

**Date:** 2026-08-09  
**From:** Nova  
**To:** Tree (review) · Aurora (semantic) · Lumen (architecture QA)  
**Authority:** `docs/WISEWAVE_SEMANTIC_AUTHORITY_PROGRAM_PHASE_2_REFLECTION_AI_KNOWLEDGE_SYSTEM_NOVA_SPEC_v1.md`  
**Status:** **PLANNING REPLY ONLY — NO IMPLEMENTATION**  
**Related:**  
- Aurora category judgment: `docs/AURORA_JUDGMENT_GOOGLE_SEMANTIC_CATEGORY_2026-08-09.md`  
- Prior receipt (superseded as program frame): `docs/WISEWAVE_SEO_PHASE_2_SEMANTIC_AUTHORITY_NOVA_RECEIPT_2026-08-09.md`

---

## 1. Proposed Implementation Plan

### Architecture stance

Treat Phase 2 as a **file-based knowledge system** inside the existing Next.js marketing route group `app/(wisewave-site)/`, not a CMS, not Prisma, not chat-runtime work.

```text
Content modules (TS/JSON, unpublished by default)
        ↓
Route shells (indexable only when published=true + Tree Production YES)
        ↓
Editorial semantic links (stored on content; rendered if target published)
        ↓
Sitemap / JSON-LD (follow published visibility only)
        ↓
Phrase Registry + semantic:check (governance)
```

### Phases (after this plan is accepted)

| Phase | Name | Outcome | Gate |
|-------|------|---------|------|
| **P0** | This planning reply | Architecture locked for Slice 1 | Tree review |
| **P1** | Slice 1 — Knowledge Infrastructure | Unpublished Hub shell + glossary data model + article registry wrapper + link primitive + sitemap publish gate + schema recommendations (no Production publish) | Tree Slice Auth → Aurora → Lumen → implement |
| **P2** | Slice 2 — First published knowledge units | Aurora-authored content for **1 Hub deepen OR 1–3 glossary entries** (not all 10) + optional bridge corrections on `/reflection-ai` per Aurora judgment | Full §29–30 gates |
| **P3+** | Library / Research / Comparisons | Only after Hub + glossary prove coherence | Separate Tree auth each |

### Minimal implementation sequence (Slice 1)

1. Add `lib/wisewave-knowledge/` content registry + types (glossary, articles, hub config).  
2. Add `published: false` default; sitemap helper skips unpublished.  
3. Add unpublished route shells: `/reflection-ai` remains canonical Hub URL (deepen later); `/glossary` index + `/glossary/[slug]` dynamic; **no** new pillar taxonomy routes.  
4. Wrap existing Article 1+2 into article registry **without rewriting pages**.  
5. Semantic link helper: resolve related slugs → href only if published.  
6. Document structured-data recommendations; implement only Breadcrumb on new shells if routes exist locally; DefinedTerm deferred until Aurora PASS on real glossary text.  
7. Rollback doc in Slice 1 evidence pack.

### Dependencies

- Semantic Governance Lock v1.1 + Phrase Registry (`lib/semantic-governance/`).  
- Aurora judgment: Reflection AI = bridge; deepen `/reflection-without-advice` as identity anchor (product positioning page — **not** replaced by Hub).  
- Existing sitemap: `app/sitemap.ts`.  
- Existing articles: `lib/wisewave-site/wisewave-article-*.ts` + pages under `app/(wisewave-site)/articles/`.

### Explicit non-sequence

No bulk LLM content → no Research claims → no pillar URL farm → no Production until §30.

---

## 2. Files / Routes Likely Affected

### Current files / routes (touch carefully; Preservation Lock)

| Area | Path |
|------|------|
| Hub seed | `app/(wisewave-site)/reflection-ai/page.tsx` |
| Identity anchor | `app/(wisewave-site)/reflection-without-advice/page.tsx` |
| Articles | `app/(wisewave-site)/articles/dont-come-with-a-question/page.tsx`, `.../how-to-ask-.../page.tsx` |
| Article copy modules | `lib/wisewave-site/wisewave-article-dont-come-with-a-question.ts`, `wisewave-article-how-to-ask.ts` |
| FAQ | `app/(wisewave-site)/faq/page.tsx`, `lib/wisewave-site/wisewave-marketing-faq-items.ts` |
| Sitemap | `app/sitemap.ts` |
| JSON-LD | `components/wisewave-site/MarketingSiteWideJsonLd.tsx`, `BreadcrumbJsonLd.tsx`, `FaqPageJsonLd.tsx`, `SoftwareApplicationJsonLd.tsx` (prepared, not mounted) |
| Internal links | `components/wisewave-site/MarketingInternalLinks.tsx`, `lib/wisewave-site/wisewave-week3-page-internal-links.ts`, `wisewave-reflection-without-advice-cluster.ts` |
| Phrase Registry | `lib/semantic-governance/phrase-registry.json` |
| Comparison seed | `app/(wisewave-site)/reflection-without-advice-vs-coaching/page.tsx` |

### Proposed new files (Slice 1 — not created until Tree Slice Auth)

```text
lib/wisewave-knowledge/
  types.ts
  publish.ts                 # published gate helpers
  glossary/
    index.ts                 # registry of first-10 stubs (unpublished)
    entries/*.ts             # one file per slug when content exists
  articles/
    registry.ts              # metadata overlay; points at existing pages
  hub/
    config.ts                # Hub section map + selected reading pointers
  links/
    semantic-links.ts        # resolve editorial relations → safe hrefs
docs/qa/
  P2_SLICE1_KNOWLEDGE_INFRA_*  # evidence / rollback after build
```

### Proposed new routes (Slice 1 shells)

| Route | Role | Indexable in Slice 1? |
|-------|------|------------------------|
| `/glossary` | Glossary index | **No** until ≥1 published entry + Tree Production |
| `/glossary/[slug]` | Glossary entry | **No** until that entry published |
| `/research` | Future research index stub | **Prefer omit** in Slice 1 (architecture note only) |
| `/library` | Alias for articles index | **Prefer omit**; use `/articles` when needed |

### Sitemap / metadata / structured-data impact

- **Sitemap:** extend `PATHS` only for `published === true` knowledge URLs; never auto-add thin hubs.  
- **Metadata:** new routes use per-entry `meta_title` / `meta_description` from content modules; **do not** change existing article SEO objects without Tree auth.  
- **Structured data:** see §6; Slice 1 implements gates, not inflation.

---

## 3. Proposed Route Structure

### Minimum viable (recommended)

```text
/reflection-ai                          ← Canonical Reflection AI Hub (EXISTING URL)
/reflection-without-advice              ← Identity correction anchor (EXISTING; deepen later, Aurora)
/articles/[existing-slugs]              ← Library (EXISTING; no relocate)
/faq                                    ← EXISTING; Hub links out, no fork
/glossary                               ← NEW index (unpublished until content)
/glossary/[slug]                        ← NEW entries (unpublished until Aurora+Tree)
```

### Why each should or should not exist now

| Node | Separate route now? | Rationale |
|------|---------------------|-----------|
| **Reflection AI Hub** | **Use existing `/reflection-ai`** | Avoids new category URL; preserves GSC equity; Aurora: keep as bridge that admits search → corrects to low-presence. Hub *deepen* is content/IA on this URL, not a second hub. |
| **Definition / Theory / Psychology / Practice / Language** | **No dedicated routes in Slice 1** | Pillars are **metadata on articles**, not taxonomy pages. Thin pillar hubs fail Spec §20. Optional later: in-Hub sections only. |
| **Glossary** | **Yes (shell)** | Distinct DefinedTerm surfaces; supports GEO definitions; unpublished until real entries. |
| **Library** | **No `/library`** | Existing `/articles/...` is enough; optional future `/articles` index page only if needed. |
| **Research** | **No route in Slice 1** | Spec forbids research publication; stub route risks thin indexing. Document `/research` as future reserved. |
| **FAQ** | **Keep `/faq`** | Already FAQPage JSON-LD; Hub links to it. Do not duplicate. |
| **Comparisons** | **No new routes in Slice 1** | Existing vs-coaching preserved; new comparisons need separate Aurora review (Spec §16). |
| **Pillar landing pages** | **Not yet** | Route proliferation risk; wait until ≥2–3 articles per pillar exist. |

### Hub recommendation (for Tree / Aurora)

- **Canonical Hub URL:** `/reflection-ai` (do not invent `/reflection-ai/hub`).  
- **Components:** reuse `SeoLandingHero` / `Section` / restrained selected-reading list; add Hub config-driven sections only when copy is Aurora-approved.  
- **Relationship:** Hub orients category; `/reflection-without-advice` remains **identity-deep** page (Aurora priority deepen — separate content auth, not Slice 1 bulk).  
- **Duplication risk:** Hub must not restate entire `/reflection-without-advice` or `/what-is-wisewave`. Hub = category orientation; identity page = meaning correction.  
- **Canonical/SEO:** keep `canonical: /reflection-ai`; no redirect from identity page to Hub.

---

## 4. Proposed Data Structures

### 4.1 Glossary (file-based; no DB)

```ts
type ReviewStatus = "draft" | "aurora_review" | "lumen_qa" | "tree_ready" | "published";

type GlossaryEntry = {
  slug: string;
  title: string;
  short_definition: string;       // visible lead; also GEO-friendly
  full_definition: string;        // body
  reflection_perspective: string; // Wisewave lens (not textbook)
  common_misunderstanding: string;
  related_terms: string[];        // glossary slugs
  related_articles: string[];     // article slugs
  related_pillar: "theory" | "psychology" | "practice" | "language" | null;
  canonical_path: string;         // /glossary/{slug}
  meta_title: string;
  meta_description: string;
  schema_type: "DefinedTerm" | "none";
  review_status: ReviewStatus;
  semantic_review: "pending" | "pass" | "fail";
  qa_status: "pending" | "pass" | "fail";
  published: boolean;             // hard gate for sitemap + robots
  published_at: string | null;
  updated_at: string | null;
};
```

**First-10 structure (stubs only until Aurora):**

| # | slug | related_pillar (proposed) | Notes |
|---|------|---------------------------|--------|
| 1 | `reflection` | language | Core |
| 2 | `reflection-ai` | theory | Category bridge term; pair with identity language on page |
| 3 | `self-reflection` | theory | Distinction vs Reflection AI product category |
| 4 | `insight` | language | Must not imply FMI/product expansion |
| 5 | `pattern` | language | Must not imply Pattern Visibility product |
| 6 | `meaning` | language | |
| 7 | `rumination` | psychology | Boundary: not clinical |
| 8 | `attention` | language | |
| 9 | `authorship` | language | Authorship Preservation |
| 10 | `low-presence` | language | Identity-adjacent; Aurora must classify registry layer |

Stub files may hold empty/`draft` bodies; **`published: false`**.

### 4.2 Articles (registry overlay — preserve Article 1)

```ts
type KnowledgeArticleMeta = {
  slug: string;
  title: string;
  description: string;
  primary_question: string | null;      // null for legacy until Aurora fills
  primary_distinction: string | null;
  pillar: "theory" | "psychology" | "practice" | "language" | null;
  related_terms: string[];
  related_articles: string[];
  original_phrase: string | null;
  open_ending: string | null;           // optional pointer; body stays in page
  author: string;
  review_status: ReviewStatus;
  semantic_review: "pending" | "pass" | "fail" | "grandfathered";
  qa_status: "pending" | "pass" | "fail" | "grandfathered";
  canonical_path: string;               // existing path — IMMUTABLE without Tree
  published: boolean;                   // true for already-live Production articles
  published_at: string | null;
  updated_at: string | null;
  /** Phase 2 writing constitution applies to NEW articles; legacy flagged */
  writing_constitution: "v1_required" | "legacy_protected";
};
```

**Article 1 compatibility (no rewrite):**

```ts
{
  slug: "dont-come-with-a-question",
  title: "Don't Come With a Question. Come With What Is Real Right Now.",
  canonical_path: "/articles/dont-come-with-a-question",
  published: true,
  writing_constitution: "legacy_protected",
  semantic_review: "grandfathered",
  qa_status: "grandfathered",
  pillar: null,                    // optional Aurora fill later — NOT forced reclassify
  primary_question: null,          // optional overlay later without body rewrite
  // page.tsx + wisewave-article-dont-come-with-a-question.ts remain source of truth for body/SEO
}
```

Same pattern for Article 2. Registry **references** existing modules; does not move URLs or alter titles/CTAs.

### 4.3 Hub config

```ts
type HubConfig = {
  canonical_path: "/reflection-ai";
  selected_reading: { articleSlug: string }[];  // editorial
  glossary_highlights: string[];                // slugs, only render if published
  faq_path: "/faq";
  identity_correction_path: "/reflection-without-advice";
  research_path: null;                          // until research exists
};
```

---

## 5. Internal Linking Enforcement Plan

### Storage

- Relations live on content metadata (`related_terms`, `related_articles`, Hub `selected_reading`).  
- **Editorial only** — no auto “related posts” engine, no sitewide cross-link bots.

### Rendering rule

```text
resolveLink(slug) →
  if target.published && review gates OK → emit Link
  else → omit (no dead or thin links)
```

Human rule (Spec §15): link only if a reader would naturally benefit. Cap guidance (soft, not enforced quotas): typically ≤1 glossary + ≤1 foundational + related articles that are genuinely adjacent.

### Existing content protection

- Do **not** inject new link blocks into Article 1/2 page bodies in Slice 1.  
- Optional: Hub/glossary may link **to** Article 1; reverse links require Tree auth if they change Production article chrome.  
- Existing `MarketingInternalLinks` / week3 clusters remain; Phase 2 must not silently replace them.

### Prevention of irrelevant linking

- No keyword-anchor generator.  
- No minimum link counts in CI.  
- Optional Lumen check later: flag exact-match spam patterns — not Slice 1.

---

## 6. Structured Data Plan

### Current audit (as of 2026-08-09)

| Type | Status |
|------|--------|
| Organization + WebSite | Mounted site-wide (`MarketingSiteWideJsonLd`) |
| BreadcrumbList | SEO landings, FAQ, articles |
| FAQPage | `/faq` only; visible = structured |
| Article | **Not** mounted on article pages today (Breadcrumb only) |
| SoftwareApplication | Prepared, **not mounted**; category fields frozen |
| DefinedTerm / DefinedTermSet | **Absent** |

### Recommendations (implement only after gates)

1. **Slice 1:** no speculative schema. Keep Breadcrumb on any new unpublished local shells if useful for Preview QA.  
2. **When first glossary entry publishes:** `DefinedTerm` (and optionally `DefinedTermSet` on `/glossary`) **only** if short+full definition are visible on-page and Aurora PASS.  
3. **Article JSON-LD:** optional later for new Phase 2 articles; for legacy Article 1, only if Tree authorizes metadata/schema add **without** body rewrite — prefer defer.  
4. **Do not** mount SoftwareApplication category fields under Phase 2 alone.  
5. **Do not** FAQPage-inflate Hub.  
6. No invisible SEO-only nodes.

---

## 7. First Slice Recommendation

### Phase 2 Slice 1 — Knowledge Infrastructure (smallest meaningful demo)

**In scope:**

1. `lib/wisewave-knowledge/` types + publish helpers.  
2. Glossary registry with **10 unpublished stubs** (titles/slugs only or placeholder draft fields).  
3. Dynamic routes `/glossary` + `/glossary/[slug]` behind **`published` false** (local/Preview only; `robots: noindex` while unpublished).  
4. Article registry entries for Article 1 + 2 (**grandfathered**; zero body/URL/title change).  
5. Hub `config.ts` pointing at `/reflection-ai` (no Production Hub rewrite).  
6. `semantic-links.ts` primitive + unit tests.  
7. Sitemap helper: only emit published knowledge URLs (behavior-preserving for current PATHS).  
8. Evidence + rollback note.

**Out of scope for Slice 1:**

- Bulk glossary prose  
- Hub Production content rewrite  
- Deepen `/reflection-without-advice` copy (Aurora priority — **separate Tree content auth**)  
- Research routes  
- Comparison pages  
- Pillar taxonomy routes  
- Prisma/CMS  
- Chat/runtime flags  
- Production publish of any new URL  

**Reviewability:** local + Hosted Preview with unpublished/noindex; Production unchanged until §30.

---

## 8. Rollback Path

| Change | Rollback |
|--------|----------|
| `lib/wisewave-knowledge/**` | Delete directory |
| `/glossary` routes | Delete `app/(wisewave-site)/glossary/**` |
| Sitemap helper | Revert `app/sitemap.ts` to static PATHS list |
| Article registry | Delete registry; leave `wisewave-article-*.ts` + pages untouched |
| Hub config | Delete; `/reflection-ai/page.tsx` remains as today |
| Tests | Remove `test:p2-knowledge` script if added |

**Invariant:** Removing Phase 2 infra must leave Article 1, `/reflection-ai`, `/faq`, `/reflection-without-advice`, and current sitemap entries functional.

**Build dependencies:** none beyond existing Next app; no new SaaS; no DB migration.

---

## 9. Risks / Governance Conflicts

| Risk | Severity | Escalation |
|------|----------|------------|
| **Hub deepen vs Aurora identity priority** — Spec Hub = `/reflection-ai`; Aurora says deepen `/reflection-without-advice` first for Google category learning | Medium | Tree: Sequence Slice 1 infra, then **content** priority = identity page deepen (separate auth) before Hub Production rewrite |
| **“Reflection AI” Hub vs identity-sensitive pairing** — Hub page must not sole-define Wisewave as Reflection AI | High | Aurora review of any Hub copy; keep correction link to `/reflection-without-advice` |
| **Glossary “Insight” / “Pattern”** — product-expansion confusion (FMI, Pattern Visibility) | High | Copy must stay conceptual; Spec §26; Aurora + Tree |
| **Internal trademarks / ZPD / Seven Layers / SeeSoul** — must not enter public taxonomy | High | Spec §2.2; exclude from glossary candidates |
| **Existing Article 1 “grandfathered” vs Writing Constitution** — cannot force 4 gates retroactively without rewrite | Medium | Accept legacy_protected; constitution applies to **new** articles only |
| **SoftwareApplication schema** — still frozen | Medium | Do not mount under Phase 2 |
| **Duplicate thin surfaces** — `/library`, pillar pages, `/research` stubs | Medium | MV routes above; escalate if Tree wants stubs |
| **Semantic Governance freeze** — public phrase expansion | High | All new glossary titles through Phrase Registry `proposed` → Aurora → approved |
| **Paid LP boundary line** (Aurora) — adjacent but not this Spec’s Slice 1 | Note | Separate paid/LP copy track |

**Nova does not silently resolve these.** Tree sequencing ask:

```text
Recommended Tree sequence:
1) Accept this planning reply
2) Authorize Slice 1 infra (unpublished)
3) Separately authorize Aurora-led deepen of /reflection-without-advice
4) Separately authorize Hub content deepen on /reflection-ai
5) Separately authorize first glossary publications (subset of 10)
```

---

## 10. Explicit Confirmation

```text
Nova confirms:

1. No bulk content generation will occur under this planning authorization.
2. No public Phase 2 publishing will occur without Tree Production Authorization
   (and Aurora Semantic Review PASS + Lumen QA PASS).
3. Reflection AI remains the canonical market category (LOCKED).
4. Existing approved Production content will not be silently rewritten,
   relocated, retitled, or re-canonicalized (including Article 1).
5. Phase 2 will not alter Wisewave runtime/product behavior
   (Entry, FMI, Pattern Visibility, Continuity, chat, models, subscription, safety).
6. Internal capability terms (ZPD, Seven Layers, SeeSoul, mild insight, etc.)
   will not enter public taxonomy without separate Tree authorization.
7. GEO means citation-worthiness (clear definitions, distinctions, stable URLs) —
   not generative-engine manipulation.
8. 100 articles / quotas / automated pipelines remain unauthorized.
```

---

## Acceptance self-check (Spec §32)

| Criterion | Met? |
|-----------|------|
| Infrastructure before content volume | Yes |
| Reflection AI category-locked | Yes |
| Production content protected | Yes |
| Route proliferation minimized | Yes (no pillar/library/research routes in Slice 1) |
| Glossary meaningful not SEO-driven | Yes (unpublished stubs; Aurora before publish) |
| Linking semantic not mechanical | Yes |
| Structured data reflects visible content | Yes (recommend-before-implement) |
| Research not fabricated | Yes (no research slice) |
| GEO = citation-worthiness | Yes |
| Runtime untouched | Yes |
| Rollback explicit | Yes |
| Production gated | Yes |

---

## Final Nova line

```text
TREE SPEC v1.0: RECEIVED AND FILED.
PLANNING REPLY (§31.1–10): COMPLETE — AWAITING TREE REVIEW.
SLICE 1 IMPLEMENTATION: NOT STARTED (requires Tree Slice Authorization).
PRODUCTION / BULK CONTENT / HUB LAUNCH / RESEARCH: NOT AUTHORIZED.
```
