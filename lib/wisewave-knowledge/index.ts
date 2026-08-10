/**
 * Barrel for Phase 2 Slice 1 knowledge infrastructure.
 */

export * from "./types";
export * from "./publish";
export {
  GLOSSARY_ENTRIES,
  getGlossaryEntry,
  listGlossarySlugs,
} from "./glossary";
export {
  KNOWLEDGE_ARTICLE_REGISTRY,
  getKnowledgeArticle,
  getArticle1Legacy,
} from "./articles/registry";
export { REFLECTION_AI_HUB_CONFIG } from "./hub/config";
export {
  resolveGlossaryLink,
  resolveArticleLink,
  resolveRelatedGlossaryLinks,
  resolveRelatedArticleLinks,
  type SemanticHref,
} from "./links/semantic-links";
export {
  getKnowledgeSitemapPaths,
  mergeSitemapPaths,
} from "./sitemap-paths";
