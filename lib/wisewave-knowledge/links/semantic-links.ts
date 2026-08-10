/**
 * Editorial semantic link resolver.
 * Links emit only when the target is published (or is a live legacy article path).
 * No auto-related engine; no link quotas.
 */

import { getKnowledgeArticle } from "../articles/registry";
import { getGlossaryEntry } from "../glossary";
import { isKnowledgePublished } from "../publish";

export type SemanticHref =
  | { kind: "glossary"; slug: string; href: string; title: string }
  | { kind: "article"; slug: string; href: string; title: string }
  | { kind: "path"; href: string; title: string };

export function resolveGlossaryLink(slug: string): SemanticHref | null {
  const entry = getGlossaryEntry(slug);
  if (!entry) return null;
  if (!isKnowledgePublished(entry)) return null;
  return {
    kind: "glossary",
    slug: entry.slug,
    href: entry.canonical_path,
    title: entry.title,
  };
}

export function resolveArticleLink(slug: string): SemanticHref | null {
  const article = getKnowledgeArticle(slug);
  if (!article) return null;
  if (!isKnowledgePublished(article)) return null;
  return {
    kind: "article",
    slug: article.slug,
    href: article.canonical_path,
    title: article.title,
  };
}

/** Resolve editorial related_terms → only published glossary targets. */
export function resolveRelatedGlossaryLinks(
  slugs: readonly string[]
): SemanticHref[] {
  const out: SemanticHref[] = [];
  for (const slug of slugs) {
    const link = resolveGlossaryLink(slug);
    if (link) out.push(link);
  }
  return out;
}

export function resolveRelatedArticleLinks(
  slugs: readonly string[]
): SemanticHref[] {
  const out: SemanticHref[] = [];
  for (const slug of slugs) {
    const link = resolveArticleLink(slug);
    if (link) out.push(link);
  }
  return out;
}
