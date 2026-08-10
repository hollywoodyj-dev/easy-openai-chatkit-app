# P2 Slice 1 — Knowledge Infrastructure Evidence Pack

**Date:** 2026-08-10  
**From:** Nova  
**Authority:** `docs/TREE_SEMANTIC_AUTHORITY_PHASE_2_SLICE_1_BUILD_AUTH_2026-08-10.md`  
**Status:** Slice 1 implemented locally · **Hosted Preview NOT authorized** · **Production NOT authorized**

---

## 1. Exact files added / changed

### Added

| Path | Role |
|------|------|
| `lib/wisewave-knowledge/types.ts` | Glossary / article / hub types |
| `lib/wisewave-knowledge/publish.ts` | Publish + robots + sitemap gates |
| `lib/wisewave-knowledge/glossary/index.ts` | 10 unpublished stubs |
| `lib/wisewave-knowledge/articles/registry.ts` | Article metadata overlay (legacy) |
| `lib/wisewave-knowledge/hub/config.ts` | Hub config → `/reflection-ai` |
| `lib/wisewave-knowledge/links/semantic-links.ts` | Editorial link resolver |
| `lib/wisewave-knowledge/sitemap-paths.ts` | Knowledge sitemap merge helper |
| `lib/wisewave-knowledge/index.ts` | Barrel |
| `lib/wisewave-knowledge/wisewave-knowledge.test.ts` | Unit tests |
| `app/(wisewave-site)/glossary/page.tsx` | Glossary index shell (noindex) |
| `app/(wisewave-site)/glossary/[slug]/page.tsx` | Entry shells (noindex) |
| `docs/TREE_SEMANTIC_AUTHORITY_PHASE_2_SLICE_1_BUILD_AUTH_2026-08-10.md` | Tree auth record |
| `docs/qa/P2_SLICE1_KNOWLEDGE_INFRA_EVIDENCE_2026-08-10.md` | This evidence pack |

### Changed

| Path | Change |
|------|--------|
| `app/sitemap.ts` | Merge published knowledge paths only (currently none) |
| `package.json` | `test:p2-knowledge` script |

### Not changed (confirmed intent)

- `app/(wisewave-site)/articles/dont-come-with-a-question/page.tsx`
- `lib/wisewave-site/wisewave-article-dont-come-with-a-question.ts` (read-only import)
- `app/(wisewave-site)/reflection-ai/page.tsx` (no Hub content rewrite)
- `app/api/chat/**`, `app/chat/**`, Prisma schema

---

## 2. Route behavior

| Route | Exists | Indexable (Slice 1) | Notes |
|-------|--------|---------------------|-------|
| `/glossary` | Yes | **No** (`robots: noindex,nofollow`) | Draft index lists 10 stubs |
| `/glossary/[slug]` | Yes (10 static params) | **No** while `published: false` | Stub body only |
| `/reflection-ai` | Unchanged | Yes (existing) | Canonical Hub URL locked |
| `/library` | **Not created** | — | Locked out |
| `/research` | **Not created** | — | Locked out |
| Pillar routes | **Not created** | — | Pillars = metadata only |

---

## 3. Registry / data shapes

- **Glossary:** `GlossaryEntry` in `types.ts`; stubs via `GLOSSARY_ENTRIES` (10; all `published: false`, `review_status: "draft"`).
- **Articles:** `KnowledgeArticleMeta` overlay in `articles/registry.ts` for Article 1 + 2; `writing_constitution: "legacy_protected"`; `semantic_review` / `qa_status`: `"grandfathered"`; `pillar: null`.
- **Hub:** `REFLECTION_AI_HUB_CONFIG.canonical_path === "/reflection-ai"`; `research_path: null`; identity correction → `/reflection-without-advice`.
- **Links:** `resolveGlossaryLink` / `resolveArticleLink` emit only when `published === true`.

---

## 4. Publish / noindex gate evidence

```text
glossaryIndexRobots(GLOSSARY_ENTRIES) → { index: false, follow: false }
glossaryRobots(each stub) → { index: false, follow: false }
```

Entry page metadata uses `glossaryRobots(entry)`. Index page uses `glossaryIndexRobots`.

---

## 5. Article 1 legacy-protection evidence

```text
slug: dont-come-with-a-question
canonical_path: /articles/dont-come-with-a-question
writing_constitution: legacy_protected
semantic_review: grandfathered
qa_status: grandfathered
pillar: null
assertLegacyArticleProtected → true
```

No rewrite / relocate / retitle / CTA / Production metadata normalization of Article 1 modules or page.

---

## 6. Sitemap exclusion evidence

```text
listPublishedGlossarySitemapPaths(GLOSSARY_ENTRIES) → []
getKnowledgeSitemapPaths() → []
mergeSitemapPaths(base) does not add /glossary or /glossary/*
Existing /reflection-ai and /articles/dont-come-with-a-question remain in base PATHS
```

---

## 7. No runtime / chat impact confirmation

```text
No changes to app/api/chat/** or app/chat/**
No Prisma / schema migration
No ENABLE_* chat flags
No FMI / Entry / Continuity touch
```

---

## 8. No Production publication confirmation

```text
PRODUCTION: NOT AUTHORIZED
PUBLIC GLOSSARY: NOT AUTHORIZED (all published: false)
HOSTED PREVIEW: NOT AUTHORIZED BY THIS TASK
Hub content deepen: NOT DONE
Bulk content: NOT DONE
```

Infrastructure is in-repo only; glossary surfaces are noindex and sitemap-excluded.

---

## 9. Tests

```bash
npm run test:p2-knowledge
```

**Result (2026-08-10):** 9/9 passed.

---

## 10. Rollback path

| Action | How |
|--------|-----|
| Remove knowledge lib | Delete `lib/wisewave-knowledge/` |
| Remove glossary routes | Delete `app/(wisewave-site)/glossary/` |
| Revert sitemap | Restore prior `app/sitemap.ts` static PATHS-only |
| Revert package script | Remove `test:p2-knowledge` |
| Article 1 / Hub pages | Untouched — no rollback needed |

Existing Production articles and `/reflection-ai` remain functional if Phase 2 infra is removed.

---

## Final Nova line

```text
SLICE 1 KNOWLEDGE INFRASTRUCTURE: IMPLEMENTED (local)
HOSTED PREVIEW: NOT AUTHORIZED
PRODUCTION / PUBLIC GLOSSARY / BULK CONTENT: NOT AUTHORIZED
EVIDENCE: docs/qa/P2_SLICE1_KNOWLEDGE_INFRA_EVIDENCE_2026-08-10.md
```
