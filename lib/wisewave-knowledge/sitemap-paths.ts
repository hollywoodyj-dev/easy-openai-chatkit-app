/**
 * Sitemap path helpers for knowledge surfaces (Slice 1).
 */

import { GLOSSARY_ENTRIES } from "./glossary";
import { listPublishedGlossarySitemapPaths } from "./publish";

/** Knowledge paths only when published (Slice 1 stubs → empty). */
export function getKnowledgeSitemapPaths(): string[] {
  return listPublishedGlossarySitemapPaths(GLOSSARY_ENTRIES);
}

export function mergeSitemapPaths(basePaths: readonly string[]): string[] {
  return [...basePaths, ...getKnowledgeSitemapPaths()];
}
