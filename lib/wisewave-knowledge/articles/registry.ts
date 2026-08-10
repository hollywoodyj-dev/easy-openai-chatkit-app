/**
 * Article metadata registry overlay — does not rewrite Production article pages.
 * Article 1 remains legacy_protected / grandfathered.
 */

import {
  WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_HEADLINE,
  WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_SEO,
} from "@/lib/wisewave-site/wisewave-article-dont-come-with-a-question";
import {
  WISEWAVE_ARTICLE_HOW_TO_ASK_HEADLINE,
  WISEWAVE_ARTICLE_HOW_TO_ASK_SEO,
} from "@/lib/wisewave-site/wisewave-article-how-to-ask";
import type { KnowledgeArticleMeta } from "../types";

export const KNOWLEDGE_ARTICLE_REGISTRY: readonly KnowledgeArticleMeta[] = [
  {
    slug: "dont-come-with-a-question",
    title: WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_HEADLINE,
    description: WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_SEO.description,
    primary_question: null,
    primary_distinction: null,
    pillar: null,
    related_terms: [],
    related_articles: ["how-to-ask-without-giving-away-your-knowing"],
    original_phrase: null,
    open_ending: null,
    author: "Wisewave",
    review_status: "published",
    semantic_review: "grandfathered",
    qa_status: "grandfathered",
    canonical_path:
      WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_SEO.canonicalPath,
    published: true,
    published_at: null,
    updated_at: null,
    writing_constitution: "legacy_protected",
  },
  {
    slug: "how-to-ask-without-giving-away-your-knowing",
    title: WISEWAVE_ARTICLE_HOW_TO_ASK_HEADLINE,
    description: WISEWAVE_ARTICLE_HOW_TO_ASK_SEO.description,
    primary_question: null,
    primary_distinction: null,
    pillar: null,
    related_terms: [],
    related_articles: ["dont-come-with-a-question"],
    original_phrase: null,
    open_ending: null,
    author: "Wisewave",
    review_status: "published",
    semantic_review: "grandfathered",
    qa_status: "grandfathered",
    canonical_path: WISEWAVE_ARTICLE_HOW_TO_ASK_SEO.canonicalPath,
    published: true,
    published_at: null,
    updated_at: null,
    writing_constitution: "legacy_protected",
  },
] as const;

export function getKnowledgeArticle(
  slug: string
): KnowledgeArticleMeta | undefined {
  return KNOWLEDGE_ARTICLE_REGISTRY.find((a) => a.slug === slug);
}

export function getArticle1Legacy(): KnowledgeArticleMeta {
  const article = getKnowledgeArticle("dont-come-with-a-question");
  if (!article) {
    throw new Error("Article 1 missing from knowledge registry");
  }
  return article;
}
