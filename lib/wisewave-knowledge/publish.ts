/**
 * Publish / indexability gates for Phase 2 knowledge surfaces.
 */

import type { GlossaryEntry, KnowledgeArticleMeta } from "./types";

/** Sitemap + robots: only when explicitly published. */
export function isKnowledgePublished(entry: {
  published: boolean;
}): boolean {
  return entry.published === true;
}

export function glossaryRobots(entry: GlossaryEntry): {
  index: boolean;
  follow: boolean;
} {
  if (!isKnowledgePublished(entry)) {
    return { index: false, follow: false };
  }
  return { index: true, follow: true };
}

export function glossaryIndexRobots(entries: readonly GlossaryEntry[]): {
  index: boolean;
  follow: boolean;
} {
  const anyPublished = entries.some(isKnowledgePublished);
  if (!anyPublished) {
    return { index: false, follow: false };
  }
  return { index: true, follow: true };
}

/** Paths safe to append to sitemap (knowledge only). */
export function listPublishedGlossarySitemapPaths(
  entries: readonly GlossaryEntry[]
): string[] {
  const paths: string[] = [];
  const published = entries.filter(isKnowledgePublished);
  if (published.length === 0) return paths;
  paths.push("/glossary");
  for (const entry of published) {
    paths.push(entry.canonical_path);
  }
  return paths;
}

export function assertLegacyArticleProtected(
  article: KnowledgeArticleMeta
): boolean {
  return (
    article.writing_constitution === "legacy_protected" &&
    (article.semantic_review === "grandfathered" ||
      article.qa_status === "grandfathered")
  );
}
