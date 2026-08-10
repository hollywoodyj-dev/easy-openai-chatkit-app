import { describe, expect, it } from "vitest";
import {
  GLOSSARY_ENTRIES,
  KNOWLEDGE_ARTICLE_REGISTRY,
  REFLECTION_AI_HUB_CONFIG,
  assertLegacyArticleProtected,
  getArticle1Legacy,
  getKnowledgeSitemapPaths,
  glossaryIndexRobots,
  glossaryRobots,
  isKnowledgePublished,
  listPublishedGlossarySitemapPaths,
  mergeSitemapPaths,
  resolveArticleLink,
  resolveGlossaryLink,
  resolveRelatedGlossaryLinks,
} from "@/lib/wisewave-knowledge";
import { getMarketingSitemapBasePaths } from "../../app/sitemap";

describe("Phase 2 Slice 1 knowledge infrastructure", () => {
  it("registers exactly 10 unpublished glossary stubs", () => {
    expect(GLOSSARY_ENTRIES).toHaveLength(10);
    expect(GLOSSARY_ENTRIES.every((e) => e.published === false)).toBe(true);
    expect(GLOSSARY_ENTRIES.every((e) => e.review_status === "draft")).toBe(
      true
    );
  });

  it("keeps glossary index and entries noindex while unpublished", () => {
    expect(glossaryIndexRobots(GLOSSARY_ENTRIES)).toEqual({
      index: false,
      follow: false,
    });
    for (const entry of GLOSSARY_ENTRIES) {
      expect(glossaryRobots(entry)).toEqual({ index: false, follow: false });
      expect(isKnowledgePublished(entry)).toBe(false);
    }
  });

  it("excludes unpublished glossary from sitemap knowledge paths", () => {
    expect(listPublishedGlossarySitemapPaths(GLOSSARY_ENTRIES)).toEqual([]);
    expect(getKnowledgeSitemapPaths()).toEqual([]);
    const paths = mergeSitemapPaths(getMarketingSitemapBasePaths());
    expect(paths).not.toContain("/glossary");
    expect(paths.some((p) => p.startsWith("/glossary/"))).toBe(false);
    expect(paths).toContain("/reflection-ai");
    expect(paths).toContain("/articles/dont-come-with-a-question");
  });

  it("protects Article 1 as legacy_protected / grandfathered without forced pillar", () => {
    const article1 = getArticle1Legacy();
    expect(article1.slug).toBe("dont-come-with-a-question");
    expect(article1.canonical_path).toBe(
      "/articles/dont-come-with-a-question"
    );
    expect(article1.writing_constitution).toBe("legacy_protected");
    expect(article1.semantic_review).toBe("grandfathered");
    expect(article1.qa_status).toBe("grandfathered");
    expect(article1.pillar).toBeNull();
    expect(assertLegacyArticleProtected(article1)).toBe(true);
  });

  it("does not rewrite Article 1 title away from Production module", () => {
    const article1 = getArticle1Legacy();
    expect(article1.title).toContain("Don’t Come With a Question");
  });

  it("omits unpublished glossary links from semantic resolver", () => {
    expect(resolveGlossaryLink("reflection-ai")).toBeNull();
    expect(resolveRelatedGlossaryLinks(["reflection", "authorship"])).toEqual(
      []
    );
  });

  it("resolves published legacy articles for semantic links", () => {
    const link = resolveArticleLink("dont-come-with-a-question");
    expect(link?.kind).toBe("article");
    expect(link?.slug).toBe("dont-come-with-a-question");
    expect(link?.href).toBe("/articles/dont-come-with-a-question");
    expect(link?.title).toContain("Don’t Come With a Question");
  });

  it("locks Hub canonical path to existing /reflection-ai", () => {
    expect(REFLECTION_AI_HUB_CONFIG.canonical_path).toBe("/reflection-ai");
    expect(REFLECTION_AI_HUB_CONFIG.research_path).toBeNull();
    expect(REFLECTION_AI_HUB_CONFIG.identity_correction_path).toBe(
      "/reflection-without-advice"
    );
  });

  it("registers only overlay metadata for existing articles", () => {
    expect(KNOWLEDGE_ARTICLE_REGISTRY).toHaveLength(2);
    expect(
      KNOWLEDGE_ARTICLE_REGISTRY.every(
        (a) => a.writing_constitution === "legacy_protected"
      )
    ).toBe(true);
  });
});
